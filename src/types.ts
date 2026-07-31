export type Role = 'superadmin' | 'gym_admin';

export interface GymPaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  note?: string;
}

export interface Gym {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  username: string;
  password?: string;
  subscriptionFee: number;
  nextDueDate: string; // YYYY-MM-DD
  status: 'active' | 'pending_payment' | 'suspended';
  createdAt: string;
  paymentHistory: GymPaymentHistory[];
  brandName?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface ClientPayment {
  id: string;
  date: string;
  amount: number;
  concept: string;
}

export interface Client {
  id: string;
  gymId: string;
  fullName: string;
  dni: string; // Documento de Identidad / DNI / Cédula
  age: number;
  gender: 'Masculino' | 'Femenino' | 'Otro';
  monthlyPrice: number;
  paidAmount: number; // Abono
  pendingDebt: number;
  email: string;
  phone: string;
  address: string;
  joinDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  medicalAlert: string;
  emergencyContact: string;
  billingModel?: 'Recurrente' | 'Único';
  paymentFrequency: 'Semanal' | 'Quincenal' | 'Mensual' | 'Anual';
  category: string;
  status: 'al_dia' | 'proximo_vencer' | 'atrasado' | 'parcial';
  paymentHistory: ClientPayment[];
}

export interface Expense {
  id: string;
  gymId: string;
  description: string;
  amount: number;
  category: 'Servicios' | 'Renta' | 'Suministros' | 'Nómina' | 'Otros';
  isRecurring: boolean;
  date: string; // YYYY-MM-DD
}

export type WhatsAppAppChoice = 'prompt' | 'whatsapp' | 'whatsapp_business';

export interface WhatsAppConfig {
  preferredApp: WhatsAppAppChoice;
  templates: {
    cobro: string;
    vencimiento: string;
    amistoso: string;
  };
}

export interface ActiveUser {
  role: Role;
  gymId?: string; // set if role is gym_admin or if superadmin is simulating a gym
  username: string;
  gymName?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  password?: string;
}

export interface SuperAdminProfile {
  name: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
  password?: string;
}
