# 📚 Organización de Validaciones y Lógica de Formularios

## 🎯 Objetivo
Separar toda la lógica de validación de formularios de los componentes TSX para que el código sea **limpio, corto y mantenible**.

## 📂 Estructura de Carpetas

```
src/
├── validations/               # ✅ Funciones puras de validación
│   ├── index.ts              # Exportaciones centralizadas
│   ├── authValidations.ts    # Validaciones de autenticación
│   ├── formValidations.ts    # Validaciones genéricas
│   └── README.md             # Documentación
│
├── hooks/                     # ✅ Custom hooks para lógica de formularios
│   ├── useAuth.tsx           # Autenticación y bloqueo de seguridad
│   ├── useLoginForm.tsx      # Lógica completa del formulario de login
│   ├── useRegisterForm.tsx   # Lógica completa del formulario de registro
│   ├── useForgotPasswordForm.tsx  # Lógica de recuperar contraseña
│   └── useProfileForm.tsx    # Lógica de perfil (ver/editar)
│
└── pages/                     # ✅ Componentes UI minimalistas
    ├── Login.tsx             # Solo UI + useLoginForm
    ├── Register.tsx          # Solo UI + useRegisterForm
    ├── ForgotPassword.tsx    # Solo UI + useForgotPasswordForm
    └── Profile.tsx           # Solo UI + useProfileForm
```

---

## 🔧 Cómo Funciona

### 1️⃣ Validaciones (src/validations/)
**Funciones puras** que solo validan y retornan mensajes de error.

```typescript
// src/validations/authValidations.ts
export const validateEmail = (email: string, t: (key: string) => string) => {
  if (!email.trim()) return t('field_required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return t('invalid_email');
  return undefined; // Sin error
};
```

**✅ Ventajas:**
- Sin estado (stateless)
- Fácil de testear
- Reutilizables en cualquier formulario
- Solo 1 responsabilidad: validar

---

### 2️⃣ Custom Hooks (src/hooks/)
**Lógica de estado** del formulario: valores, errores, touched, handlers.

```typescript
// src/hooks/useLoginForm.tsx
export const useLoginForm = (initialEmail: string = '') => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value, t) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value, t);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateAll = (t) => {
    // Validar todos los campos
    return !hasErrors;
  };

  return { formData, errors, touched, handleChange, handleBlur, validateAll };
};
```

**✅ Ventajas:**
- Encapsula TODA la lógica del formulario
- Estado + validaciones + handlers en un solo lugar
- Componente TSX queda súper simple

---

### 3️⃣ Componentes (src/pages/)
**Solo UI + llamadas al hook**. MUY corto y legible.

```typescript
// src/pages/Login.tsx (VERSIÓN SIMPLIFICADA)
import { useLoginForm } from '@/hooks/useLoginForm';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const { t } = useLocale();
  const { formData, errors, touched, handleChange, handleBlur, validateAll } = useLoginForm();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll(t)) return;
    
    setIsLoading(true);
    const result = await login(formData.email, formData.password, formData.rememberMe);
    setIsLoading(false);
    // Manejar resultado...
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value, t)}
        onBlur={() => handleBlur('email', t)}
      />
      {errors.email && <p>{errors.email}</p>}
      {/* ...resto de campos... */}
    </form>
  );
};
```

**✅ Ventajas:**
- Componente de ~50-80 líneas (vs 300-400 antes)
- Fácil de leer y entender
- Solo se preocupa de renderizar UI
- Testeable fácilmente

---

## 📊 Comparación: Antes vs Después

### ❌ ANTES (Código en el componente)
```typescript
// Login.tsx - 359 líneas

const Login = () => {
  // 10 useState diferentes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  // ...
  
  // 50+ líneas de handlers
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      if (!value.trim()) setErrors(prev => ({ ...prev, email: 'Required' }));
      if (!/regex/.test(value)) setErrors(prev => ({ ...prev, email: 'Invalid' }));
    }
  };
  
  const handlePasswordChange = (e) => { /* ... */ };
  const handleBlur = (field) => { /* ... */ };
  const handleSubmit = (e) => { /* 30 líneas */ };
  
  // 200+ líneas de JSX
  return <div>...</div>;
};
```

### ✅ DESPUÉS (Separado)
```typescript
// useLoginForm.tsx - 80 líneas (hook reutilizable)
export const useLoginForm = () => {
  // Todo el estado y lógica aquí
  return { formData, errors, touched, handleChange, handleBlur, validateAll };
};

// Login.tsx - 120 líneas (solo UI)
const Login = () => {
  const { formData, errors, touched, handleChange, handleBlur, validateAll } = useLoginForm();
  const handleSubmit = async (e) => { /* 15 líneas */ };
  return <form>...</form>; // Solo JSX
};
```

---

## 🎨 Flujo de Datos

```
Usuario tipea
    ↓
handleChange('email', value, t)
    ↓
Hook actualiza formData
    ↓
Si touched, ejecuta validateEmail(value, t)
    ↓
Actualiza errors
    ↓
Componente re-renderiza con nuevo error
```

---

## 📝 Ejemplo Completo: Login Simplificado

### Archivo: `src/hooks/useLoginForm.tsx` (80 líneas)
```typescript
import { useState, useEffect } from 'react';
import { validateEmail, validatePassword } from '@/validations';

export const useLoginForm = (initialEmail = '') => {
  const [formData, setFormData] = useState({
    email: initialEmail,
    password: '',
    rememberMe: !!initialEmail,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialEmail) setFormData(prev => ({ ...prev, email: initialEmail, rememberMe: true }));
  }, [initialEmail]);

  const validateField = (field, value, t) => {
    if (field === 'email') return validateEmail(value, t);
    if (field === 'password') return validatePassword(value, t);
  };

  const handleChange = (field, value, t) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value, t);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field, t) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = formData[field];
    const error = validateField(field, value, t);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateAll = (t) => {
    const emailError = validateEmail(formData.email, t);
    const passwordError = validatePassword(formData.password, t);
    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });
    return !emailError && !passwordError;
  };

  return { formData, errors, touched, handleChange, handleBlur, validateAll };
};
```

### Archivo: `src/pages/Login.tsx` (120 líneas)
```typescript
import { useState } from 'react';
import { useLoginForm } from '@/hooks/useLoginForm';
import { useAuth } from '@/hooks/useAuth';
// ... imports de UI

const Login = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { rememberedEmail, isLocked, login } = useAuth();
  const { formData, errors, touched, handleChange, handleBlur, validateAll } = useLoginForm(rememberedEmail);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll(t)) {
      toast({ title: "Error", description: "Corrige los errores", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const result = await login(formData.email, formData.password, formData.rememberMe);
    setIsLoading(false);
    
    if (result.success) {
      toast({ title: "Éxito", description: "Bienvenido" });
      navigate('/');
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit}>
        <Input
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value, t)}
          onBlur={() => handleBlur('email', t)}
        />
        {errors.email && <p>{errors.email}</p>}
        
        <Input
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value, t)}
          onBlur={() => handleBlur('password', t)}
        />
        {errors.password && <p>{errors.password}</p>}
        
        <Checkbox
          checked={formData.rememberMe}
          onCheckedChange={(checked) => handleChange('rememberMe', checked, t)}
        />
        
        <Button type="submit" disabled={isLoading || isLocked}>
          {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
        </Button>
      </form>
      <Footer />
    </div>
  );
};
```

---

## 📈 Beneficios

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Líneas en componente** | 300-400 | 100-150 | ✅ 60% menos |
| **Responsabilidades** | UI + Estado + Validación | Solo UI | ✅ Separación clara |
| **Reutilización** | 0% | 100% | ✅ Hook reutilizable |
| **Testabilidad** | Difícil | Fácil | ✅ Funciones puras |
| **Mantenibilidad** | Baja | Alta | ✅ Código modular |

---

## 🚀 Archivos Creados

```
✅ src/validations/authValidations.ts    (6 funciones)
✅ src/validations/formValidations.ts    (11 funciones)
✅ src/validations/index.ts              (exportaciones)
✅ src/hooks/useAuth.tsx                 (seguridad + bloqueo)
✅ src/hooks/useLoginForm.tsx            (lógica login)
✅ src/hooks/useRegisterForm.tsx         (lógica register)
✅ src/hooks/useForgotPasswordForm.tsx   (lógica recuperar)
✅ src/hooks/useProfileForm.tsx          (lógica perfil)
```

**Total:** 8 archivos nuevos que simplifican 4 componentes principales.

---

## 💡 Conclusión

Con esta arquitectura:
- **Componentes:** Solo se preocupan de renderizar UI (50-150 líneas)
- **Hooks:** Manejan todo el estado y lógica (80-120 líneas cada uno)
- **Validaciones:** Funciones puras reutilizables (10-20 líneas cada una)

**Resultado:** Código limpio, mantenible, testeable y profesional. 🎉
