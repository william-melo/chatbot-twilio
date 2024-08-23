function validarNombreEmpresa(companyName) {
  const minLength = 3;
  const maxLength = 50;
  const validCharacters = /^[a-zA-Z0-9\s\.\-&]+$/;
  const genericNames = ["empresa", "compañía", "negocio"];

  // Validar longitud mínima y máxima
  if (companyName.length < minLength || companyName.length > maxLength) {
    return `El nombre de la empresa debe tener entre ${minLength} y ${maxLength} caracteres.`;
  }

  // Validar caracteres permitidos
  if (!validCharacters.test(companyName)) {
    return "El nombre de la empresa contiene caracteres no permitidos.";
  }

  // Validar si hay espacios en blanco al inicio o al final
  if (companyName.trim() !== companyName) {
    return "El nombre de la empresa no debe contener espacios al inicio o al final.";
  }

  // Validar que no sea solo espacios en blanco
  if (companyName.trim() === "") {
    return "El nombre de la empresa no puede estar vacío o ser solo espacios en blanco.";
  }

  // Validar nombres genéricos
  if (genericNames.includes(companyName.trim().toLowerCase())) {
    return "El nombre de la empresa es demasiado genérico.";
  }

  // Validar que no sea solo un número
  if (!isNaN(companyName.trim())) {
    return "El nombre de la empresa no puede ser solo un número.";
  }

  // Validar formato de mayúsculas y minúsculas
  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());
  if (companyName !== capitalizeWords(companyName.toLowerCase())) {
    return "El nombre de la empresa debe tener un formato correcto de mayúsculas y minúsculas.";
  }

  // Si pasa todas las validaciones
  return "El nombre de la empresa es válido.";
}

module.exports = {
  validarNombreEmpresa,
};
