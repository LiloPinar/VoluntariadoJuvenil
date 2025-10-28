import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLocale } from '@/i18n/LocaleContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Save, Edit, X, CheckCircle2, AlertCircle, Camera, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, validateName, validatePhone } from '@/validations';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { t } = useLocale();
  const { toast } = useToast();
  const { user, isAuthenticated, updateUser } = useAuthContext();
  const navigate = useNavigate();

  // Scroll al top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Modo edición
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Referencia para el input de archivo
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Datos del perfil desde el contexto
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    birthDate: user?.birthDate || '',
    joinDate: user?.joinDate || '',
    avatar: user?.avatar || '',
  });

  // Actualizar profile cuando user cambie
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        location: user.location || '',
        birthDate: user.birthDate || '',
        joinDate: user.joinDate || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  // Datos temporales para edición
  const [tempProfile, setTempProfile] = useState({ ...profile });

  // Sincronizar tempProfile cuando profile cambie
  useEffect(() => {
    setTempProfile({ ...profile });
  }, [profile]);

  // Estados de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Manejo de cambios
  const handleChange = (field: string, value: string) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      validateField(field, value);
    }
  };

  // Validar campo individual
  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'firstName':
      case 'lastName':
        error = validateName(value, t);
        break;
      case 'email':
        error = validateEmail(value, t);
        break;
      case 'phone':
        error = validatePhone(value, t);
        break;
      case 'birthDate':
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          const dayDiff = today.getDate() - birthDate.getDate();
          
          // Ajustar edad si aún no ha cumplido años este año
          const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;
          
          if (actualAge < 16) {
            error = 'Debes tener al menos 16 años para registrarte';
          } else if (birthDate > today) {
            error = 'La fecha de nacimiento no puede ser futura';
          }
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Manejo de blur
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, tempProfile[field as keyof typeof tempProfile]);
  };

  // Cancelar edición
  const handleCancel = () => {
    setTempProfile({ ...profile });
    setAvatarPreview(null);
    setIsEditing(false);
    setErrors({});
    setTouched({});
  };

  // Manejo de cambio de foto de perfil
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Archivo inválido",
        description: "Por favor, selecciona una imagen (JPG, PNG, GIF).",
        variant: "destructive",
      });
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "La imagen no debe superar los 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Leer archivo y crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
      setTempProfile(prev => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  // Guardar cambios
  const handleSave = async () => {
    // Validar fecha de nacimiento primero
    let birthDateError = '';
    if (tempProfile.birthDate) {
      const birthDate = new Date(tempProfile.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;
      
      if (actualAge < 16) {
        birthDateError = 'Debes tener al menos 16 años para registrarte';
      } else if (birthDate > today) {
        birthDateError = 'La fecha de nacimiento no puede ser futura';
      }
    }

    // Validar todos los campos
    const newErrors: Record<string, string> = {
      firstName: validateName(tempProfile.firstName, t),
      lastName: validateName(tempProfile.lastName, t),
      email: validateEmail(tempProfile.email, t),
      phone: tempProfile.phone ? validatePhone(tempProfile.phone, t) : '',
      birthDate: birthDateError,
    };

    setErrors(newErrors);
    setTouched({ firstName: true, lastName: true, email: true, phone: true, birthDate: true });

    // Si hay errores, no continuar
    if (Object.values(newErrors).some(error => error)) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, corrige los errores antes de guardar.",
        variant: "destructive",
      });
      return;
    }

    // Guardar en el contexto
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Actualizar en AuthContext (esto actualiza localStorage también)
      updateUser({
        firstName: tempProfile.firstName,
        lastName: tempProfile.lastName,
        email: tempProfile.email,
        phone: tempProfile.phone,
        location: tempProfile.location,
        birthDate: tempProfile.birthDate,
        avatar: tempProfile.avatar,
      });

      setProfile({ ...tempProfile });
      setAvatarPreview(null);
      setIsEditing(false);
      setErrors({});
      setTouched({});

      toast({
        title: "Perfil actualizado",
        description: "Tus datos se han guardado correctamente.",
        className: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 dark:text-green-50",
      });
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper para obtener iniciales
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Si no hay usuario, mostrar cargando
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header currentPage="Mi Perfil" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando perfil...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="Mi Perfil" />
      
      <main className="flex-1 bg-gradient-to-br from-muted/30 via-background to-muted/20 px-4 py-12">
        <div className="container max-w-3xl mx-auto space-y-6">
          
          {/* Encabezado */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t('perfil_title')}</h1>
              <p className="text-muted-foreground mt-1">
                {t('perfil_desc')}
              </p>
            </div>
            
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar Perfil
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="gap-2 bg-gradient-to-r from-primary to-secondary"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Guardando...' : t('actualizar_perfil')}
                </Button>
              </div>
            )}
          </div>

          {/* Foto de Perfil */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-primary/20">
                    <AvatarImage 
                      src={avatarPreview || tempProfile.avatar || user?.avatar} 
                      alt={user?.fullName} 
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                      {user ? getInitials(user.fullName) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      aria-label="Cambiar foto de perfil"
                    >
                      <Camera className="h-8 w-8 text-white" />
                    </button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                
                {isEditing && (
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAvatarClick}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Cambiar Foto de Perfil
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, PNG o GIF. Máximo 5MB.
                    </p>
                  </div>
                )}
                
                {!isEditing && (
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">{profile.fullName}</h2>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información del Perfil */}
          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">{t('informacion_personal')}</CardTitle>
              <CardDescription>
                {isEditing 
                  ? 'Actualiza tu información personal y de contacto' 
                  : 'Visualiza tu información personal y de contacto'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              
              {/* Nombre */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('first_name')}
                  </Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="firstName"
                        value={tempProfile.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        onBlur={() => handleBlur('firstName')}
                        className={`h-11 ${errors.firstName && touched.firstName ? 'border-destructive' : ''}`}
                        disabled={isLoading}
                      />
                      {errors.firstName && touched.firstName && (
                        <p className="text-sm text-destructive flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.firstName}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-base p-2 bg-muted/50 rounded">{profile.firstName}</p>
                  )}
                </div>

                {/* Apellido */}
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('last_name')}
                  </Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="lastName"
                        value={tempProfile.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        onBlur={() => handleBlur('lastName')}
                        className={`h-11 ${errors.lastName && touched.lastName ? 'border-destructive' : ''}`}
                        disabled={isLoading}
                      />
                      {errors.lastName && touched.lastName && (
                        <p className="text-sm text-destructive flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.lastName}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-base p-2 bg-muted/50 rounded">{profile.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t('correo_electronico')}
                </Label>
                {isEditing ? (
                  <>
                    <Input
                      id="email"
                      type="email"
                      value={tempProfile.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={`h-11 ${errors.email && touched.email ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.email && touched.email && (
                      <p className="text-sm text-destructive flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-base p-2 bg-muted/50 rounded">{profile.email}</p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t('telefono')}
                </Label>
                {isEditing ? (
                  <>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Ej: 0987654321"
                      value={tempProfile.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      className={`h-11 ${errors.phone && touched.phone ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.phone && touched.phone && (
                      <p className="text-sm text-destructive flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.phone}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-base p-2 bg-muted/50 rounded">
                    {profile.phone || 'No especificado'}
                  </p>
                )}
              </div>

              {/* Ubicación */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('ubicacion_field')}
                </Label>
                {isEditing ? (
                  <Input
                    id="location"
                    placeholder="Ej: Manta, Ecuador"
                    value={tempProfile.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="h-11"
                    disabled={isLoading}
                  />
                ) : (
                  <p className="text-base p-2 bg-muted/50 rounded">
                    {profile.location || 'No especificado'}
                  </p>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('fecha_nacimiento')}
                </Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      id="birthDate"
                      type="date"
                      value={tempProfile.birthDate}
                      onChange={(e) => handleChange('birthDate', e.target.value)}
                      onBlur={() => handleBlur('birthDate')}
                      className={`h-11 ${errors.birthDate && touched.birthDate ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                      min={(() => {
                        // Calcular fecha mínima (16 años atrás desde hoy)
                        const minDate = new Date();
                        minDate.setFullYear(minDate.getFullYear() - 100); // Máximo 100 años
                        return minDate.toISOString().split('T')[0];
                      })()}
                      max={(() => {
                        // Calcular fecha máxima (16 años atrás desde hoy)
                        const maxDate = new Date();
                        maxDate.setFullYear(maxDate.getFullYear() - 16);
                        return maxDate.toISOString().split('T')[0];
                      })()}
                    />
                    {errors.birthDate && touched.birthDate && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.birthDate}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Debes tener al menos 16 años para registrarte
                    </p>
                  </div>
                ) : (
                  <p className="text-base p-2 bg-muted/50 rounded">
                    {profile.birthDate 
                      ? new Date(profile.birthDate).toLocaleDateString('es-EC', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'No especificado'
                    }
                  </p>
                )}
              </div>

              {/* Fecha de Registro (solo lectura) */}
              {profile.joinDate && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    {t('miembro_desde')}
                  </Label>
                  <p className="text-base p-2 bg-muted/30 rounded border">
                    {new Date(profile.joinDate).toLocaleDateString('es-EC', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Estadísticas del Usuario */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">
                  {user?.completedProjects ?? 0}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{t('proyectos_completados_count')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-secondary">
                  {user?.volunteerHours ?? 0}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{t('horas_voluntariado')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-accent">
                  {user?.recognitions ?? 0}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{t('reconocimientos')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Mensaje de información */}
          {!isEditing && (!profile.phone || !profile.location || !profile.birthDate) && (
            <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-sm text-amber-900 dark:text-amber-50">
                <strong>Completa tu perfil:</strong> Agrega tu teléfono, ubicación y fecha de nacimiento para una mejor experiencia.
              </AlertDescription>
            </Alert>
          )}
          
          {!isEditing && profile.phone && profile.location && profile.birthDate && (
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-sm text-blue-900 dark:text-blue-50">
                Mantén tu información actualizada para recibir notificaciones relevantes sobre proyectos de voluntariado.
              </AlertDescription>
            </Alert>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
