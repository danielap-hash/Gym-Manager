import { Gym, Client, Expense, WhatsAppConfig, ActiveUser, SuperAdminProfile } from '../types';
import { INITIAL_GYMS, INITIAL_CLIENTS, INITIAL_EXPENSES, DEFAULT_WHATSAPP_CONFIG } from '../data/initialData';

const KEYS = {
  GYMS: 'gymcontrol_gyms_v1',
  CLIENTS: 'gymcontrol_clients_v1',
  EXPENSES: 'gymcontrol_expenses_v1',
  WA_CONFIG: 'gymcontrol_waconfig_v1',
  ACTIVE_USER: 'gymcontrol_activeuser_v1',
  SUPERADMIN_PROFILE: 'gymcontrol_superadmin_profile_v1',
  THEME_MODE: 'gymcontrol_thememode_v1',
};

export const getGyms = (): Gym[] => {
  try {
    const data = localStorage.getItem(KEYS.GYMS);
    return data ? JSON.parse(data) : INITIAL_GYMS;
  } catch (e) {
    return INITIAL_GYMS;
  }
};

export const saveGyms = (gyms: Gym[]) => {
  localStorage.setItem(KEYS.GYMS, JSON.stringify(gyms));
};

export const getClients = (): Client[] => {
  try {
    const data = localStorage.getItem(KEYS.CLIENTS);
    if (!data) return INITIAL_CLIENTS;
    const parsed: Client[] = JSON.parse(data);
    // Ensure every client has a DNI field
    return parsed.map((c, idx) => ({
      ...c,
      dni: c.dni || String(1092837400 + idx + 1),
    }));
  } catch (e) {
    return INITIAL_CLIENTS;
  }
};

export const saveClients = (clients: Client[]) => {
  localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
};

export const getExpenses = (): Expense[] => {
  try {
    const data = localStorage.getItem(KEYS.EXPENSES);
    return data ? JSON.parse(data) : INITIAL_EXPENSES;
  } catch (e) {
    return INITIAL_EXPENSES;
  }
};

export const saveExpenses = (expenses: Expense[]) => {
  localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
};

export const getWhatsAppConfig = (): WhatsAppConfig => {
  try {
    const data = localStorage.getItem(KEYS.WA_CONFIG);
    return data ? JSON.parse(data) : DEFAULT_WHATSAPP_CONFIG;
  } catch (e) {
    return DEFAULT_WHATSAPP_CONFIG;
  }
};

export const saveWhatsAppConfig = (config: WhatsAppConfig) => {
  localStorage.setItem(KEYS.WA_CONFIG, JSON.stringify(config));
};

export const getActiveUser = (): ActiveUser => {
  try {
    const data = localStorage.getItem(KEYS.ACTIVE_USER);
    if (data) return JSON.parse(data);
  } catch (e) {
    // fallback
  }
  return {
    role: 'gym_admin',
    gymId: 'gym_01',
    username: 'admin_fit',
    gymName: 'Gimnasio Fitness Zone'
  };
};

export const saveActiveUser = (user: ActiveUser) => {
  localStorage.setItem(KEYS.ACTIVE_USER, JSON.stringify(user));
};

export const getSuperAdminProfile = (): SuperAdminProfile => {
  try {
    const data = localStorage.getItem(KEYS.SUPERADMIN_PROFILE);
    if (data) return JSON.parse(data);
  } catch (e) {
    // fallback
  }
  return {
    name: 'Súper Administrador',
    username: 'superadmin',
    email: 'superadmin@gymcontrol.com',
    phone: '+57 300 000 0000',
    avatarUrl: '',
    password: 'super123',
  };
};

export const saveSuperAdminProfile = (profile: SuperAdminProfile) => {
  localStorage.setItem(KEYS.SUPERADMIN_PROFILE, JSON.stringify(profile));
};

export const getThemeMode = (): 'light' | 'dark' => {
  try {
    const data = localStorage.getItem(KEYS.THEME_MODE);
    if (data === 'dark' || data === 'light') return data;
  } catch (e) {
    // fallback
  }
  return 'light';
};

export const saveThemeMode = (mode: 'light' | 'dark') => {
  localStorage.setItem(KEYS.THEME_MODE, mode);
};

export const resetToDemoData = () => {
  localStorage.setItem(KEYS.GYMS, JSON.stringify(INITIAL_GYMS));
  localStorage.setItem(KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
  localStorage.setItem(KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
  localStorage.setItem(KEYS.WA_CONFIG, JSON.stringify(DEFAULT_WHATSAPP_CONFIG));
};
