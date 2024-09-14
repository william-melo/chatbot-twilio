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
  const data = {
    fullName: nombreCliente,
    contactNumber: numeroCliente,
    email: correoEmpresa,
    contactDate: new Date().toISOString(),
    companyName: nombreEmpresa,
    companyCountry: nombrePais,
    companyIndustry: nombreIndustria,
    dailyVisits: visitasDiarias,
    modeOfVisits: visitaLugarFull,
  };

  try {
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

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const answer = await response.json();
    return answer;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

module.exports = {
  postClientData,
};
