const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require("@bot-whatsapp/bot");

const TwilioProvider = require("@bot-whatsapp/provider/twilio");
const MongoAdapter = require("@bot-whatsapp/database/mongo");

require("dotenv").config();
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

/**
 * Declaramos las conexiones de Mongo
 */

const MONGO_DB_URI =
  "mongodb+srv://williammelo533:KYwbyt2tcEGM7bnQ@supercluster.qylavvv.mongodb.net/?retryWrites=true&w=majority&appName=SuperCluster";
const MONGO_DB_NAME = "db_bot";

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
  .addAnswer("Gracias por compartir la información.")
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
    console.log(visitasDiarias);
    console.log("llegamos a las visitas diarias");

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

const flujoEmpresa = addKeyword(EVENTS.ACTION)
  .addAnswer("¡Perfecto! Comencemos entonces.")
  .addAnswer(
    "¿Cuál es el nombre de tu empresa?",
    { capture: true },
    async (ctx, { gotoFlow, flowDynamic }) => {
      nombreEmpresa = ctx.body;
      return gotoFlow(flujoPais);
    }
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
    ],
    {
      capture: true,
    },
    async (ctx, { fallBack, gotoFlow }) => {
      if (!["1", "2"].includes(ctx.body)) {
        return fallBack("Respuesta no válida, por favor intenta de nuevo.");
      }
      switch (ctx.body) {
        case "1":
          return gotoFlow(flujoEmpresa);
        case "2":
          return gotoFlow(flujoNegación);
      }
    }
  );

const main = async () => {
  const adapterDB = new MongoAdapter({
    dbUri: MONGO_DB_URI,
    dbName: MONGO_DB_NAME,
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
  ]);
  const adapterProvider = createProvider(TwilioProvider, {
    accountSid: "AC67616d075f635c6e1b916b8fdac2dca6",
    authToken: "6cad6975635c3d2afdde779e5ce98aa1",
    vendorNumber: "+14155238886",
  });

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
};

main();
