import { useState } from 'react';
import { validateEmail, validateFullName, validatePhone } from '@/validations';

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  birthDate: string;
  joinDate: string;
}

interface ProfileFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
}

interface ProfileFormTouched {
  fullName?: boolean;
  email?: boolean;
  phone?: boolean;
  location?: boolean;
}

const initialData: ProfileFormData = {
  fullName: 'María González',
  email: 'maria.gonzalez@example.com',
  phone: '+593 99 123 4567',
  location: 'Manta, Manabí',
  birthDate: '15 de marzo de 2000',
  joinDate: '10 de enero de 2024',
};

export const useProfileForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileFormData>(initialData);
  const [tempProfile, setTempProfile] = useState<ProfileFormData>(initialData);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [touched, setTouched] = useState<ProfileFormTouched>({});

  const validateField = (field: string, value: string, t: (key: string) => string) => {
    switch (field) {
      case 'fullName':
        return validateFullName(value, t);
      case 'email':
        return validateEmail(value, t);
      case 'phone':
        return validatePhone(value, t);
      case 'location':
        return value.trim() ? undefined : t('field_required');
      default:
        return undefined;
    }
  };

  const handleChange = (field: keyof ProfileFormData, value: string, t: (key: string) => string) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
    
    if (touched[field as keyof ProfileFormTouched]) {
      const error = validateField(field, value, t);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof ProfileFormTouched, t: (key: string) => string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = tempProfile[field as keyof ProfileFormData];
    const error = validateField(field, value, t);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateAll = (t: (key: string) => string) => {
    const fullNameError = validateFullName(tempProfile.fullName, t);
    const emailError = validateEmail(tempProfile.email, t);
    const phoneError = validatePhone(tempProfile.phone, t);
    const locationError = tempProfile.location.trim() ? undefined : t('field_required');

    setErrors({
      fullName: fullNameError,
      email: emailError,
      phone: phoneError,
      location: locationError,
    });

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      location: true,
    });

    return !fullNameError && !emailError && !phoneError && !locationError;
  };

  const startEditing = () => {
    setIsEditing(true);
    setTempProfile(profile);
    setErrors({});
    setTouched({});
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setTempProfile(profile);
    setErrors({});
    setTouched({});
  };

  const saveProfile = () => {
    setProfile(tempProfile);
    setIsEditing(false);
    setErrors({});
    setTouched({});
  };

  return {
    isEditing,
    profile: isEditing ? tempProfile : profile,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    startEditing,
    cancelEditing,
    saveProfile,
  };
};
