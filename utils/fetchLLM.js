const fetchLlmAnswer = async (query, timeout = 600000) => {
  // Timeout de 10 minutos
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout); // Aborta después de que se cumple el timeout

  try {
    const response = await fetch("http://localhost:5100/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: query }),
      signal: controller.signal, // Añadimos el control de timeout
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const answer = await response.json();
    clearTimeout(id); // Limpiamos el timeout si la solicitud tiene éxitoconst stringAnswer = JSON.stringify(answer);
    return answer.response;
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Request timed out");
    } else {
      console.error("Error fetching data:", error);
    }
    throw error;
  }
};

module.exports = {
  fetchLlmAnswer,
};
