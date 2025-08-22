import React, { useState } from 'react';
import type { ApiError, PersonFormData } from '../../types';
import styles from './RegisterPage.module.css';
import { useToast } from '../../hooks/useToast';
import personService from '../../services/api';


import { HiCollection, HiUser, HiPlus, HiX } from 'react-icons/hi';
import PersonForm from '../../components/Register/PersonForm/PersonForm';


const RegisterPage: React.FC = () => {
  const [forms, setForms] = useState([{ id: 1 }]);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const { showToast } = useToast();

  const addForm = () => {
    const newId = Math.max(...forms.map(f => f.id)) + 1;
    setForms(prev => [...prev, { id: newId }]);
  };

  const removeForm = (id: number) => {
    if (forms.length > 1) {
      setForms(prev => prev.filter(form => form.id !== id));
    }
  };

  const handleSubmit = async (formId: number, data: PersonFormData) => {
    try {
      setLoading(prev => ({ ...prev, [formId]: true }));

      await personService.create(data);

      showToast('Persona registrada exitosamente', 'success');

      if (forms.length === 1) {
        // El formulario se limpia automáticamente en PersonForm
      } else {
        removeForm(formId);
      }

    } catch (error) {
      console.error('Error registrando persona:', error);

      const apiError = error as ApiError;
      
      if (apiError.response?.data?.details) {
        showToast(`Error: ${apiError.response.data.details.join(', ')}`, 'error');
      } else if (apiError.response?.data?.error) {
        showToast(apiError.response.data.error, 'error');
      } else if (apiError.response?.data?.message) {
        showToast(apiError.response.data.message, 'error');
      } else if (apiError.message) {
        showToast(apiError.message, 'error');
      } else {
        showToast('Error registrando persona', 'error');
      }
    } finally {
      setLoading(prev => ({ ...prev, [formId]: false }));
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1>Registro de Personas</h1>
            <p>Complete la información para registrar una o más personas</p>
          </div>
        </div>
      </div>

      {/* Layout principal: panel lateral + formularios */}
      <div className={styles.mainContent}>
        {/* Panel lateral para controles */}
        <div className={styles.sidePanel}>
          <button
            onClick={addForm}
            className={styles.addButton}
          >
            Agregar Formulario
            <HiPlus />
          </button>

          {/* Estadísticas de formularios */}
          {forms.length > 1 && (
            <div className={styles.statsAlert}>
              <p className={styles.statsText}>
                <HiCollection className={styles.statsIcon} />
                {forms.length} formulario{forms.length !== 1 ? 's' : ''} activo{forms.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Panel derecho: Formularios */}
        <div className={styles.contentPanel}>
          <div className={styles.formsContainer}>
            {forms.map((form, index) => (
              <div key={form.id} className={styles.formWrapper}>
                {/* Header con título y botón de eliminar */}
                <div className={styles.formHeader}>
                  <h2 className={styles.formTitle}>
                    <HiUser className={styles.personIcon} />
                    Persona {index + 1}
                  </h2>

                  {/* Botón de eliminar solo si hay más de un formulario */}
                  {forms.length > 1 && (
                    <button
                      onClick={() => removeForm(form.id)}
                      className={styles.formRemoveButton}
                      disabled={loading[form.id] || false}
                      title="Eliminar formulario"
                    >
                      <HiX />
                      Eliminar
                    </button>
                  )}
                </div>

                {/* Formulario sin botón de eliminar interno */}
                <PersonForm
                  onSubmit={(data) => handleSubmit(form.id, data)}
                  isLoading={loading[form.id] || false}
                />
              </div>
            ))}

            {/* Botón para agregar formulario al final */}
            <button
              onClick={addForm}
              className={styles.addFormButton}
            >
              <HiPlus />
              Agregar Otra Persona
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;