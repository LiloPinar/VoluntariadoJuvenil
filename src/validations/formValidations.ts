/**
 * Validaciones genéricas reutilizables para cualquier formulario
 */

/**
 * Valida longitud mínima de un campo
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  t: (key: string) => string
): string => {
  if (!value) return t('field_required');
  if (value.length < minLength) {
    return `El campo debe tener al menos ${minLength} caracteres`;
  }
  return '';
};

/**
 * Valida longitud máxima de un campo
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  t: (key: string) => string
): string => {
  if (value.length > maxLength) {
    return `El campo no puede exceder ${maxLength} caracteres`;
  }
  return '';
};

/**
 * Valida que un campo contenga solo letras
 */
export const validateOnlyLetters = (value: string, t: (key: string) => string): string => {
  if (!value.trim()) return t('field_required');
  
  const lettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!lettersRegex.test(value)) {
    return 'Este campo solo puede contener letras';
  }
  
  return '';
};

/**
 * Valida que un campo contenga solo números
 */
export const validateOnlyNumbers = (value: string, t: (key: string) => string): string => {
  if (!value.trim()) return t('field_required');
  
  const numbersRegex = /^\d+$/;
  if (!numbersRegex.test(value)) {
    return 'Este campo solo puede contener números';
  }
  
  return '';
};

/**
 * Valida formato de teléfono (Ecuador)
 */
export const validatePhone = (value: string, t: (key: string) => string): string => {
  if (!value.trim()) return t('field_required');
  
  // Formato: 09XXXXXXXX o +593XXXXXXXXX
  const phoneRegex = /^(\+593|0)?[0-9]{9,10}$/;
  if (!phoneRegex.test(value)) {
    return 'Formato de teléfono inválido';
  }
  
  return '';
};

/**
 * Valida rango de edad
 */
export const validateAge = (
  age: number,
  minAge: number,
  maxAge: number,
  t: (key: string) => string
): string => {
  if (!age) return t('field_required');
  if (age < minAge || age > maxAge) {
    return `La edad debe estar entre ${minAge} y ${maxAge} años`;
  }
  return '';
};

/**
 * Valida formato de URL
 */
export const validateURL = (value: string, t: (key: string) => string): string => {
  if (!value.trim()) return t('field_required');
  
  try {
    new URL(value);
    return '';
  } catch {
    return 'URL inválida';
  }
};

/**
 * Valida que un valor esté dentro de un rango
 */
export const validateRange = (
  value: number,
  min: number,
  max: number,
  t: (key: string) => string
): string => {
  if (value < min || value > max) {
    return `El valor debe estar entre ${min} y ${max}`;
  }
  return '';
};

/**
 * Valida fecha (no puede ser futura)
 */
export const validatePastDate = (date: Date, t: (key: string) => string): string => {
  const today = new Date();
  if (date > today) {
    return 'La fecha no puede ser futura';
  }
  return '';
};

/**
 * Valida fecha (no puede ser pasada)
 */
export const validateFutureDate = (date: Date, t: (key: string) => string): string => {
  const today = new Date();
  if (date < today) {
    return 'La fecha no puede ser pasada';
  }
  return '';
};
