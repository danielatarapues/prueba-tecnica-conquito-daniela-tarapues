// types/index.ts
export interface Person {
  id?: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  age?: number;
  profession: string;
  address: string;
  phone: string;
  photo_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PersonFormData {
  first_name: string;
  last_name: string;
  birth_date: string;
  profession: string;
  address: string;
  phone: string;
  photo?: FileList | null;
}

export interface DashboardStats {
  professionStats: {
    profession: string;
    count: string;
  }[];
  ageRangeStats: {
    age_range: string;
    count: string;
  }[];
  monthlyStats: {
    month: string;
    count: number;
  }[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: string[];
}

export interface ApiError {
  response?: {
    data?: {
      details?: string[];
      error?: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}


export interface FileUploadProps {
  value?: FileList | null;
  onChange: (files: FileList | null) => void;
  accept?: string;
  maxSize?: number; // en bytes
  disabled?: boolean;
  error?: string;
}


// toast
export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';