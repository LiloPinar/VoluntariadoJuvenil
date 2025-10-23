# 📋 Documentación de Validaciones

## 📁 Estructura

```
src/validations/
├── authValidations.ts      # Validaciones de autenticación (Login/Register)
├── formValidations.ts      # Validaciones genéricas reutilizables
└── index.ts                # Exportaciones centralizadas
```

## 🔐 Validaciones de Autenticación (`authValidations.ts`)

### `validateRequired(value, errorMessage)`
Valida que un campo no esté vacío.

**Parámetros:**
- `value` (string): Valor a validar
- `errorMessage` (string): Mensaje de error a retornar

**Retorna:** String vacío si válido, mensaje de error si inválido

**Ejemplo:**
```typescript
const error = validateRequired(username, t('field_required'));
```

---

### `validateEmail(value, t)`
Valida formato de correo electrónico.

**Parámetros:**
- `value` (string): Email a validar
- `t` (function): Función de traducción

**Reglas:**
- No puede estar vacío
- Debe cumplir formato: `usuario@dominio.com`

**Regex:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

**Ejemplo:**
```typescript
const error = validateEmail(email, t);
// Válidos: "user@example.com", "test.user@domain.co"
// Inválidos: "user@", "@domain.com", "userdomain.com"
```

---

### `validatePassword(value, t)`
Valida contraseña con requisitos de seguridad.

**Parámetros:**
- `value` (string): Contraseña a validar
- `t` (function): Función de traducción

**Reglas:**
- No puede estar vacía
- Mínimo 6 caracteres

**Ejemplo:**
```typescript
const error = validatePassword(password, t);
// Válidos: "123456", "miPass123", "secure_password"
// Inválidos: "", "12345", "pass"
```

**Nota:** Puedes extender agregando requisitos:
- Mayúsculas/minúsculas
- Números
- Caracteres especiales

---

### `validateFullName(value, t)`
Valida nombre completo del usuario.

**Parámetros:**
- `value` (string): Nombre a validar
- `t` (function): Función de traducción

**Reglas:**
- No puede estar vacío
- Mínimo 3 caracteres

**Ejemplo:**
```typescript
const error = validateFullName(fullName, t);
// Válidos: "Juan", "María López", "José Antonio García"
// Inválidos: "", "Jo", "AB"
```

---

### `validateConfirmPassword(password, confirmPassword, t)`
Valida que la confirmación de contraseña coincida.

**Parámetros:**
- `password` (string): Contraseña original
- `confirmPassword` (string): Confirmación de contraseña
- `t` (function): Función de traducción

**Reglas:**
- `confirmPassword` no puede estar vacío
- Debe coincidir exactamente con `password`

**Ejemplo:**
```typescript
const error = validateConfirmPassword(password, confirmPassword, t);
// Válido: password="abc123", confirmPassword="abc123"
// Inválido: password="abc123", confirmPassword="abc124"
```

---

### `validateTerms(accepted, t)`
Valida aceptación de términos y condiciones.

**Parámetros:**
- `accepted` (boolean): Estado del checkbox
- `t` (function): Función de traducción

**Reglas:**
- Debe ser `true`

**Ejemplo:**
```typescript
const error = validateTerms(acceptTerms, t);
// Válido: acceptTerms=true
// Inválido: acceptTerms=false
```

---

## 🎯 Validaciones Genéricas (`formValidations.ts`)

### `validateMinLength(value, minLength, t)`
Valida longitud mínima de un campo.

**Ejemplo:**
```typescript
const error = validateMinLength(username, 5, t);
// Válido: "johndoe" (7 caracteres)
// Inválido: "john" (4 caracteres)
```

---

### `validateMaxLength(value, maxLength, t)`
Valida longitud máxima de un campo.

**Ejemplo:**
```typescript
const error = validateMaxLength(bio, 200, t);
```

---

### `validateOnlyLetters(value, t)`
Valida que solo contenga letras (incluye acentos y espacios).

**Regex:** `/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/`

**Ejemplo:**
```typescript
const error = validateOnlyLetters(name, t);
// Válidos: "José", "María Elena", "Ángel"
// Inválidos: "Jose123", "María_Elena"
```

---

### `validateOnlyNumbers(value, t)`
Valida que solo contenga números.

**Regex:** `/^\d+$/`

**Ejemplo:**
```typescript
const error = validateOnlyNumbers(cedula, t);
// Válidos: "1234567890", "0987654321"
// Inválidos: "123-456", "12 34"
```

---

### `validatePhone(value, t)`
Valida formato de teléfono ecuatoriano.

**Regex:** `/^(\+593|0)?[0-9]{9,10}$/`

**Formatos aceptados:**
- `0987654321` (10 dígitos con 0)
- `987654321` (9 dígitos sin 0)
- `+593987654321` (con código país)

**Ejemplo:**
```typescript
const error = validatePhone(phone, t);
```

---

### `validateAge(age, minAge, maxAge, t)`
Valida rango de edad.

**Ejemplo:**
```typescript
const error = validateAge(25, 18, 65, t);
// Válido: edad entre 18 y 65
```

---

### `validateURL(value, t)`
Valida formato de URL.

**Ejemplo:**
```typescript
const error = validateURL(website, t);
// Válidos: "https://example.com", "http://test.org"
// Inválidos: "example", "www.example"
```

---

### `validateRange(value, min, max, t)`
Valida que un número esté en un rango.

**Ejemplo:**
```typescript
const error = validateRange(rating, 1, 5, t);
```

---

### `validatePastDate(date, t)`
Valida que la fecha no sea futura.

**Ejemplo:**
```typescript
const error = validatePastDate(birthDate, t);
```

---

### `validateFutureDate(date, t)`
Valida que la fecha no sea pasada.

**Ejemplo:**
```typescript
const error = validateFutureDate(eventDate, t);
```

---

## 🚀 Uso en Componentes

### Importación
```typescript
// Importar específicas
import { validateEmail, validatePassword } from '@/validations';

// O importar todas
import * as validations from '@/validations';
```

### Ejemplo en Login
```typescript
import { validateEmail, validatePassword } from '@/validations';

const Login = () => {
  const { t } = useLocale();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email, t);
    const passwordError = validatePassword(password, t);
    
    if (emailError || passwordError) {
      // Mostrar errores
      return;
    }
    
    // Continuar con login
  };
};
```

### Ejemplo en Register
```typescript
import { 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword,
  validateTerms 
} from '@/validations';

const Register = () => {
  const { t } = useLocale();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = {
      email: validateEmail(email, t),
      password: validatePassword(password, t),
      confirmPassword: validateConfirmPassword(password, confirmPassword, t),
      terms: validateTerms(acceptTerms, t),
    };
    
    if (Object.values(errors).some(error => error)) {
      // Hay errores
      return;
    }
    
    // Continuar con registro
  };
};
```

---

## 🧪 Testing

### Ejemplo de Test
```typescript
import { validateEmail } from '@/validations';

describe('validateEmail', () => {
  const mockT = (key: string) => key;
  
  it('debe retornar error si el email está vacío', () => {
    expect(validateEmail('', mockT)).toBe('field_required');
  });
  
  it('debe retornar error si el formato es inválido', () => {
    expect(validateEmail('invalid-email', mockT)).toBe('invalid_email');
  });
  
  it('debe retornar string vacío si el email es válido', () => {
    expect(validateEmail('test@example.com', mockT)).toBe('');
  });
});
```

---

## ✨ Mejores Prácticas

### 1. Siempre pasar la función `t` para i18n
```typescript
// ✅ Correcto
const error = validateEmail(email, t);

// ❌ Incorrecto
const error = validateEmail(email);
```

### 2. Validar en múltiples momentos
```typescript
// Al escribir (onChange)
if (touched.email) {
  setErrors(prev => ({ ...prev, email: validateEmail(value, t) }));
}

// Al salir del campo (onBlur)
setErrors(prev => ({ ...prev, email: validateEmail(email, t) }));

// Al enviar formulario
const emailError = validateEmail(email, t);
```

### 3. Usar estados `touched` para UX
```typescript
// Solo mostrar error si el campo fue tocado
{errors.email && touched.email && (
  <p className="text-destructive">{errors.email}</p>
)}
```

### 4. Validación cruzada
```typescript
// Al cambiar password, re-validar confirmPassword si ya fue tocada
if (touched.confirmPassword) {
  setErrors(prev => ({ 
    ...prev, 
    confirmPassword: validateConfirmPassword(newPassword, confirmPassword, t) 
  }));
}
```

---

## 🔮 Extensiones Futuras

### Validaciones a agregar:
- ✅ `validateCedula` - Cédula ecuatoriana
- ✅ `validateRUC` - RUC empresarial
- ✅ `validateCreditCard` - Tarjeta de crédito
- ✅ `validateIBAN` - Cuenta bancaria internacional
- ✅ `validatePostalCode` - Código postal
- ✅ `validateIPAddress` - Dirección IP
- ✅ `validateMAC` - Dirección MAC
- ✅ `validateHex` - Color hexadecimal

### Validaciones complejas:
- Validación de fuerza de contraseña con scoring
- Validación de formularios completos con dependencias
- Validación asíncrona (verificar si email existe en BD)
- Validación de archivos (tipo, tamaño, formato)

---

## 📚 Referencias

- Regex101: https://regex101.com/
- Email Regex: https://emailregex.com/
- Validación de formularios en React: https://react-hook-form.com/

---

**Última actualización:** 23 de octubre de 2025
