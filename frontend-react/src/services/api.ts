// services/api.ts
import axios from 'axios';
import type { DashboardStats, Person, PersonFormData } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const personService = {
  // Obtener todas las personas
  getAll: async (): Promise<Person[]> => {
    const response = await api.get<Person[]>('/persons');
    return response.data;
  },

  // Crear nueva persona
  create: async (personData: PersonFormData): Promise<Person> => {
    const formData = new FormData();
    
    formData.append('first_name', personData.first_name);
    formData.append('last_name', personData.last_name);
    formData.append('birth_date', personData.birth_date);
    formData.append('profession', personData.profession);
    formData.append('address', personData.address);
    formData.append('phone', personData.phone);
    
    if (personData.photo && personData.photo[0]) {
      formData.append('photo', personData.photo[0]);
    }

    const response = await api.post<Person>('/persons', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Obtener estadísticas para el dashboard
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  // Obtener lista de profesiones
  getProfessions: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/professions');
    return response.data;
  },
};

export default personService;