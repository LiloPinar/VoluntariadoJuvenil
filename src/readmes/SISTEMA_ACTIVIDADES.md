# Sistema de Actividades y Objetivos

## 📋 Descripción General

El sistema de actividades permite a los administradores dividir los proyectos en tareas más pequeñas y manejables, facilitando el seguimiento del progreso y la validación de horas de los voluntarios.

## ✨ Características Principales

### Para Administradores:

1. **Crear Actividades**
   - Definir nombre y descripción de cada actividad
   - Asignar horas específicas a cada actividad
   - Control automático: las horas totales no pueden exceder las horas del proyecto

2. **Editar Actividades**
   - Modificar detalles de actividades existentes
   - Ajustar horas asignadas
   - Reasignar recursos según avance del proyecto

3. **Eliminar Actividades**
   - Remover actividades que ya no son necesarias
   - Advertencia si la actividad tiene participantes registrados

4. **Validar Participación**
   - Marcar actividades como completadas
   - Registrar usuarios que participaron en cada actividad
   - Rastrear quién validó y cuándo

### Para Usuarios/Voluntarios:

1. **Visualizar Actividades**
   - Ver todas las actividades del proyecto al inscribirse
   - Conocer las horas de cada actividad
   - Entender el desglose del proyecto

2. **Seguimiento de Progreso**
   - Ver qué actividades han completado
   - Acumular horas por actividad
   - Tener registro detallado de su participación

## 🏗️ Estructura de Datos

### Interface Activity
```typescript
interface Activity {
  id: string;                 // ID único de la actividad
  name: string;              // Nombre de la actividad
  description: string;       // Descripción detallada
  hours: number;             // Horas asignadas
  completedBy: string[];     // IDs de usuarios que la completaron
  validatedBy?: string;      // ID del admin que validó
  validatedAt?: string;      // Fecha de validación
  isCompleted: boolean;      // Estado de la actividad
}
```

### Interface Project (actualizada)
```typescript
interface Project {
  // ... campos existentes
  activities?: Activity[];   // Array de actividades del proyecto
}
```

## 🎯 Casos de Uso

### Ejemplo 1: Proyecto de Reforestación (4 horas)
```
✅ Preparación del terreno - 1h
✅ Plantación de árboles - 2h
✅ Riego y mantenimiento - 1h
---
Total: 4h (100% del proyecto)
```

### Ejemplo 2: Proyecto de Alfabetización Digital (6 horas)
```
✅ Configuración de equipos - 1h
✅ Clase básica de navegación - 2h
✅ Ejercicios prácticos - 2h
✅ Evaluación y cierre - 1h
---
Total: 6h (100% del proyecto)
```

## 🔄 Flujo de Trabajo

### Administrador:
1. Crear/Editar proyecto
2. Acceder a la pestaña "Actividades"
3. Agregar actividades con sus respectivas horas
4. Durante el proyecto, validar actividades completadas
5. Registrar participantes en cada actividad

### Voluntario:
1. Inscribirse en un proyecto
2. Ver las actividades planificadas
3. Participar en las actividades
4. Esperar validación del administrador
5. Ver horas acumuladas en su perfil

## 📊 Beneficios

1. **Mejor Organización**: Desglose claro de tareas
2. **Seguimiento Preciso**: Registro detallado de horas por actividad
3. **Transparencia**: Voluntarios saben exactamente qué se espera
4. **Flexibilidad**: Actividades se pueden ajustar según necesidades
5. **Validación**: Sistema de aprobación por administrador
6. **Historial**: Registro completo de participación

## 🔐 Validaciones

- ✅ Las horas de actividades no pueden exceder las horas del proyecto
- ✅ No se pueden eliminar actividades con participantes (advertencia)
- ✅ Solo administradores pueden crear/editar/eliminar actividades
- ✅ Solo administradores pueden validar participación
- ✅ Los voluntarios solo pueden ver sus actividades asignadas

## 🚀 Próximas Mejoras

- [ ] Página para validar actividades desde el dashboard de admin
- [ ] Notificaciones cuando se valida una actividad
- [ ] Certificados por actividad completada
- [ ] Estadísticas de actividades más populares
- [ ] Exportar reportes de participación por actividad
- [ ] Sistema de calificación por actividad
