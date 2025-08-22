import React, { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import styles from './PersonForm.module.css';
import FileUpload from '../FileUpload/FileUpload';

// Importar íconos de react-icons
import { HiX, HiUser, HiPhone, HiCamera } from 'react-icons/hi';
import type { PersonFormData } from '../../../types';
import personService from '../../../services/api';

interface PersonFormProps {
  onSubmit: (data: PersonFormData) => void;
  onRemove?: () => void;
  showRemoveButton?: boolean;
  isLoading?: boolean;
}

// Validación específica para celular ecuatoriano
const validateEcuadorianCellPhone = (phone: string): boolean => {
  // Limpiar el número (quitar espacios, guiones, paréntesis)
  const cleanPhone = phone.replace(/[\s\-()]/g, '');

  // Solo celular: 10 dígitos empezando con 09
  return cleanPhone.length === 10 && /^09[0-9]{8}$/.test(cleanPhone);
};

const PersonForm: React.FC<PersonFormProps> = ({
  onSubmit,
  onRemove,
  showRemoveButton = false,
  isLoading = false,
}) => {
  const [professions, setProfessions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm<PersonFormData>({
    mode: 'onChange', // Habilita validación en tiempo real
    reValidateMode: 'onChange', // Re-valida cuando cambia el valor
  });

  const watchPhoto = watch('photo');
  const watchBirthDate = watch('birth_date');

  // Cargar profesiones al montar el componente
  useEffect(() => {
    const loadProfessions = async () => {
      try {
        const data = await personService.getProfessions();
        setProfessions(data);
      } catch (error) {
        console.error('Error cargando profesiones:', error);
      }
    };
    loadProfessions();
  }, []);

  // Calcular edad automáticamente
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const handleFileChange = (files: FileList | null) => {
    setValue('photo', files);
    // Trigger validation para el campo photo si es necesario
    trigger('photo');
  };

  // Función para manejar blur en campos específicos
  const handleFieldBlur = (fieldName: keyof PersonFormData) => {
    trigger(fieldName);
  };

  const onFormSubmit: SubmitHandler<PersonFormData> = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className={styles.formCard}>
      {showRemoveButton && (
        <button
          type="button"
          onClick={onRemove}
          className={styles.removeButton}
          disabled={isLoading}
          title="Eliminar formulario"
        >
          <HiX />
        </button>
      )}

      <div className={styles.formBody}>
        <form onSubmit={handleSubmit(onFormSubmit)} className={styles.form}>

          {/* Sección de información personal */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <HiUser className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Información Personal</h3>
            </div>

            <div className={styles.gridContainer}>
              {/* Nombres */}
              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.required}`}>
                  Nombres
                </label>
                <input
                  type="text"
                  {...register('first_name', {
                    required: 'Los nombres son obligatorios',
                    minLength: {
                      value: 2,
                      message: 'Los nombres deben tener al menos 2 caracteres',
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message: 'Los nombres solo pueden contener letras y espacios'
                    }
                  })}
                  className={`${styles.input} ${errors.first_name ? styles.error : ''}`}
                  disabled={isLoading}
                  placeholder="Ej: Juan Carlos"
                  onBlur={() => handleFieldBlur('first_name')}
                />
                {errors.first_name && (
                  <span className={styles.errorText}>{errors.first_name.message}</span>
                )}
              </div>

              {/* Apellidos */}
              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.required}`}>
                  Apellidos
                </label>
                <input
                  type="text"
                  {...register('last_name', {
                    required: 'Los apellidos son obligatorios',
                    minLength: {
                      value: 2,
                      message: 'Los apellidos deben tener al menos 2 caracteres',
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message: 'Los apellidos solo pueden contener letras y espacios'
                    }
                  })}
                  className={`${styles.input} ${errors.last_name ? styles.error : ''}`}
                  disabled={isLoading}
                  placeholder="Ej: Pérez García"
                  onBlur={() => handleFieldBlur('last_name')}
                />
                {errors.last_name && (
                  <span className={styles.errorText}>{errors.last_name.message}</span>
                )}
              </div>

              {/* Fecha de nacimiento */}
              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.required}`}>
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  {...register('birth_date', {
                    required: 'La fecha de nacimiento es obligatoria',
                    validate: (value) => {
                      const today = new Date();
                      const birthDate = new Date(value);
                      const age = today.getFullYear() - birthDate.getFullYear();

                      if (birthDate > today) {
                        return 'La fecha no puede ser futura';
                      }
                      if (age > 120) {
                        return 'La edad no puede ser mayor a 120 años';
                      }
                      if (age < 0) {
                        return 'Fecha de nacimiento inválida';
                      }
                      return true;
                    }
                  })}
                  className={`${styles.input} ${errors.birth_date ? styles.error : ''}`}
                  disabled={isLoading}
                  max={new Date().toISOString().split('T')[0]}
                  onBlur={() => handleFieldBlur('birth_date')}
                />
                {errors.birth_date && (
                  <span className={styles.errorText}>{errors.birth_date.message}</span>
                )}
              </div>

              {/* Edad (calculada automáticamente) */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Edad
                </label>
                <div className={styles.calculatedField}>
                  <input
                    type="number"
                    value={watchBirthDate ? calculateAge(watchBirthDate) : ''}
                    className={`${styles.input} ${styles.calculated}`}
                    disabled
                    readOnly
                    placeholder="Se calcula automáticamente"
                  />
                  <div className={styles.ageDisplay}>
                    {watchBirthDate && calculateAge(watchBirthDate) > 0 && (
                      <span className={styles.ageText}>
                        {calculateAge(watchBirthDate)} año{calculateAge(watchBirthDate) !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <span className={styles.helpText}>Se calcula desde la fecha de nacimiento</span>
              </div>
            </div>
          </div>

          {/* Sección de información de contacto */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <HiPhone className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Información de Contacto</h3>
            </div>

            <div className={styles.gridContainer}>
              {/* Teléfono con validación específica para Ecuador */}
              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.required}`}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'El teléfono es obligatorio',
                    validate: {
                      ecuadorianCellFormat: (value) =>
                        validateEcuadorianCellPhone(value) || 'Debe ser un celular válido (Ej: 0987654321)'
                    }
                  })}
                  className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                  disabled={isLoading}
                  placeholder="0987654321"
                  onBlur={() => handleFieldBlur('phone')}
                />
                {errors.phone && (
                  <span className={styles.errorText}>{errors.phone.message}</span>
                )}
                <span className={styles.helpText}>
                  Solo números celulares (10 dígitos empezando con 09)
                </span>
              </div>

              {/* Profesión */}
              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.required}`}>
                  Profesión
                </label>
                <select
                  {...register('profession', {
                    required: 'La profesión es obligatoria',
                  })}
                  className={`${styles.input} ${styles.select} ${errors.profession ? styles.error : ''}`}
                  disabled={isLoading}
                  onBlur={() => handleFieldBlur('profession')}
                >
                  <option value="">Seleccionar profesión</option>
                  {professions.map((profession) => (
                    <option key={profession} value={profession}>
                      {profession}
                    </option>
                  ))}
                </select>
                {errors.profession && (
                  <span className={styles.errorText}>{errors.profession.message}</span>
                )}
              </div>
            </div>

            {/* Dirección - Campo completo con validación mejorada */}
            <div className={styles.formGroup}>
              <label className={`${styles.label} ${styles.required}`}>
                Dirección completa
              </label>
              <textarea
                {...register('address', {
                  required: 'La dirección es obligatoria',
                  minLength: {
                    value: 10,
                    message: 'La dirección debe ser más específica (mín. 10 caracteres)',
                  },
                  maxLength: {
                    value: 200,
                    message: 'La dirección es muy larga (máx. 200 caracteres)',
                  }
                })}
                rows={3}
                className={`${styles.input} ${styles.textarea} ${errors.address ? styles.error : ''}`}
                disabled={isLoading}
                placeholder="Ej: Av. Amazonas N24-03 y Colón, Edificio Torres del Norte, Piso 5, Quito, Pichincha"
                onBlur={() => handleFieldBlur('address')}
              />
              {errors.address && (
                <span className={styles.errorText}>{errors.address.message}</span>
              )}
              <span className={styles.helpText}>
                Incluye calle, número, barrio, ciudad y provincia
              </span>
            </div>
          </div>

          {/* Sección de foto */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <HiCamera className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Fotografía (Opcional)</h3>
            </div>

            <div className={styles.photoSection}>
              <FileUpload
                value={watchPhoto}
                onChange={handleFileChange}
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                maxSize={5 * 1024 * 1024} // 5MB
                disabled={isLoading}
                error={errors.photo?.message}
              />
              <span className={styles.helpText}>
                Formatos permitidos: JPG, PNG, GIF, WebP. Tamaño máximo: 5MB
              </span>
            </div>
          </div>

          {/* Botón de envío */}
          <div className={styles.submitSection}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading && <div className={styles.spinner} />}
              {isLoading ? 'Guardando...' : 'Guardar Persona'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonForm;