import { Gym, Client, Expense, WhatsAppConfig } from '../types';

export const INITIAL_GYMS: Gym[] = [
  {
    id: 'gym_01',
    name: 'Gimnasio Fitness Zone',
    brandName: 'GYM MANAGER',
    ownerName: 'Carlos Mendoza',
    email: 'contacto@fitnesszone.com',
    phone: '+573001234567',
    username: 'admin_fit',
    password: 'fit123',
    subscriptionFee: 150000,
    nextDueDate: '2026-08-15',
    status: 'active',
    createdAt: '2026-01-10',
    primaryColor: '#2563eb', // Royal Blue
    secondaryColor: '#1d4ed8',
    logoUrl: '',
    paymentHistory: [
      { id: 'gp_1', date: '2026-07-15', amount: 150000, method: 'Transferencia', note: 'Pago cuota mensual' },
      { id: 'gp_2', date: '2026-06-15', amount: 150000, method: 'Efectivo', note: 'Pago cuota mensual' }
    ]
  },
  {
    id: 'gym_02',
    name: 'CrossFit Olimpo',
    brandName: 'CROSSFIT OLIMPO',
    ownerName: 'Lucía Benítez',
    email: 'admin@crossfitolimpo.com',
    phone: '+573159876543',
    username: 'admin_olimpo',
    password: 'olimpo123',
    subscriptionFee: 180000,
    nextDueDate: '2026-08-01',
    status: 'pending_payment',
    createdAt: '2026-02-01',
    primaryColor: '#eab308', // Amber / Gold
    secondaryColor: '#ca8a04',
    logoUrl: '',
    paymentHistory: [
      { id: 'gp_3', date: '2026-07-01', amount: 180000, method: 'Transferencia', note: 'Pago Julio' }
    ]
  },
  {
    id: 'gym_03',
    name: 'Iron Gym Power Center',
    brandName: 'IRON GYM',
    ownerName: 'Roberto Gómez',
    email: 'irongym@gmail.com',
    phone: '+573204567890',
    username: 'admin_iron',
    password: 'iron123',
    subscriptionFee: 200000,
    nextDueDate: '2026-07-20',
    status: 'suspended',
    createdAt: '2025-11-15',
    primaryColor: '#dc2626', // Red
    secondaryColor: '#b91c1c',
    logoUrl: '',
    paymentHistory: []
  }
];

const FIRST_NAMES = [
  'Alejandro', 'Sofia', 'Mateo', 'Valentina', 'Santiago', 'Camila', 'Sebastian', 'Mariana',
  'Nicolas', 'Isabella', 'Daniel', 'Gabriela', 'Diego', 'Lucia', 'Samuel', 'Victoria',
  'Joaquin', 'Emma', 'Tomas', 'Martina', 'Lucas', 'Luciana', 'Gabriel', 'Elena',
  'Emmanuel', 'Mia', 'Benjamin', 'Antonella', 'David', 'Renata', 'Felipe', 'Paula',
  'Esteban', 'Sara', 'Andres', 'Catalina', 'Julian', 'Jimena', 'Adrian', 'Valeria'
];

const LAST_NAMES = [
  'Rodriguez', 'Gomez', 'Gonzales', 'Martinez', 'Garcia', 'Lopez', 'Hernandez', 'Diaz',
  'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Flores', 'Vargas', 'Castro', 'Morales',
  'Alvarez', 'Rojas', 'Reyes', 'Gutierrez', 'Ortiz', 'Navarro', 'Mendoza', 'Silva'
];

const CATEGORIES = ['Gimnasio', 'Musculación', 'Crossfit', 'Personalizado'];

function generateMockClients(): Client[] {
  const clients: Client[] = [
    {
      id: 'cli_01',
      gymId: 'gym_01',
      fullName: 'Juan Pérez',
      dni: '1092837401',
      age: 28,
      gender: 'Masculino',
      monthlyPrice: 60000,
      paidAmount: 0,
      pendingDebt: 60000,
      email: 'juan.perez@gmail.com',
      phone: '+573001112233',
      address: 'Calle 45 # 12-34',
      joinDate: '2026-03-01',
      dueDate: '2026-07-28',
      medicalAlert: 'Ninguna alergia reportada',
      emergencyContact: '+573009998877',
      paymentFrequency: 'Mensual',
      category: 'Gimnasio',
      status: 'atrasado',
      paymentHistory: [{ id: 'cp_1', date: '2026-03-01', amount: 60000, concept: 'Mensualidad Marzo' }]
    },
    {
      id: 'cli_02',
      gymId: 'gym_01',
      fullName: 'María Rodríguez',
      dni: '1092837402',
      age: 32,
      gender: 'Femenino',
      monthlyPrice: 60000,
      paidAmount: 60000,
      pendingDebt: 0,
      email: 'maria.rod@hotmail.com',
      phone: '+573104445566',
      address: 'Carrera 10 # 5-67',
      joinDate: '2026-05-10',
      dueDate: '2026-08-20',
      medicalAlert: 'Asma leve, lleva inhalador',
      emergencyContact: '+573112223344',
      paymentFrequency: 'Mensual',
      category: 'Musculación',
      status: 'al_dia',
      paymentHistory: [{ id: 'cp_2', date: '2026-07-20', amount: 60000, concept: 'Mensualidad Julio' }]
    },
  ];

  for (let i = 3; i <= 175; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName1 = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const lastName2 = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName1} ${lastName2}`;
    
    const dni = String(1092837400 + i);
    const gymId = i % 5 === 0 ? 'gym_02' : i % 8 === 0 ? 'gym_03' : 'gym_01';
    const cat = CATEGORIES[i % CATEGORIES.length];
    const age = 18 + (i % 38);
    const gender = i % 2 === 0 ? 'Femenino' : 'Masculino';
    const price = 60000 + (i % 4) * 10000;

    let status: Client['status'] = 'al_dia';
    let paid = price;
    let debt = 0;
    let dueDate = '2026-08-28';

    if (i % 5 === 0) {
      status = 'atrasado';
      paid = 0;
      debt = price;
      dueDate = '2026-07-15';
    } else if (i % 7 === 0) {
      status = 'proximo_vencer';
      paid = price;
      debt = 0;
      dueDate = '2026-07-29';
    } else if (i % 9 === 0) {
      status = 'parcial';
      paid = price / 2;
      debt = price / 2;
      dueDate = '2026-07-25';
    }

    clients.push({
      id: `cli_${i < 10 ? '0' + i : i}`,
      gymId,
      fullName,
      dni,
      age,
      gender,
      monthlyPrice: price,
      paidAmount: paid,
      pendingDebt: debt,
      email: `${firstName.toLowerCase()}.${lastName1.toLowerCase()}${i}@gmail.com`,
      phone: `+57300${1000000 + (i * 357) % 9000000}`,
      address: `Calle ${10 + (i % 80)} # ${5 + (i % 30)}-${12 + (i % 40)}`,
      joinDate: '2026-01-10',
      dueDate,
      medicalAlert: i % 12 === 0 ? 'Hipertensión leve' : 'Ninguna',
      emergencyContact: `+57310${9000000 - (i * 123) % 8000000}`,
      paymentFrequency: 'Mensual',
      category: cat,
      status,
      paymentHistory: [
        { id: `cp_${i}_1`, date: '2026-07-01', amount: paid, concept: 'Mensualidad' }
      ]
    });
  }

  return clients;
}

export const INITIAL_CLIENTS: Client[] = generateMockClients();

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_01',
    gymId: 'gym_01',
    description: 'Servicio de energía eléctrica y agua',
    amount: 450000,
    category: 'Servicios',
    isRecurring: true,
    date: '2026-07-10'
  },
  {
    id: 'exp_02',
    gymId: 'gym_01',
    description: 'Arriendo de local principal',
    amount: 2200000,
    category: 'Renta',
    isRecurring: true,
    date: '2026-07-05'
  },
  {
    id: 'exp_03',
    gymId: 'gym_01',
    description: 'Productos de limpieza y desinfección',
    amount: 180000,
    category: 'Suministros',
    isRecurring: false,
    date: '2026-07-18'
  },
  {
    id: 'exp_04',
    gymId: 'gym_01',
    description: 'Honorarios Instructor Turno Mañana',
    amount: 1200000,
    category: 'Nómina',
    isRecurring: true,
    date: '2026-07-15'
  }
];

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppConfig = {
  preferredApp: 'prompt',
  templates: {
    cobro: 'Hola, {nombre}. Te recuerdo que tienes un saldo pendiente de ${deuda}. Tu próxima fecha de pago es el {fecha}.',
    vencimiento: 'Hola, {nombre}. Tu mensualidad en el gimnasio vence el día {fecha}. Agradecemos tu pago a tiempo.',
    amistoso: '¡Hola {nombre}! Te extrañamos en el gimnasio 💪🏻 Recordatorio amigable de tu cuota de ${deuda} con fecha {fecha}.'
  }
};
