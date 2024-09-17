function obtenerSaludo() {
  const ahora = new Date(); // Obtenemos la hora actual
  const hora = ahora.getHours(); // Obtenemos solo la hora (0 - 23)

  const frasesManana = [
    "¡Buenos días! 🌅 Soy Vicky, tu asistente virtual de ViTurno. 👋🏻 Estoy lista para ayudarte a elegir el mejor plan de software de turno virtual para optimizar tu negocio.",
    "¡Hola! 🌞 Soy Vicky, la asistente virtual de ViTurno. 👋🏻 Espero que tu día comience con éxito. Estoy aquí para guiarte a encontrar el software de turno virtual ideal para tu empresa.",
    "¡Feliz mañana! ☀️ Soy Vicky, de ViTurno. 👋🏻 Si buscas el mejor plan de software de turnos para tu negocio, estoy aquí para asistirte.",
  ];

  const frasesTarde = [
    "¡Buenas tardes! ☀️ Soy Vicky, tu asistente virtual de ViTurno. 👋🏻 Estoy disponible para ayudarte a seleccionar el mejor plan de software de turnos.",
    "¡Hola, buenas tardes! 🌇 Soy Vicky de ViTurno. 👋🏻 Si necesitas ayuda para encontrar el plan ideal de software de turnos para tu negocio, estoy aquí para guiarte.",
    "¡Hola! 😊 Soy Vicky, el asistente virtual de ViTurno. 👋🏻 Es un buen momento para descubrir el plan de software de turnos perfecto para tu empresa.",
  ];

  const frasesNoche = [
    "¡Buenas noches! 🌙 Soy Vicky, el asistente virtual de ViTurno. 👋🏻 Antes de terminar tu día, estoy aquí para asistirte a encontrar el plan de software de turnos que mejor se adapte a tu negocio.",
    "¡Hola, buenas noches! ⭐ Soy Vicky, tu asistente virtual de ViTurno. 👋🏻 Si estás buscando el mejor software de turnos para tu empresa, estoy lista para ayudarte esta noche.",
    "¡Buenas noches! 🌜 Soy Vicky de ViTurno. 👋🏻 Aunque sea tarde, siempre estoy disponible para ayudarte a elegir el plan ideal de software de turnos para tu negocio.",
  ];

  let frasesElegidas;

  if (hora >= 6 && hora < 12) {
    // Si es entre las 6 AM y las 12 PM, es mañana
    frasesElegidas = frasesManana;
  } else if (hora >= 12 && hora < 18) {
    // Si es entre las 12 PM y las 6 PM, es tarde
    frasesElegidas = frasesTarde;
  } else {
    // Si es después de las 6 PM o antes de las 6 AM, es noche
    frasesElegidas = frasesNoche;
  }

  // Seleccionamos una frase aleatoria
  const fraseAleatoria =
    frasesElegidas[Math.floor(Math.random() * frasesElegidas.length)];

  return fraseAleatoria;
}

module.exports = {
  obtenerSaludo,
};
