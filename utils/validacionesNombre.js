function esNombreLegitimo(nombre) {
  // Validar si el nombre tiene una longitud mínima de 2 caracteres
  if (nombre.length < 2) {
    return false;
  }
  return true;
}

function formatearNombre(nombre) {
  // Eliminar espacios al principio y al final, y convertir múltiples espacios en uno solo
  let nombreFormateado = nombre.trim().replace(/\s{2,}/g, " ");

  // Convertir la primera letra de cada palabra en mayúscula
  nombreFormateado = nombreFormateado
    .split(" ")
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    )
    .join(" ");

  return nombreFormateado;
}

module.exports = {
  esNombreLegitimo,
  formatearNombre,
};
