function formatearNombrePais(nombre) {
  // Eliminar espacios al principio y al final, y reemplazar múltiples espacios por uno solo.
  let nombreFormateado = nombre.trim().replace(/\s+/g, " ");

  // Convertir la primera letra de cada palabra a mayúscula y el resto a minúscula.
  nombreFormateado = nombreFormateado
    .toLowerCase() // Convertir todo a minúsculas primero
    .replace(/\b\w/g, (letra) => letra.toUpperCase()); // Convertir la primera letra de cada palabra a mayúscula

  return nombreFormateado;
}

module.exports = {
  formatearNombrePais,
};
