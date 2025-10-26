 import { useState, useEffect } from 'react';
import { 
  validateEmail, 
  validatePassword, 
  validateName,
  validateConfirmPassword, 
  validateTerms 
} from '@/validations';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

interface RegisterFormTouched {
  firstName?: boolean;
  lastName?: boolean;
  email?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  terms?: boolean;
}

export const useRegisterForm = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [touched, setTouched] = useState<RegisterFormTouched>({});

  // Re-validar confirmPassword cuando cambia password
  useEffect(() => {
    if (touched.confirmPassword && formData.confirmPassword) {
      const error = validateConfirmPassword(formData.password, formData.confirmPassword, (key: string) => key);
      setErrors(prev => ({ ...prev, confirmPassword: error }));
    }
  }, [formData.password, formData.confirmPassword, touched.confirmPassword]);

  const validateField = (field: string, t: (key: string) => string) => {
    switch (field) {
      case 'firstName':
        return validateName(formData.firstName, t);
      case 'lastName':
        return validateName(formData.lastName, t);
      case 'email':
        return validateEmail(formData.email, t);
      case 'password':
        return validatePassword(formData.password, t);
      case 'confirmPassword':
        return validateConfirmPassword(formData.password, formData.confirmPassword, t);
      case 'terms':
        return validateTerms(formData.acceptTerms, t);
      default:
        return undefined;
    }
  };

  const handleChange = (field: keyof RegisterFormData, value: string | boolean, t: (key: string) => string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field as keyof RegisterFormTouched]) {
      const error = validateField(field, t);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof RegisterFormTouched, t: (key: string) => string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, t);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateAll = (t: (key: string) => string) => {
    const firstNameError = validateName(formData.firstName, t);
    const lastNameError = validateName(formData.lastName, t);
    const emailError = validateEmail(formData.email, t);
    const passwordError = validatePassword(formData.password, t);
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword, t);
    const termsError = validateTerms(formData.acceptTerms, t);

    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      terms: termsError,
    });

    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });

    return !firstNameError && !lastNameError && !emailError && !passwordError && !confirmPasswordError && !termsError;
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
  };
};
