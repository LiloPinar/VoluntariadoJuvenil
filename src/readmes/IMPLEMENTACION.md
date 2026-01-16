# Guía de Implementación: Migración a Supabase

## Estado de la Migración

### ✅ Completado

#### 1. Configuración Base
- [x] `.env` con variables de entorno de Supabase
- [x] `src/lib/supabase.ts` - Cliente de Supabase con helpers de Storage
- [x] `src/types/database.types.ts` - Tipos TypeScript completos

#### 2. Contexto de Autenticación (`AuthContext.tsx`)
- [x] Login con `supabase.auth.signInWithPassword()`
- [x] Registro con `supabase.auth.signUp()` + metadata para trigger de perfil
- [x] Logout con `supabase.auth.signOut()`
- [x] Actualización de perfil con `supabase.from('profiles').update()`
- [x] Listener de cambios con `supabase.auth.onAuthStateChange()`
- [x] Estado de sesión persistente

#### 3. Páginas de Autenticación
- [x] `Login.tsx` - Flujo simplificado con Supabase Auth
- [x] `Register.tsx` - Redirección por rol después de registro
- [x] `ForgotPassword.tsx` - Envío de email con `resetPasswordForEmail()`
- [x] `ResetPassword.tsx` - Actualización de contraseña con sesión de recuperación

#### 4. Perfil de Usuario (`Profile.tsx`)
- [x] Carga de datos desde Supabase
- [x] Subida de avatar a Storage bucket `avatars`
- [x] Actualización de perfil en tabla `profiles`

#### 5. Configuración (`Configuracion.tsx`)
- [x] Cambio de contraseña con `supabase.auth.updateUser()`

#### 6. Comunidad (`Comunidad.tsx`)
- [x] Carga de usuarios desde tabla `profiles`

#### 7. Hook de Autenticación (`useAuth.tsx`)
- [x] Refactorizado para solo manejar bloqueo por intentos y "remember me"
- [x] Sistema de intentos fallidos en localStorage (seguridad cliente)

---

### ⏳ Pendiente de Migración

#### 1. ProjectContext.tsx (Alta Prioridad)
Actualmente usa localStorage para:
- `enrollments` → tabla `enrollments`
- `manual_hours` → tabla `manual_hours`
- `certificate_requests` → tabla `certificate_requests`
- `project_feedbacks` → tabla `project_feedbacks`

#### 2. NotificationContext.tsx (Media Prioridad)
Actualmente usa localStorage para:
- `notifications` → tabla `notifications`

#### 3. notificationHelpers.ts (Media Prioridad)
Funciones que envían notificaciones a localStorage:
- `sendNotificationToUser()` → INSERT a `notifications`
- `sendNotificationToAllUsers()` → Query a `profiles` + INSERT
- `notifyNewProject()`, `notifyProjectUpdate()`, etc.

#### 4. Páginas Admin (Baja Prioridad)
- Panel de administración
- Gestión de proyectos
- Revisión de inscripciones
- Gestión de actividades

#### 5. Configuración de Preferencias
- `user_preferences` tabla ya definida
- Migrar preferencias de localStorage a Supabase

---

## Pasos para Completar la Migración

### Paso 1: Ejecutar SQL en Supabase

Ejecutar el SQL completo del archivo [MODELO_DATOS_SUPABASE.md](./MODELO_DATOS_SUPABASE.md) en el SQL Editor de Supabase:

1. Ir a Supabase Dashboard → SQL Editor
2. Ejecutar en orden:
   - CREATE TYPE (ENUMs)
   - CREATE TABLE
   - TRIGGERS
   - RLS Policies

### Paso 2: Crear Storage Buckets

En Supabase Dashboard → Storage:

1. Crear bucket `avatars` (público)
2. Crear bucket `projects` (público)
3. Crear bucket `enrollment-documents` (privado)
4. Crear bucket `evidence` (privado)

Aplicar políticas RLS de Storage (ver README).

### Paso 3: Verificar Configuración

1. Verificar que `.env` tenga las credenciales correctas:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

2. Probar registro de nuevo usuario
3. Verificar que el trigger cree el perfil automáticamente
4. Probar login y logout
5. Probar actualización de perfil y avatar

---

## Notas Técnicas

### Manejo de Errores de Supabase

```typescript
const { data, error } = await supabase.auth.signInWithPassword({ email, password });

if (error) {
  // error.message contiene el mensaje legible
  // error.status contiene el código HTTP
  console.error('Error:', error.message);
}
```

### Patrón de Carga de Perfil

```typescript
const loadProfile = async (supabaseUser: SupabaseUser) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supabaseUser.id)
    .single();

  if (error) {
    console.error('Error loading profile:', error);
    return null;
  }

  return transformProfile(profile, supabaseUser.email || '');
};
```

### Subida de Archivos a Storage

```typescript
import { uploadFile, getPublicUrl } from '@/lib/supabase';

// Subir archivo
const { path, error } = await uploadFile('avatars', `${userId}/avatar.png`, file);

// Obtener URL pública
const url = getPublicUrl('avatars', path);
```

---

## Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `src/contexts/AuthContext.tsx` | Migración completa a Supabase Auth + profiles |
| `src/pages/Login.tsx` | Simplificado flujo de login |
| `src/pages/Register.tsx` | Agregado redirección por rol |
| `src/pages/Profile.tsx` | Agregado upload a Storage |
| `src/pages/ForgotPassword.tsx` | Migrado a `resetPasswordForEmail()` |
| `src/pages/ResetPassword.tsx` | Migrado a sesión de recuperación |
| `src/pages/Configuracion.tsx` | Migrado cambio de contraseña |
| `src/pages/Comunidad.tsx` | Carga usuarios desde Supabase |
| `src/hooks/useAuth.tsx` | Refactorizado (solo bloqueo/remember) |

---

## Compatibilidad con LocalStorage

Algunos datos permanecen en localStorage por diseño:
- `rememberedEmail` - Preferencia del navegador
- `loginAttempts` - Seguridad del lado cliente
- `theme`, `highContrast`, `largeText` - Hasta migrar a `user_preferences`

---

## Próximos Pasos Recomendados

1. **Migrar ProjectContext** - Es el más crítico para funcionalidad
2. **Migrar NotificationContext** - Para notificaciones en tiempo real
3. **Configurar Realtime** - Para actualizaciones en vivo
4. **Migrar Admin pages** - Último paso
