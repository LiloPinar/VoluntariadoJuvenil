/**
 * Exportación centralizada de todas las validaciones
 * Importa desde aquí: import { validateEmail, validatePassword } from '@/validations';
 */

// Validaciones de autenticación
export {
  validateRequired,
  validateEmail,
  validatePassword,
  validateFullName,
  validateName,
  validateConfirmPassword,
  validateTerms,
} from './authValidations';

// Validaciones genéricas de formularios
export {
  validateMinLength,
  validateMaxLength,
  validateOnlyLetters,
  validateOnlyNumbers,
  validatePhone,
  validateAge,
  validateURL,
  validateRange,
  validatePastDate,
  validateFutureDate,
} from './formValidations';
