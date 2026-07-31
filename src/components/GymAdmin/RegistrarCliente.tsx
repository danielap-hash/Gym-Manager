import React, { useState, useEffect } from 'react';
import { Client } from '../../types';
import { 
  ArrowLeft, User, Calendar, DollarSign, Mail, Phone, 
  MapPin, AlertTriangle, ShieldAlert, Check, RefreshCw, CreditCard, PhoneCall 
} from 'lucide-react';

interface RegistrarClienteProps {
  gymId: string;
  editingClient?: Client | null;
  onSaveClient: (client: Client) => void;
  onNavigateTo: (screen: 'principal' | 'panel' | 'estado' | 'registrar' | 'balance' | 'ajustes') => void;
}

export const RegistrarCliente: React.FC<RegistrarClienteProps> = ({
  gymId,
  editingClient,
  onSaveClient,
  onNavigateTo,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const nextMonthDate = new Date();
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  const defaultDueDateStr = nextMonthDate.toISOString().split('T')[0];

  const [fullName, setFullName] = useState('');
  const [dni, setDni] = useState('');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState<'Masculino' | 'Femenino' | 'Otro'>('Masculino');
  const [monthlyPrice, setMonthlyPrice] = useState('60000');
  const [paidAmount, setPaidAmount] = useState('60000');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+57');
  const [address, setAddress] = useState('');
  const [joinDate, setJoinDate] = useState(todayStr);
  const [dueDate, setDueDate] = useState(defaultDueDateStr);
  const [medicalAlert, setMedicalAlert] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('+57');
  const [paymentFrequency, setPaymentFrequency] = useState<'Mensual' | 'Quincenal' | 'Anual'>('Mensual');
  const [category, setCategory] = useState('Gimnasio');

  useEffect(() => {
    if (editingClient) {
      setFullName(editingClient.fullName);
      setDni(editingClient.dni || '');
      setAge(String(editingClient.age));
      setGender(editingClient.gender);
      setMonthlyPrice(String(editingClient.monthlyPrice));
      setPaidAmount(String(editingClient.paidAmount));
      setEmail(editingClient.email);
      setPhone(editingClient.phone);
      setAddress(editingClient.address);
      setJoinDate(editingClient.joinDate);
      setDueDate(editingClient.dueDate);
      setMedicalAlert(editingClient.medicalAlert);
      setEmergencyContact(editingClient.emergencyContact);
      setPaymentFrequency(editingClient.paymentFrequency);
      setCategory(editingClient.category);
    }
  }, [editingClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;

    const priceNum = Number(monthlyPrice) || 0;
    const paidNum = Number(paidAmount) || 0;
    const debtNum = Math.max(0, priceNum - paidNum);

    let calculatedStatus: Client['status'] = 'al_dia';
    if (debtNum > 0) {
      calculatedStatus = paidNum > 0 ? 'parcial' : 'atrasado';
    } else {
      const dueTime = new Date(dueDate).getTime();
      const nowTime = new Date(todayStr).getTime();
      if (dueTime <= nowTime) {
        calculatedStatus = 'proximo_vencer';
      }
    }

    const newClientObj: Client = {
      id: editingClient ? editingClient.id : `cli_${Date.now()}`,
      gymId,
      fullName,
      dni: dni.trim() || String(Date.now()).slice(-8),
      age: Number(age) || 20,
      gender,
      monthlyPrice: priceNum,
      paidAmount: paidNum,
      pendingDebt: debtNum,
      email,
      phone,
      address,
      joinDate,
      dueDate,
      medicalAlert,
      emergencyContact,
      paymentFrequency,
      category,
      status: calculatedStatus,
      paymentHistory: editingClient
        ? editingClient.paymentHistory
        : paidNum > 0
        ? [{ id: `cp_${Date.now()}`, date: todayStr, amount: paidNum, concept: 'Abono / Alta de cliente' }]
        : [],
    };

    onSaveClient(newClientObj);
    onNavigateTo('panel');
  };

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigateTo('panel')}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          {editingClient ? 'Editar cliente' : 'Registrar cliente'}
        </h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        {/* Nombre completo */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <label className="block text-slate-800 font-bold text-sm">Nombre completo</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ingrese su nombre"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>

          {/* Edad y Sexo */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Edad</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Edad"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Sexo</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          {/* Precio Mensual y Abono */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Precio Mensual ($)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(e.target.value)}
                  placeholder="ej: 60.000"
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Abono ($)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  placeholder="ej: 60.000"
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contacto Details */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Correo electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Teléfono</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+57 300 000 0000"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Dirección</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ingrese su dirección"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Fechas */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Fecha de ingreso</label>
              <input
                type="date"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Fecha de pago (Vencimiento)</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-amber-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Alerta Médica */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Alerta Médica</label>
            <div className="relative">
              <AlertTriangle className="w-4 h-4 text-amber-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={medicalAlert}
                onChange={(e) => setMedicalAlert(e.target.value)}
                placeholder="Alergias, condiciones médicas, etc."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Contacto Emergencia */}
          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
              <span>Contacto de Emergencia</span>
              {emergencyContact && emergencyContact.trim().length > 3 && (
                <span className="text-[10px] text-rose-600 font-bold">Llamada rápida SOS</span>
              )}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <PhoneCall className="w-4 h-4 text-rose-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Ej: +57 300 123 4567 (Mamá/Familiar)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-400"
                />
              </div>
              {emergencyContact && emergencyContact.trim().length > 3 && (
                <a
                  href={`tel:${emergencyContact.replace(/[^0-9+]/g, '')}`}
                  className="px-3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shrink-0 transition shadow-xs"
                  title="Realizar llamada de emergencia"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Llamar SOS</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Documento de Identidad y Categoría */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
              <span>DNI / Número de Identificación *</span>
              <span className="text-[10px] text-blue-600 font-semibold">Para búsqueda rápida</span>
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Ej: 1092837482"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Modalidad de pago</label>
              <select
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              >
                <option value="Semanal">Semanal</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Mensual">Mensual</option>
                <option value="Anual">Anual</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              >
                <option value="Gimnasio">Gimnasio</option>
                <option value="Musculación">Musculación</option>
                <option value="Crossfit">Crossfit</option>
                <option value="Personalizado">Personalizado</option>
                <option value="Ninguna">Ninguna</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors shadow-sm shadow-blue-200 flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5 text-white" />
          {editingClient ? 'Guardar Cambios' : 'Registrar Usuario'}
        </button>

        <p className="text-[11px] text-slate-400 text-center leading-normal pt-1">
          Al registrarte aceptas los Términos de Servicio de la plataforma
        </p>
      </form>
    </div>
  );
};
