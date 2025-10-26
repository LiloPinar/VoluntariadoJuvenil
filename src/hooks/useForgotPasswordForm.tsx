import { useState } from 'react';
import { validateEmail } from '@/validations';

export const useForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleEmailChange = (value: string, t: (key: string) => string) => {
    setEmail(value);
    if (touched) {
      setError(validateEmail(value, t) || '');
    }
  };

  const handleBlur = (t: (key: string) => string) => {
    setTouched(true);
    setError(validateEmail(email, t) || '');
  };

  const validate = (t: (key: string) => string) => {
    const emailError = validateEmail(email, t);
    setError(emailError || '');
    setTouched(true);
    return !emailError;
  };

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetForm = () => {
    setEmail('');
    setError('');
    setTouched(false);
    setEmailSent(false);
    setCountdown(0);
  };

  return {
    email,
    error,
    touched,
    emailSent,
    countdown,
    handleEmailChange,
    handleBlur,
    validate,
    setEmailSent,
    startCountdown,
    resetForm,
  };
};
