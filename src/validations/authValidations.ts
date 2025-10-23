/**
 * Validaciones para formularios de autenticación
 * Login y Register
 */

/**
 * Valida que un campo no esté vacío
 */
export const validateRequired = (value: string, errorMessage: string): string => {
  return value.trim() ? '' : errorMessage;
};

/**
 * Valida formato de correo electrónico
 */
export const validateEmail = (value: string, t: (key: string) => string): string => {
  if (!value.trim()) return t('field_required');
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return t('invalid_email');
  
  return '';
};

/**
 * Valida contraseña (mínimo 6 caracteres)
 */
export const validatePassword = (value: string, t: (key: string) => string): string => {
  if (!value) return t('field_required');
  if (value.length < 6) return t('password_min_length');
  
  return '';
};

/**
 * Valida nombre completo (mínimo 3 caracteres)
 */
export const validateFullName = (value: string, t: (key: string) => string): string => {
  if (!value.trim()) return t('field_required');
  if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
  
  return '';
};

/**
 * Valida que la confirmación de contraseña coincida
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
  t: (key: string) => string
): string => {
  if (!confirmPassword) return t('field_required');
  if (confirmPassword !== password) return t('passwords_dont_match');
  
  return '';
};

/**
 * Valida que los términos y condiciones hayan sido aceptados
 */
export const validateTerms = (accepted: boolean, t: (key: string) => string): string => {
  return accepted ? '' : t('must_accept_terms');
};
