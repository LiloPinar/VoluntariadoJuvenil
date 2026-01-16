import { useState, useEffect } from 'react';

const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos en milisegundos

interface AuthState {
  rememberedEmail: string;
}

interface LoginAttempts {
  [email: string]: {
    attempts: number;
    lockoutUntil: number | null;
  };
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    rememberedEmail: '',
  });

  // Cargar estado desde localStorage al montar
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail') || '';

    // Limpiar sistema antiguo de bloqueo global (migración)
    localStorage.removeItem('failedLoginAttempts');
    localStorage.removeItem('lockoutUntil');

    setAuthState({
      rememberedEmail: savedEmail,
    });
  }, []);

  // Obtener intentos de login desde localStorage
  const getLoginAttempts = (): LoginAttempts => {
    const attempts = localStorage.getItem('loginAttempts');
    return attempts ? JSON.parse(attempts) : {};
  };

  // Guardar intentos de login en localStorage
  const saveLoginAttempts = (attempts: LoginAttempts) => {
    localStorage.setItem('loginAttempts', JSON.stringify(attempts));
  };

  // Verificar si un email específico está bloqueado
  const isEmailLocked = (email: string): boolean => {
    const attempts = getLoginAttempts();
    const userAttempts = attempts[email];
    
    if (!userAttempts) return false;
    
    if (userAttempts.lockoutUntil && userAttempts.lockoutUntil > Date.now()) {
      return true;
    }
    
    // Si el bloqueo expiró, limpiarlo
    if (userAttempts.lockoutUntil && userAttempts.lockoutUntil <= Date.now()) {
      clearEmailLockout(email);
    }
    
    return false;
  };

  // Obtener tiempo restante de bloqueo para un email en minutos
  const getEmailLockoutTimeRemaining = (email: string): number => {
    const attempts = getLoginAttempts();
    const userAttempts = attempts[email];
    
    if (!userAttempts?.lockoutUntil) return 0;
    
    const remaining = userAttempts.lockoutUntil - Date.now();
    return Math.ceil(remaining / 60000); // Convertir a minutos
  };

  // Registrar intento fallido para un email específico
  const recordFailedAttemptForEmail = (email: string) => {
    const attempts = getLoginAttempts();
    const currentAttempts = attempts[email]?.attempts || 0;
    const newAttempts = currentAttempts + 1;
    
    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lockoutTime = Date.now() + LOCKOUT_DURATION;
      
      attempts[email] = {
        attempts: newAttempts,
        lockoutUntil: lockoutTime,
      };
      
      saveLoginAttempts(attempts);
      
      return {
        isLocked: true,
        remainingAttempts: 0,
        lockoutMinutes: 15,
      };
    }
    
    attempts[email] = {
      attempts: newAttempts,
      lockoutUntil: null,
    };
    
    saveLoginAttempts(attempts);
    
    return {
      isLocked: false,
      remainingAttempts: MAX_LOGIN_ATTEMPTS - newAttempts,
      lockoutMinutes: 0,
    };
  };

  // Limpiar intentos fallidos de un email (después de login exitoso)
  const clearFailedAttemptsForEmail = (email: string) => {
    const attempts = getLoginAttempts();
    delete attempts[email];
    saveLoginAttempts(attempts);
  };

  // Limpiar bloqueo de un email (cuando expira)
  const clearEmailLockout = (email: string) => {
    const attempts = getLoginAttempts();
    delete attempts[email];
    saveLoginAttempts(attempts);
  };

  // Recordar email
  const rememberEmail = (email: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem('rememberedEmail', email);
      setAuthState({
        ...authState,
        rememberedEmail: email,
      });
    } else {
      localStorage.removeItem('rememberedEmail');
      setAuthState({
        ...authState,
        rememberedEmail: '',
      });
    }
  };

  // Olvidar email
  const forgetEmail = () => {
    localStorage.removeItem('rememberedEmail');
    setAuthState({
      ...authState,
      rememberedEmail: '',
    });
  };

  // Obtener email recordado
  const getRememberedEmail = (): string => {
    return authState.rememberedEmail;
  };

  // Pre-verificación antes de intentar login (solo verifica bloqueo)
  const checkBeforeLogin = (email: string): { canProceed: boolean; message?: string } => {
    if (isEmailLocked(email)) {
      return {
        canProceed: false,
        message: `Cuenta bloqueada por seguridad. Intenta nuevamente en ${getEmailLockoutTimeRemaining(email)} minutos.`,
      };
    }
    return { canProceed: true };
  };

  // Manejar resultado de login (llamar DESPUÉS de intentar con Supabase)
  const handleLoginResult = (email: string, success: boolean, rememberMe: boolean) => {
    if (success) {
      // Login exitoso - limpiar intentos fallidos y recordar email
      clearFailedAttemptsForEmail(email);
      rememberEmail(email, rememberMe);
      return { success: true };
    }

    // Login fallido - registrar intento
    const result = recordFailedAttemptForEmail(email);
    
    if (result.isLocked) {
      return {
        success: false,
        message: `Demasiados intentos fallidos. Tu cuenta ha sido bloqueada por ${result.lockoutMinutes} minutos por seguridad.`,
        isLocked: true,
      };
    }
    
    return {
      success: false,
      message: `Credenciales incorrectas. Te ${result.remainingAttempts === 1 ? 'queda' : 'quedan'} ${result.remainingAttempts} ${result.remainingAttempts === 1 ? 'intento' : 'intentos'}.`,
      isLocked: false,
      remainingAttempts: result.remainingAttempts,
    };
  };

  return {
    // Estado
    rememberedEmail: authState.rememberedEmail,
    
    // Métodos
    checkBeforeLogin,
    handleLoginResult,
    rememberEmail,
    forgetEmail,
    getRememberedEmail,
    isEmailLocked,
    getEmailLockoutTimeRemaining,
    recordFailedAttemptForEmail,
    clearFailedAttemptsForEmail,
  };
};
