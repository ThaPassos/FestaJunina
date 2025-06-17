import type { Usuario } from '../services/api';

const USER_STORAGE_KEY = 'festa_junina_user';

export const saveUser = (user: Usuario): void => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const getUser = (): Usuario | null => {
  try {
    const userString = localStorage.getItem(USER_STORAGE_KEY);
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Erro ao recuperar usuário do localStorage:', error);
    return null;
  }
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const isAuthenticated = (): boolean => {
  return getUser() !== null;
};

export const formatCPF = (cpf: string): string => {
  const numbers = cpf.replace(/\D/g, '');
  
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2');
  }
  return cpf;
};

export const cleanCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};