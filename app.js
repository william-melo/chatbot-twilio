require("dotenv").config();

const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require("@bot-whatsapp/bot");

const TwilioProvider = require("@bot-whatsapp/provider/twilio");
const MongoAdapter = require("@bot-whatsapp/database/mongo");

const path = require("path");
const fs = require("fs");

const industriasPath = path.join(__dirname, "mensajes", "industria.txt");
const industrias = fs.readFileSync(industriasPath, "utf8");

const visitasPath = path.join(__dirname, "mensajes", "visita.txt");
const visitas = fs.readFileSync(visitasPath, "utf8");

const visitasLugarPath = path.join(__dirname, "mensajes", "visitalugar.txt");
const visitasLugar = fs.readFileSync(visitasLugarPath, "utf8");

const planEstandarPath = path.join(__dirname, "mensajes", "planEstandar.txt");
const planEstandar = fs.readFileSync(planEstandarPath, "utf8");

const validarNombreEmpresa = require("./utils/validarNombreEmpresa");
const { fetchLlmAnswer } = require("./utils/fetchLLM");
const { postClientData } = require("./utils/postInfoUsuario");

/**
 * Declaramos las conexiones de Mongo
 */

const MONGO_DB_URI = process.env.MONGO_DB_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

let correoEmpresa = "";
let numeroCliente = "";
let nombreCliente = "";
let nombreEmpresa = "";
let nombrePais = "";
let nombreIndustria = "";
let visitasDiarias = "";
let visitaLugarFull = "";
const linkPlanEstandar = "https://plan-cards-full.vercel.app/";

/*--------------------------------------------------------------------------------------------------------------------------------------------------- */

const flujoPlanEstandar = addKeyword(EVENTS.ACTION)
  .addAnswer(
    "Con base en lo que me has dicho, el plan más adecuado para ti es el Plan Estándar."
  )
  .addAnswer(planEstandar)
  .addAnswer(
    `Puedes obtener más información y adquirir este plan en el siguiente enlace: ${linkPlanEstandar}`
  )
  .addAnswer("Gracias por tu tiempo. ¡Que tengas un excelente día! 👋🏻");

const flujoRecomendaciónPlan = addKeyword(EVENTS.ACTION)
  .addAnswer(
    "Gracias por compartir la información.",
    async ({ flowDynamic }) => {
      try {
        const response = await postClientData({
          nombreCliente,
          numeroCliente,
          correoEmpresa,
          nombreEmpresa,
          nombrePais,
          nombreIndustria,
          visitasDiarias,
          visitaLugarFull,
        });

        // Aquí puedes manejar la respuesta del servidor
        console.log("Respuesta del servidor:", response);
      } catch (error) {
        // Aquí manejas el error si la solicitud falla
        console.error("Error al enviar los datos:", error);
      }
    }
  )
  .addAction(async (ctx, { gotoFlow }) => {
    try {
      switch (visitasDiarias) {
        case "1":
          return gotoFlow(flujoPlanEstandar);
        case "2":
          return gotoFlow(flujoPlanPro);
        case "3":
          return gotoFlow(flujoPlanPro);
        case "4":
          return gotoFlow(flujoPlanPlus);
      }
    } catch (error) {
      console.log(error);
    }
  });

const flujoVisitasLugar = addKeyword(EVENTS.ACTION)
  .addAnswer("¿Cómo suelen visitar las personas tu lugar?")
  .addAnswer(visitasLugar, { capture: true }, async (ctx, { gotoFlow }) => {
    if (!["1", "2", "3"].includes(ctx.body)) {
      return fallBack("Respuesta no válida, por favor intenta de nuevo.");
    }
    visitaLugarFull = ctx.body;
    return gotoFlow(flujoRecomendaciónPlan);
  });

const flujoVisitasDiarias = addKeyword(EVENTS.ACTION)
  .addAnswer("¿Cuántas personas visitan tus instalaciones diariamente?")
  .addAnswer(visitas, { capture: true }, async (ctx, { gotoFlow }) => {
    if (!["1", "2", "3", "4"].includes(ctx.body)) {
      return fallBack("Respuesta no válida, por favor intenta de nuevo.");
    }
    visitasDiarias = ctx.body;

    return gotoFlow(flujoVisitasLugar);
  });

const flujoIndustria = addKeyword(EVENTS.ACTION)
  .addAnswer("¿Qué tipo de industria representa tu empresa?")
  .addAnswer(industrias, { capture: true }, async (ctx, { gotoFlow }) => {
    if (!["1", "2", "3", "4", "5", "6"].includes(ctx.body)) {
      return fallBack("Respuesta no válida, por favor intenta de nuevo.");
    }
    nombreIndustria = ctx.body;
    return gotoFlow(flujoVisitasDiarias);
  });

const flujoPais = addKeyword(EVENTS.ACTION).addAnswer(
  "¿En qué país se encuentra tu empresa?",
  { capture: true },
  async (ctx, { gotoFlow }) => {
    nombrePais = ctx.body;
    return gotoFlow(flujoIndustria);
  }
);

const flujoNombreCliente = addKeyword(EVENTS.ACTION)
  .addAnswer("¡Perfecto! Comencemos entonces.")
  .addAnswer(
    "¿Cuál es tu nombre?",
    { capture: true },
    async (ctx, { gotoFlow, flowDynamic }) => {
      numeroCliente = ctx.from;
      nombreCliente = ctx.body;

      return gotoFlow(flujoCorreo);
    }
  );

const flujoCorreo = addKeyword(EVENTS.ACTION).addAnswer(
  "¿Cuál es tu correo de la empresa? Ej: software@electronika.info",
  { capture: true },
  async (ctx, { gotoFlow, flowDynamic }) => {
    correoEmpresa = ctx.body;

    return gotoFlow(flujoEmpresa);
  }
);

const flujoEmpresa = addKeyword(EVENTS.ACTION).addAnswer(
  "¿Cuál es el nombre de tu empresa?",
  { capture: true },
  async (ctx, { gotoFlow, flowDynamic }) => {
    nombreEmpresa = ctx.body;

    return gotoFlow(flujoPais);
  }
);

const flujoAI = addKeyword(EVENTS.ACTION).addAnswer(
  "¿En qué puedo ayudarte?",
  { capture: true },
  async (ctx, { flowDynamic }) => {
    try {
      const query = ctx.body;
      console.log(query);

      const response = await fetchLlmAnswer(query);
      console.log(response);

      if (response) {
        await flowDynamic(response);
      } else {
        throw new Error("Respuesta no válida del servidor");
      }
    } catch (error) {
      console.error("Error en flujoAI:", error); // Aquí capturamos cualquier error
      await flowDynamic(
        "Lo siento, algo salió mal. Por favor, inténtalo de nuevo más tarde."
      );
    }
  }
);

const flujoNegación = addKeyword(EVENTS.ACTION).addAnswer(
  "No hay problema. Gracias por tu tiempo. Ten un buen día!"
);

const flowPrincipal = addKeyword(EVENTS.WELCOME)
  .addAnswer(
    "¡Hola! 👋🏻 Soy el asistente virtual de ViTurno. 🔔 Estoy aquí para ayudarte a encontrar el mejor plan de software de turno virtual para tu negocio."
  )
  .addAnswer(
    [
      "Para ofrecerte la mejor recomendación, ¿te parece si te hago unas preguntas rápidas sobre tu empresa?",
      "1️⃣ Sí, estoy de acuerdo",
      "2️⃣ No, gracias",
      "3️⃣ LLm respuesta",
    ],
    {
      capture: true,
    },
    async (ctx, { fallBack, gotoFlow }) => {
      if (!["1", "2", "3"].includes(ctx.body)) {
        return fallBack("Respuesta no válida, por favor intenta de nuevo.");
      }
      switch (ctx.body) {
        case "1":
          return gotoFlow(flujoNombreCliente);
        case "2":
          return gotoFlow(flujoNegación);
        case "3":
          return gotoFlow(flujoAI);
      }
    }
  );

const main = async () => {
  const adapterDB = new MongoAdapter({
    dbUri: process.env.MONGO_DB_URI,
    dbName: process.env.MONGO_DB_NAME,
  });
  const adapterFlow = createFlow([
    flowPrincipal,
    flujoEmpresa,
    flujoPais,
    flujoIndustria,
    flujoVisitasDiarias,
    flujoVisitasLugar,
    flujoRecomendaciónPlan,
    flujoPlanEstandar,
    flujoAI,
    flujoNegación,
    flujoNombreCliente,
    flujoCorreo,
  ]);
  const adapterProvider = createProvider(TwilioProvider, {
    accountSid: process.env.ACC_SSID,
    authToken: process.env.AUTH_TOKEN,
    vendorNumber: process.env.VEND_NUMBER,
  });

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
};

main();
