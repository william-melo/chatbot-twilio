/**
 * Valida si un string es un correo electrónico válido.
 * @param {string} email - El correo a validar.
 * @returns {boolean} - Devuelve true si el correo es válido, de lo contrario false.
 */
function esCorreoValido(email) {
  // Expresión regular para validar el formato del correo electrónico.
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Verificar si el correo cumple con el formato.
  return regex.test(email);
}

// Ejemplo de uso
const email = "usuario@dominio.com";
const esValido = esCorreoValido(email);

if (esValido) {
  console.log("El correo es válido.");
} else {
  console.log("El correo no es válido.");
}