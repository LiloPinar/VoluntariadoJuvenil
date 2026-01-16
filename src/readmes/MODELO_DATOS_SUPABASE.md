# 🗄️ Modelo de Datos para Migración a Supabase

> **Documento de Arquitectura de Datos**  
> Análisis de la aplicación VoluntariaJoven para migración de LocalStorage a PostgreSQL (Supabase)

---

## 📑 Índice

1. [Análisis de Páginas](#1-análisis-de-páginas)
2. [Análisis de LocalStorage](#2-análisis-de-localstorage)
3. [Modelo de Datos](#3-modelo-de-datos)
4. [ERD (Diagrama Entidad-Relación)](#4-erd-diagrama-entidad-relación)
5. [Esquema SQL](#5-esquema-sql)
6. [Políticas RLS](#6-políticas-rls-supabase)
7. [Correspondencia LocalStorage → BD](#7-correspondencia-localstorage--bd)
8. [Suposiciones](#8-suposiciones)

---

## 1. Análisis de Páginas

### 🏠 Index (Inicio)
| Aspecto | Descripción |
|---------|-------------|
| **Funcionalidad** | Landing page con proyectos destacados y estadísticas |
| **Ve** | Lista de 6 proyectos, estadísticas globales (voluntarios, horas, proyectos) |
| **Crea/Edita** | Nada (solo lectura) |

### 📁 Proyectos
| Aspecto | Descripción |
|---------|-------------|
| **Funcionalidad** | Catálogo filtrable de todos los proyectos |
| **Ve** | Lista de proyectos con filtros (categoría, ubicación, ordenamiento) |
| **Crea/Edita** | Nada (solo lectura, puede proponer proyecto si autenticado) |

### 📋 DetalleProyecto
| Aspecto | Descripción |
|---------|-------------|
| **Funcionalidad** | Detalle de un proyecto, inscripción, actividades, feedback |
| **Ve** | Info del proyecto, estado de inscripción, actividades, progreso |
| **Crea** | Inscripción al proyecto, feedback, solicitud de baja |

### 📌 MisProyectos
| Aspecto | Descripción |
|---------|-------------|
| **Funcionalidad** | Dashboard de proyectos del usuario |
| **Ve** | Proyectos inscritos, estados, fechas, reportes de incidentes |
| **Crea** | Reportes de incidentes |

### ⏱️ MisHoras
| Aspecto | Descripción |
|---------|-------------|
| **Funcionalidad** | Registro y visualización de horas de voluntariado |
| **Ve** | Horas totales, por proyecto, actividades completadas, horas manuales |
| **Crea** | Registros de horas manuales |

### 👤 Profile
| Aspecto | Descripción |
|---------|-------------|
| **Funcionalidad** | Ver y editar perfil del usuario |
| **Ve** | Datos personales, estadísticas |
| **Edita** | Nombre, teléfono, ubicación, fecha nacimiento, avatar |

### ⚙️ Configuración
| Aspecto | Descripción |
|---------|-------------|
| **Funcionalidad** | Preferencias y seguridad de la cuenta |
| **Ve** | Configuración de notificaciones, accesibilidad, tema |
| **Edita** | Contraseña, preferencias de notificaciones, accesibilidad |

### 🎓 Certificados
| Aspecto | Descripción |
|---------|-------------|
| **Funcionalidad** | Solicitar certificados de participación |
| **Ve** | Solicitudes anteriores y su estado |
| **Crea** | Solicitudes de certificados (por proyecto, rango de fechas, general) |

### 💡 PropuestaProyecto
| Aspecto | Descripción |
|---------|-------------|
| **Funcionalidad** | Proponer nuevos proyectos de voluntariado |
| **Ve** | Formulario de propuesta |
| **Crea** | Propuestas de proyectos |

### 👥 Comunidad
| Aspecto | Descripción |
|---------|-------------|
| **Funcionalidad** | Directorio de voluntarios |
| **Ve** | Lista de usuarios registrados, estadísticas |
| **Crea/Edita** | Nada |

### 🔐 Login / Register / ForgotPassword / ResetPassword
| Aspecto | Descripción |
|---------|-------------|
| **Funcionalidad** | Autenticación y registro |
| **Crea** | Usuarios, sesiones |

---

### Páginas de Administración

| Página | Funcionalidad Principal | Gestiona |
|--------|------------------------|----------|
| **Dashboard** | Panel con estadísticas generales | Inscripciones pendientes |
| **ProjectManagement** | CRUD de proyectos | Proyectos, actividades |
| **ProposalManagement** | Revisar propuestas de usuarios | Propuestas |
| **IncidentManagement** | Gestionar reportes de incidentes | Incidentes |
| **WithdrawalManagement** | Procesar solicitudes de baja | Solicitudes de baja |
| **ManualHoursManagement** | Aprobar/rechazar horas manuales | Registros de horas |
| **CertificateManagement** | Procesar solicitudes de certificados | Certificados |
| **ActivityValidation** | Validar actividades completadas | Actividades |

---

## 2. Análisis de LocalStorage

### 📦 Estructuras Detectadas

| Key en LocalStorage | Tipo | Ámbito | Descripción |
|---------------------|------|--------|-------------|
| `users` | Lista | Global | Todos los usuarios registrados |
| `currentUser` | Objeto | Por sesión | Usuario autenticado actual |
| `adminProjects` | Lista | Global | Proyectos (con actividades) |
| `voluntariajoven_enrolled_projects` | Lista | Por usuario | Inscripciones a proyectos |
| `voluntariajoven_manual_hours` | Lista | Por usuario | Registros de horas manuales |
| `voluntariajoven_certificate_requests` | Lista | Por usuario | Solicitudes de certificados |
| `voluntariajoven_project_feedbacks` | Lista | Por usuario | Feedback de proyectos |
| `voluntariajoven_proposals` | Lista | Por usuario | Propuestas de proyectos |
| `voluntariajoven_incidents` | Lista | Por usuario | Reportes de incidentes |
| `voluntariajoven_withdrawals` | Lista | Por usuario | Solicitudes de baja |
| `notifications` | Lista | Por usuario | Notificaciones del sistema |
| `rememberedEmail` | String | Por dispositivo | Email recordado |
| `loginAttempts` | Objeto | Por dispositivo | Control de intentos fallidos |
| `darkMode` | Boolean | Por dispositivo | Preferencia de tema |
| `projectNotifications` | Boolean | Por dispositivo | Config de notificaciones |
| `reminderNotifications` | Boolean | Por dispositivo | Config de recordatorios |
| `voiceReading` | Boolean | Por dispositivo | Accesibilidad: lectura |
| `highContrast` | Boolean | Por dispositivo | Accesibilidad: contraste |
| `largeText` | Boolean | Por dispositivo | Accesibilidad: texto grande |

### 🔍 Clasificación

```
┌─────────────────────────────────────────────────────────────┐
│                    DATOS PERSISTENTES                        │
│  (Migrar a Supabase)                                        │
├─────────────────────────────────────────────────────────────┤
│ • users → auth.users + profiles                             │
│ • adminProjects → projects + activities                     │
│ • enrolled_projects → enrollments                           │
│ • manual_hours → manual_hours                               │
│ • certificate_requests → certificate_requests               │
│ • project_feedbacks → project_feedbacks                     │
│ • proposals → project_proposals                             │
│ • incidents → incidents                                     │
│ • withdrawals → withdrawal_requests                         │
│ • notifications → notifications                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 DATOS TEMPORALES/UI                          │
│  (Mantener en LocalStorage o estado)                        │
├─────────────────────────────────────────────────────────────┤
│ • currentUser → Estado React (desde Supabase Auth)          │
│ • rememberedEmail → LocalStorage (preferencia local)        │
│ • loginAttempts → LocalStorage (seguridad cliente)          │
│ • darkMode, highContrast, largeText → user_preferences      │
│ • projectNotifications, reminderNotifications → prefs       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Modelo de Datos

### A) Inventario de Entidades

#### 1. **profiles** (extiende auth.users)
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id` | UUID (PK, FK→auth.users) | ID del usuario |
| `first_name` | VARCHAR(100) | Nombre |
| `last_name` | VARCHAR(100) | Apellido |
| `phone` | VARCHAR(20) | Teléfono |
| `location` | VARCHAR(200) | Ciudad/Ubicación |
| `birth_date` | DATE | Fecha de nacimiento |
| `avatar_url` | TEXT | URL del avatar |
| `role` | ENUM('volunteer','admin') | Rol del usuario |
| `created_at` | TIMESTAMPTZ | Fecha de registro |
| `updated_at` | TIMESTAMPTZ | Última actualización |

#### 2. **projects**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id` | SERIAL (PK) | ID del proyecto |
| `title` | VARCHAR(200) | Título (ES) |
| `title_en` | VARCHAR(200) | Título (EN) |
| `description` | TEXT | Descripción (ES) |
| `description_en` | TEXT | Descripción (EN) |
| `category` | ENUM | social, environmental, educational |
| `hours` | INTEGER | Horas estimadas |
| `max_participants` | INTEGER | Máximo de participantes |
| `location` | VARCHAR(200) | Ubicación |
| `image_url` | TEXT | URL de imagen |
| `project_date` | DATE | Fecha del proyecto |
| `status` | ENUM | available, in-progress, completed |
| `is_open` | BOOLEAN | Acepta inscripciones |
| `created_by` | UUID (FK→profiles) | Admin que lo creó |
| `created_at` | TIMESTAMPTZ | Fecha de creación |

#### 3. **activities**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id` | UUID (PK) | ID de actividad |
| `project_id` | INTEGER (FK→projects) | Proyecto padre |
| `name` | VARCHAR(200) | Nombre (ES) |
| `name_en` | VARCHAR(200) | Nombre (EN) |
| `description` | TEXT | Descripción |
| `hours` | INTEGER | Horas que otorga |
| `is_completed` | BOOLEAN | Está completada |
| `validated_by` | UUID (FK→profiles) | Admin validador |
| `validated_at` | TIMESTAMPTZ | Fecha validación |

#### 4. **enrollments**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id` | UUID (PK) | ID de inscripción |
| `user_id` | UUID (FK→profiles) | Usuario inscrito |
| `project_id` | INTEGER (FK→projects) | Proyecto |
| `status` | ENUM | pending, approved, rejected |
| `phone` | VARCHAR(20) | Teléfono de contacto |
| `emergency_contact` | VARCHAR(200) | Contacto emergencia |
| `emergency_phone` | VARCHAR(20) | Tel. emergencia |
| `motivation` | TEXT | Motivación |
| `availability` | TEXT[] | Disponibilidad horaria |
| `experience` | TEXT | Experiencia previa |
| `id_document_url` | TEXT | URL documento ID |
| `signature_url` | TEXT | URL firma digital |
| `enrolled_at` | TIMESTAMPTZ | Fecha inscripción |
| `reviewed_by` | UUID (FK→profiles) | Admin revisor |
| `reviewed_at` | TIMESTAMPTZ | Fecha revisión |
| `rejection_reason` | TEXT | Motivo rechazo |

#### 5. **activity_completions**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id` | UUID (PK) | ID único |
| `activity_id` | UUID (FK→activities) | Actividad |
| `user_id` | UUID (FK→profiles) | Usuario |
| `completed_at` | TIMESTAMPTZ | Fecha completado |

#### 6. **manual_hours**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id` | UUID (PK) | ID del registro |
| `user_id` | UUID (FK→profiles) | Usuario |
| `project_id` | INTEGER (FK→projects) | Proyecto |
| `date` | DATE | Fecha de las horas |
| `hours` | INTEGER | Cantidad de horas |
| `description` | TEXT | Descripción |
| `evidence_url` | TEXT | URL evidencia |
| `status` | ENUM | pending, approved, rejected |
| `submitted_at` | TIMESTAMPTZ | Fecha envío |
| `reviewed_by` | UUID (FK→profiles) | Admin revisor |
| `reviewed_at` | TIMESTAMPTZ | Fecha revisión |
| `rejection_reason` | TEXT | Motivo rechazo |

#### 7. **certificate_requests**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id` | UUID (PK) | ID solicitud |
| `user_id` | UUID (FK→profiles) | Usuario |
| `type` | ENUM | project, dateRange, general |
| `project_id` | INTEGER (FK→projects) | Proyecto (opcional) |
| `start_date` | DATE | Fecha inicio (rango) |
| `end_date` | DATE | Fecha fin (rango) |
| `purpose` | ENUM | educational, employment, personal, other |
| `institution` | VARCHAR(200) | Institución destino |
| `observations` | TEXT | Observaciones |
| `status` | ENUM | pending, approved, rejected |
| `certificate_url` | TEXT | URL del certificado |
| `requested_at` | TIMESTAMPTZ | Fecha solicitud |
| `reviewed_by` | UUID (FK→profiles) | Admin revisor |
| `reviewed_at` | TIMESTAMPTZ | Fecha revisión |
| `rejection_reason` | TEXT | Motivo rechazo |

#### 8. **project_feedbacks**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id` | UUID (PK) | ID feedback |
| `user_id` | UUID (FK→profiles) | Usuario |
| `project_id` | INTEGER (FK→projects) | Proyecto |
| `overall_satisfaction` | SMALLINT | Satisfacción (1-5) |
| `organization` | SMALLINT | Organización (1-5) |
| `communication` | SMALLINT | Comunicación (1-5) |
| `community_impact` | SMALLINT | Impacto (1-5) |
| `would_recommend` | BOOLEAN | Recomendaría |
| `best_aspect` | TEXT | Lo mejor |
| `improvements` | TEXT | Mejoras sugeridas |
| `additional_comments` | TEXT | Comentarios |
| `is_anonymous` | BOOLEAN | Es anónimo |
| `submitted_at` | TIMESTAMPTZ | Fecha envío |

#### 9. **project_proposals**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id` | UUID (PK) | ID propuesta |
| `user_id` | UUID (FK→profiles) | Usuario proponente |
| `title` | VARCHAR(200) | Título |
| `description` | TEXT | Descripción |
| `category` | ENUM | social, environmental, educational |
| `objectives` | TEXT[] | Lista de objetivos |
| `target_audience` | TEXT | Público objetivo |
| `location` | VARCHAR(200) | Ubicación |
| `estimated_duration` | VARCHAR(50) | Duración estimada |
| `estimated_volunteers` | INTEGER | Voluntarios estimados |
| `resources` | TEXT | Recursos necesarios |
| `schedule` | TEXT[] | Horarios disponibles |
| `additional_info` | TEXT | Info adicional |
| `image_url` | TEXT | Imagen |
| `status` | ENUM | draft, submitted, in_review, approved, rejected, needs_info |
| `submitted_at` | TIMESTAMPTZ | Fecha envío |
| `reviewed_by` | UUID (FK→profiles) | Admin revisor |
| `reviewed_at` | TIMESTAMPTZ | Fecha revisión |
| `review_notes` | TEXT | Notas de revisión |

#### 10. **incidents**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id` | UUID (PK) | ID incidente |
| `project_id` | INTEGER (FK→projects) | Proyecto |
| `reporter_id` | UUID (FK→profiles) | Reportador |
| `type` | ENUM | ACCIDENT, HEALTH, CONFLICT, etc. |
| `severity` | ENUM | baja, media, alta, critica |
| `incident_date` | TIMESTAMPTZ | Fecha del incidente |
| `description` | TEXT | Descripción |
| `people_involved` | TEXT | Personas involucradas |
| `location` | VARCHAR(200) | Lugar específico |
| `evidence_url` | TEXT | URL evidencia |
| `status` | ENUM | pendiente, en_seguimiento, resuelto, cancelado |
| `admin_notes` | TEXT | Notas admin |
| `resolution_notes` | TEXT | Notas resolución |
| `reported_at` | TIMESTAMPTZ | Fecha reporte |
| `reviewed_by` | UUID (FK→profiles) | Admin revisor |
| `reviewed_at` | TIMESTAMPTZ | Fecha revisión |

#### 11. **withdrawal_requests**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id` | UUID (PK) | ID solicitud |
| `enrollment_id` | UUID (FK→enrollments) | Inscripción |
| `user_id` | UUID (FK→profiles) | Usuario |
| `project_id` | INTEGER (FK→projects) | Proyecto |
| `reason` | ENUM | PERSONAL, ACADEMIC, WORK, etc. |
| `reason_details` | TEXT | Detalles |
| `effective_date` | DATE | Fecha efectiva |
| `transition_availability` | VARCHAR(50) | Disponibilidad transición |
| `additional_comments` | TEXT | Comentarios |
| `status` | ENUM | pendiente, aprobada, rechazada, cancelada |
| `requested_at` | TIMESTAMPTZ | Fecha solicitud |
| `reviewed_by` | UUID (FK→profiles) | Admin revisor |
| `reviewed_at` | TIMESTAMPTZ | Fecha revisión |
| `reviewer_comments` | TEXT | Comentarios admin |

#### 12. **notifications**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id` | UUID (PK) | ID notificación |
| `user_id` | UUID (FK→profiles) | Usuario destino |
| `type` | ENUM | new_project, enrollment_approved, etc. |
| `title` | VARCHAR(200) | Título |
| `message` | TEXT | Mensaje |
| `data` | JSONB | Datos adicionales |
| `is_read` | BOOLEAN | Fue leída |
| `created_at` | TIMESTAMPTZ | Fecha creación |

#### 13. **user_preferences**
| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `user_id` | UUID (PK, FK→profiles) | Usuario |
| `dark_mode` | BOOLEAN | Tema oscuro |
| `high_contrast` | BOOLEAN | Alto contraste |
| `large_text` | BOOLEAN | Texto grande |
| `voice_reading` | BOOLEAN | Lectura por voz |
| `project_notifications` | BOOLEAN | Notif. proyectos |
| `reminder_notifications` | BOOLEAN | Recordatorios |
| `email_notifications` | BOOLEAN | Notif. por email |

---

### B) Relaciones y Cardinalidad

```
┌─────────────────────────────────────────────────────────────┐
│                      RELACIONES                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  auth.users ──1:1──► profiles ──1:1──► user_preferences     │
│       │                  │                                   │
│       │                  ├──1:N──► enrollments               │
│       │                  ├──1:N──► manual_hours              │
│       │                  ├──1:N──► certificate_requests      │
│       │                  ├──1:N──► project_feedbacks         │
│       │                  ├──1:N──► project_proposals         │
│       │                  ├──1:N──► incidents                 │
│       │                  ├──1:N──► withdrawal_requests       │
│       │                  ├──1:N──► notifications             │
│       │                  └──1:N──► activity_completions      │
│       │                                                      │
│  projects ──1:N──► activities                                │
│      │      └──────► activity_completions (N:M via tabla)   │
│      │                                                       │
│      ├──1:N──► enrollments                                   │
│      ├──1:N──► manual_hours                                  │
│      ├──1:N──► project_feedbacks                            │
│      ├──1:N──► incidents                                     │
│      └──1:N──► withdrawal_requests                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. ERD (Diagrama Entidad-Relación)

```
┌──────────────────┐       ┌──────────────────┐
│   auth.users     │       │  user_preferences│
│──────────────────│       │──────────────────│
│ id (PK)          │◄──────│ user_id (PK,FK)  │
│ email            │       │ dark_mode        │
│ encrypted_pwd    │       │ high_contrast    │
└────────┬─────────┘       └──────────────────┘
         │ 1:1
         ▼
┌──────────────────┐
│    profiles      │
│──────────────────│
│ id (PK,FK)       │◄─────────────────────────────────────────┐
│ first_name       │                                          │
│ last_name        │                                          │
│ role             │                                          │
└────────┬─────────┘                                          │
         │                                                     │
    ┌────┴────┬────────┬────────┬────────┬────────┐           │
    │         │        │        │        │        │           │
    ▼         ▼        ▼        ▼        ▼        ▼           │
┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐  │
│enrolls ││manual  ││cert_req││feedback││proposal││notifs  │  │
│        ││_hours  ││        ││        ││        ││        │  │
└───┬────┘└───┬────┘└────────┘└───┬────┘└────────┘└────────┘  │
    │         │                   │                            │
    │         └───────┬───────────┘                            │
    │                 │                                        │
    ▼                 ▼                                        │
┌──────────────────────┐      ┌──────────────────┐            │
│      projects        │      │    incidents     │────────────┘
│──────────────────────│      │──────────────────│
│ id (PK)              │◄─────│ project_id (FK)  │
│ title                │      │ reporter_id (FK) │
│ category             │      └──────────────────┘
│ status               │
└──────────┬───────────┘
           │ 1:N
           ▼
┌──────────────────────┐      ┌────────────────────────┐
│     activities       │      │  activity_completions  │
│──────────────────────│      │────────────────────────│
│ id (PK)              │◄─────│ activity_id (FK)       │
│ project_id (FK)      │      │ user_id (FK)           │
│ name                 │      │ completed_at           │
│ hours                │      └────────────────────────┘
└──────────────────────┘
```

---

## 5. Esquema SQL

```sql
-- ===========================================
-- TIPOS ENUM
-- ===========================================

CREATE TYPE user_role AS ENUM ('volunteer', 'admin');
CREATE TYPE project_category AS ENUM ('social', 'environmental', 'educational');
CREATE TYPE project_status AS ENUM ('available', 'in_progress', 'completed');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE certificate_type AS ENUM ('project', 'date_range', 'general');
CREATE TYPE certificate_purpose AS ENUM ('educational', 'employment', 'personal', 'other');
CREATE TYPE proposal_status AS ENUM ('draft', 'submitted', 'in_review', 'approved', 'rejected', 'needs_info');
CREATE TYPE incident_type AS ENUM ('accident', 'health', 'conflict', 'logistics', 'resources', 'security', 'equipment', 'weather', 'other');
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE incident_status AS ENUM ('pending', 'in_progress', 'resolved', 'cancelled');
CREATE TYPE withdrawal_reason AS ENUM ('personal', 'academic', 'work', 'health', 'relocation', 'schedule', 'other');
CREATE TYPE withdrawal_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE notification_type AS ENUM ('new_project', 'project_updated', 'enrollment_approved', 'enrollment_rejected', 'goal_completed', 'reminder', 'general');

-- ===========================================
-- TABLAS PRINCIPALES
-- ===========================================

-- Perfiles de usuario (extiende auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(200),
    birth_date DATE,
    avatar_url TEXT,
    role user_role DEFAULT 'volunteer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Preferencias de usuario
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    dark_mode BOOLEAN DEFAULT FALSE,
    high_contrast BOOLEAN DEFAULT FALSE,
    large_text BOOLEAN DEFAULT FALSE,
    voice_reading BOOLEAN DEFAULT FALSE,
    project_notifications BOOLEAN DEFAULT TRUE,
    reminder_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT FALSE
);

-- Proyectos
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    title_en VARCHAR(200),
    description TEXT NOT NULL,
    description_en TEXT,
    category project_category NOT NULL,
    hours INTEGER NOT NULL CHECK (hours > 0),
    max_participants INTEGER DEFAULT 50,
    location VARCHAR(200) NOT NULL,
    image_url TEXT,
    project_date DATE NOT NULL,
    status project_status DEFAULT 'available',
    is_open BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Actividades de proyectos
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    description TEXT,
    description_en TEXT,
    hours INTEGER NOT NULL CHECK (hours > 0),
    is_completed BOOLEAN DEFAULT FALSE,
    validated_by UUID REFERENCES profiles(id),
    validated_at TIMESTAMPTZ
);

-- Inscripciones a proyectos
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    status approval_status DEFAULT 'pending',
    phone VARCHAR(20),
    emergency_contact VARCHAR(200),
    emergency_phone VARCHAR(20),
    motivation TEXT,
    availability TEXT[],
    experience TEXT,
    id_document_url TEXT,
    signature_url TEXT,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    UNIQUE(user_id, project_id)
);

-- Completación de actividades (N:M)
CREATE TABLE activity_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(activity_id, user_id)
);

-- Horas manuales
CREATE TABLE manual_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hours INTEGER NOT NULL CHECK (hours > 0),
    description TEXT NOT NULL,
    evidence_url TEXT,
    status approval_status DEFAULT 'pending',
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT
);

-- Solicitudes de certificados
CREATE TABLE certificate_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type certificate_type NOT NULL,
    project_id INTEGER REFERENCES projects(id),
    start_date DATE,
    end_date DATE,
    purpose certificate_purpose NOT NULL,
    institution VARCHAR(200),
    observations TEXT,
    status approval_status DEFAULT 'pending',
    certificate_url TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT
);

-- Feedback de proyectos
CREATE TABLE project_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    overall_satisfaction SMALLINT CHECK (overall_satisfaction BETWEEN 1 AND 5),
    organization SMALLINT CHECK (organization BETWEEN 1 AND 5),
    communication SMALLINT CHECK (communication BETWEEN 1 AND 5),
    community_impact SMALLINT CHECK (community_impact BETWEEN 1 AND 5),
    would_recommend BOOLEAN,
    best_aspect TEXT,
    improvements TEXT,
    additional_comments TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, project_id)
);

-- Propuestas de proyectos
CREATE TABLE project_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category project_category NOT NULL,
    objectives TEXT[],
    target_audience TEXT,
    location VARCHAR(200),
    estimated_duration VARCHAR(50),
    estimated_volunteers INTEGER,
    resources TEXT,
    schedule TEXT[],
    additional_info TEXT,
    image_url TEXT,
    status proposal_status DEFAULT 'draft',
    submitted_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT
);

-- Incidentes
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type incident_type NOT NULL,
    severity incident_severity NOT NULL,
    incident_date TIMESTAMPTZ NOT NULL,
    description TEXT NOT NULL,
    people_involved TEXT,
    location VARCHAR(200),
    evidence_url TEXT,
    status incident_status DEFAULT 'pending',
    admin_notes TEXT,
    resolution_notes TEXT,
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ
);

-- Solicitudes de baja
CREATE TABLE withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    reason withdrawal_reason NOT NULL,
    reason_details TEXT,
    effective_date DATE NOT NULL,
    transition_availability VARCHAR(50),
    additional_comments TEXT,
    status withdrawal_status DEFAULT 'pending',
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    reviewer_comments TEXT
);

-- Notificaciones
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- ÍNDICES
-- ===========================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_date ON projects(project_date);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_project ON enrollments(project_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_activities_project ON activities(project_id);
CREATE INDEX idx_activity_completions_user ON activity_completions(user_id);
CREATE INDEX idx_manual_hours_user ON manual_hours(user_id);
CREATE INDEX idx_manual_hours_status ON manual_hours(status);
CREATE INDEX idx_certificate_requests_user ON certificate_requests(user_id);
CREATE INDEX idx_certificate_requests_status ON certificate_requests(status);
CREATE INDEX idx_incidents_project ON incidents(project_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Auto-actualizar updated_at en profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Crear perfil automáticamente al registrar usuario
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, first_name, last_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Usuario'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        'volunteer'
    );
    INSERT INTO user_preferences (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_profile_on_signup();
```

---

## 6. Políticas RLS (Supabase)

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =====================
-- PROFILES
-- =====================
CREATE POLICY "Users can view all profiles"
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- =====================
-- USER_PREFERENCES
-- =====================
CREATE POLICY "Users can manage own preferences"
    ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- =====================
-- PROJECTS (público para lectura)
-- =====================
CREATE POLICY "Anyone can view projects"
    ON projects FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects"
    ON projects FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- =====================
-- ACTIVITIES
-- =====================
CREATE POLICY "Anyone can view activities"
    ON activities FOR SELECT USING (true);

CREATE POLICY "Admins can manage activities"
    ON activities FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- =====================
-- ENROLLMENTS
-- =====================
CREATE POLICY "Users can view own enrollments"
    ON enrollments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own enrollments"
    ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all enrollments"
    ON enrollments FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can update enrollments"
    ON enrollments FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- =====================
-- MANUAL_HOURS
-- =====================
CREATE POLICY "Users can view own manual hours"
    ON manual_hours FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own manual hours"
    ON manual_hours FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all manual hours"
    ON manual_hours FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- =====================
-- NOTIFICATIONS
-- =====================
CREATE POLICY "Users can manage own notifications"
    ON notifications FOR ALL USING (auth.uid() = user_id);

-- (Patrones similares para las demás tablas...)
```

---

## 7. Correspondencia LocalStorage → BD

| LocalStorage Key | Tabla(s) Supabase | Notas |
|------------------|-------------------|-------|
| `users` | `auth.users` + `profiles` | Migrar a Supabase Auth |
| `currentUser` | Sesión Supabase | Estado manejado por SDK |
| `adminProjects` | `projects` + `activities` | Dividir en 2 tablas |
| `voluntariajoven_enrolled_projects` | `enrollments` | 1:1 mapping |
| `voluntariajoven_manual_hours` | `manual_hours` | 1:1 mapping |
| `voluntariajoven_certificate_requests` | `certificate_requests` | 1:1 mapping |
| `voluntariajoven_project_feedbacks` | `project_feedbacks` | 1:1 mapping |
| `voluntariajoven_proposals` | `project_proposals` | 1:1 mapping |
| `voluntariajoven_incidents` | `incidents` | 1:1 mapping |
| `voluntariajoven_withdrawals` | `withdrawal_requests` | 1:1 mapping |
| `notifications` | `notifications` | 1:1 mapping |
| `rememberedEmail` | **LocalStorage** | Mantener local |
| `loginAttempts` | **LocalStorage** | Mantener local |
| `darkMode`, `highContrast`, etc. | `user_preferences` | Migrar para sincronizar |

---

## 8. Suposiciones

1. **Supabase Auth**: Se usará el sistema de autenticación de Supabase (`auth.users`)
2. **UUIDs**: Todos los IDs de usuario serán UUID de Supabase
3. **Imágenes**: Se almacenarán en Supabase Storage (solo URLs en BD)
4. **Actividades**: La relación N:M usuarios↔actividades usa tabla intermedia
5. **Roles**: Solo 2 roles (volunteer/admin), extensible a futuro
6. **Idiomas**: Soporte bilingüe (ES/EN) en proyectos y actividades
7. **Soft Delete**: No implementado (se puede agregar campo `deleted_at`)
8. **Auditoría**: Campos `created_at`, `reviewed_at` para trazabilidad básica

---

> **Autor**: Análisis automático basado en código fuente  
> **Fecha**: Diciembre 2025  
> **Versión**: 1.0
