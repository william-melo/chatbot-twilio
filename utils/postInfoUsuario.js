const postClientData = async ({
  nombreCliente,
  numeroCliente,
  correoEmpresa,
  nombreEmpresa,
  nombrePais,
  nombreIndustria,
  visitasDiarias,
  visitaLugarFull,
}) => {
  // Prepara los datos para enviar en la petición POST
  const data = {
    fullName: nombreCliente,
    contactNumber: numeroCliente,
    email: correoEmpresa,
    contactDate: new Date(), // Fecha actual en formato UTC
    companyName: nombreEmpresa,
    companyCountry: nombrePais,
    companyIndustry: nombreIndustria,
    dailyVisits: visitasDiarias,
    modeOfVisits: visitaLugarFull,
  };

  try {
    // Envía la petición POST
    const response = await fetch(
      "https://server-chatbot-viturno.vercel.app/clients",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    // Verifica si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    // Convierte la respuesta a JSON y la devuelve
    const answer = await response.json();
    return answer;
  } catch (error) {
    // Maneja cualquier error que ocurra
    console.error("Error fetching data:", error);
    throw error;
  }
};

module.exports = {
  postClientData,
};
