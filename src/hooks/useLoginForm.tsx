import { useState, useEffect } from 'react';
import { validateEmail, validatePassword } from '@/validations';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

interface LoginFormTouched {
  email?: boolean;
  password?: boolean;
}

export const useLoginForm = (initialEmail: string = '') => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: initialEmail,
    password: '',
    rememberMe: !!initialEmail,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState<LoginFormTouched>({});

  // Actualizar email cuando cambia el email recordado
  useEffect(() => {
    if (initialEmail) {
      setFormData(prev => ({
        ...prev,
        email: initialEmail,
        rememberMe: true,
      }));
    }
  }, [initialEmail]);

  const validateField = (field: keyof LoginFormErrors, value: string, t: (key: string) => string) => {
    if (field === 'email') {
      return validateEmail(value, t);
    }
    if (field === 'password') {
      return validatePassword(value, t);
    }
    return undefined;
  };

  const handleChange = (field: keyof LoginFormData, value: string | boolean, t: (key: string) => string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (typeof value === 'string' && touched[field as keyof LoginFormTouched]) {
      const error = validateField(field as keyof LoginFormErrors, value, t);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof LoginFormErrors, t: (key: string) => string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = formData[field as keyof LoginFormData] as string;
    const error = validateField(field, value, t);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateAll = (t: (key: string) => string) => {
    const emailError = validateEmail(formData.email, t);
    const passwordError = validatePassword(formData.password, t);

    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });

    return !emailError && !passwordError;
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
