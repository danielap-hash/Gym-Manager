import React, { useState } from 'react';
import { Gym, Client, WhatsAppConfig, WhatsAppAppChoice } from '../../types';
import { 
  ArrowLeft, MessageSquare, Printer, Database, User, ChevronRight, Check, Sparkles, Building2, SunMoon, LogOut,
  Search, X, ChevronDown, Phone, MessageCircle
} from 'lucide-react';
import { PerfilGimnasioModal } from './PerfilGimnasioModal';
import { CopiasSeguridadModal } from './CopiasSeguridadModal';
import { ImprimirEstadoCuentaModal } from './ImprimirEstadoCuentaModal';
import { ThemeSwitch } from '../ThemeSwitch';

interface AjustesMensajesProps {
  gym: Gym;
  clients: Client[];
  waConfig: WhatsAppConfig;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onSaveWhatsAppConfig: (config: WhatsAppConfig) => void;
  onSaveGym: (updatedGym: Gym) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonData: string) => boolean;
  onResetData: () => void;
  onNavigateTo: (screen: 'principal' | 'panel' | 'estado' | 'registrar' | 'balance' | 'ajustes') => void;
  onLogout?: () => void;
}

export const AjustesMensajes: React.FC<AjustesMensajesProps> = ({
  gym,
  clients,
  waConfig,
  theme = 'light',
  onToggleTheme,
  onSaveWhatsAppConfig,
  onSaveGym,
  onExportBackup,
  onImportBackup,
  onResetData,
  onNavigateTo,
  onLogout,
}) => {
  const [subview, setSubview] = useState<'menu' | 'mensajes'>('menu');
  const [activeTemplateType, setActiveTemplateType] = useState<'cobro' | 'vencimiento' | 'amistoso'>('cobro');

  const [isPerfilOpen, setIsPerfilOpen] = useState(false);
  const [isCopiasOpen, setIsCopiasOpen] = useState(false);
  const [isEstadoCuentaOpen, setIsEstadoCuentaOpen] = useState(false);

  const [templates, setTemplates] = useState(waConfig.templates);
  const [preferredApp, setPreferredApp] = useState<WhatsAppAppChoice>(waConfig.preferredApp);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Client selector state
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients.length > 0 ? clients[0] : null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentTemplateText = templates[activeTemplateType];

  const filteredClients = clients.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      c.fullName.toLowerCase().includes(term) ||
      (c.dni && c.dni.toLowerCase().includes(term)) ||
      (c.phone && c.phone.toLowerCase().includes(term))
    );
  });

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    if (!currentTemplateText.includes('{nombre}')) {
      handleInsertVariable('{nombre}');
    }
    setIsSearchModalOpen(false);
    setSearchTerm('');
  };

  const handleInsertVariable = (variable: string) => {
    setTemplates({
      ...templates,
      [activeTemplateType]: templates[activeTemplateType] + ` ${variable}`,
    });
  };

  const handleTextChange = (text: string) => {
    setTemplates({
      ...templates,
      [activeTemplateType]: text,
    });
  };

  const handleSave = () => {
    onSaveWhatsAppConfig({
      preferredApp,
      templates,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Live preview replacing variables using selected student's real data
  const activeName = selectedClient ? selectedClient.fullName : 'Juan Pérez';
  const activeDebt = selectedClient
    ? `$${(selectedClient.pendingDebt ?? 0).toLocaleString('es-CO')}`
    : '60.000';
  const activeFecha = selectedClient && selectedClient.dueDate
    ? selectedClient.dueDate.split('-').reverse().join('/')
    : '28/08/2026';

  const previewText = currentTemplateText
    .replace(/{nombre}/g, activeName)
    .replace(/{deuda}/g, activeDebt)
    .replace(/{fecha}/g, activeFecha);

  const handleSendWhatsAppToSelected = () => {
    if (!selectedClient || !selectedClient.phone) return;
    const cleanPhone = selectedClient.phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(previewText);
    let url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    if (preferredApp === 'whatsapp_business') {
      url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-5 animate-in fade-in duration-150">
      {subview === 'menu' ? (
        <div className="space-y-5">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Ajustes</h1>

          {/* Apariencia y Tema */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-1">
              Apariencia de la App
            </span>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold block text-slate-900 dark:text-white text-sm">Tema de Interfaz</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Selecciona tu modo de visualización preferido</span>
                </div>
              </div>
              {onToggleTheme && (
                <ThemeSwitch theme={theme} onToggleTheme={onToggleTheme} showLabels={true} />
              )}
            </div>
          </div>

          {/* Configuración Cuenta */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
              Configuración Cuenta
            </span>
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden text-sm">
              <div
                onClick={() => setIsPerfilOpen(true)}
                className="p-4 flex items-center justify-between text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900">Perfil del Gimnasio</span>
                    <span className="text-xs text-slate-400 font-normal">Logo, marca y colores del tema</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => setIsCopiasOpen(true)}
                className="p-4 flex items-center justify-between text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900">Copias de Seguridad</span>
                    <span className="text-xs text-slate-400 font-normal">Exportar e importar respaldo JSON</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => setSubview('mensajes')}
                className="p-4 flex items-center justify-between text-slate-900 hover:bg-slate-50 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white">Configurar Mensajes WhatsApp</span>
                    <span className="text-xs text-slate-400 font-normal">Plantillas y disparador directo</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </div>

              {onLogout && (
                <div
                  onClick={onLogout}
                  className="p-4 flex items-center justify-between text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-rose-700 dark:text-rose-300">Cerrar Sesión</span>
                      <span className="text-xs text-rose-500/80 dark:text-rose-400/80 font-normal">Salir del gimnasio actual</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400" />
                </div>
              )}
            </div>
          </div>

          {/* General */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
              General & Reportes
            </span>
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden text-sm">
              <div
                onClick={() => setIsEstadoCuentaOpen(true)}
                className="p-4 flex items-center justify-between text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900">Imprimir Estado de Cuenta</span>
                    <span className="text-xs text-slate-400 font-normal">Informe de cartera e impresión</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Configuración de Mensajes View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSubview('menu')}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">Configurar Mensajes</h1>
            <div className="w-10"></div>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              Plantilla y configuración guardadas correctamente.
            </div>
          )}

          {/* Variables Disponibles */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 block">Variables Disponibles (Toca para agregar)</span>
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Buscar Alumno</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 font-mono text-xs font-bold text-white px-3 py-1.5 rounded-xl transition shadow-2xs flex items-center gap-1.5"
                title="Seleccionar alumno para reemplazar variables"
              >
                <User className="w-3.5 h-3.5 text-blue-200" />
                <span>{'{nombre}'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
              </button>

              <button
                type="button"
                onClick={() => handleInsertVariable('{deuda}')}
                className="bg-white border border-slate-300 hover:border-emerald-500 font-mono text-xs font-bold text-slate-800 px-3 py-1.5 rounded-xl transition shadow-2xs"
              >
                {'{deuda}'}
              </button>

              <button
                type="button"
                onClick={() => handleInsertVariable('{fecha}')}
                className="bg-white border border-slate-300 hover:border-emerald-500 font-mono text-xs font-bold text-slate-800 px-3 py-1.5 rounded-xl transition shadow-2xs"
              >
                {'{fecha}'}
              </button>
            </div>

            {/* Selected Client Info Card */}
            {selectedClient ? (
              <div className="bg-white p-2.5 rounded-xl border border-blue-200 flex items-center justify-between text-xs shadow-2xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center shrink-0 text-xs">
                    {selectedClient.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-slate-900 block truncate">{selectedClient.fullName}</span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className={`font-bold ${selectedClient.pendingDebt > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        Deuda: ${selectedClient.pendingDebt.toLocaleString('es-CO')}
                      </span>
                      <span>•</span>
                      <span>Vence: {selectedClient.dueDate ? selectedClient.dueDate.split('-').reverse().join('/') : 'S/D'}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchModalOpen(true)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg shrink-0 transition flex items-center gap-1"
                >
                  <Search className="w-3 h-3" />
                  Cambiar
                </button>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 italic px-1">
                Toca <span className="font-bold text-blue-600">{'{nombre}'}</span> para seleccionar un alumno y cargar automáticamente su deuda y fecha de vencimiento.
              </div>
            )}
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTemplateType('cobro')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                activeTemplateType === 'cobro'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Cobro
            </button>
            <button
              onClick={() => setActiveTemplateType('vencimiento')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                activeTemplateType === 'vencimiento'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Vencimiento
            </button>
            <button
              onClick={() => setActiveTemplateType('amistoso')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                activeTemplateType === 'amistoso'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Amistoso
            </button>
          </div>

          {/* Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Editar Mensaje ({activeTemplateType})
            </label>
            <textarea
              rows={4}
              value={currentTemplateText}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 shadow-xs"
            ></textarea>
          </div>

          {/* Vista Previa del Mensaje */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-700 block">Vista Previa del Mensaje</span>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Ejemplo para: {activeName}
                </div>
                {selectedClient && selectedClient.phone && (
                  <button
                    type="button"
                    onClick={handleSendWhatsAppToSelected}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition flex items-center gap-1.5 shadow-2xs"
                    title={`Enviar WhatsApp a ${selectedClient.fullName}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Enviar a {selectedClient.fullName.split(' ')[0]}</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">
                {previewText}
              </p>
            </div>
          </div>

          {/* Selección de aplicación WhatsApp */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs text-xs">
            <span className="font-bold text-slate-900 block text-sm">Aplicación de WhatsApp</span>
            <div className="space-y-2 font-medium">
              <label className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="waApp"
                  checked={preferredApp === 'prompt'}
                  onChange={() => setPreferredApp('prompt')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-800">Preguntar siempre</span>
              </label>

              <label className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="waApp"
                  checked={preferredApp === 'whatsapp'}
                  onChange={() => setPreferredApp('whatsapp')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-800">WhatsApp Estándar</span>
              </label>

              <label className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="waApp"
                  checked={preferredApp === 'whatsapp_business'}
                  onChange={() => setPreferredApp('whatsapp_business')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-800">WhatsApp Business</span>
              </label>
            </div>
          </div>

          {/* Guardar Button */}
          <button
            onClick={handleSave}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-xs shadow-blue-200 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Guardar Plantilla y Preferencias
          </button>
        </div>
      )}

      {/* Modals */}
      <PerfilGimnasioModal
        isOpen={isPerfilOpen}
        onClose={() => setIsPerfilOpen(false)}
        gym={gym}
        onSaveGym={onSaveGym}
      />

      <CopiasSeguridadModal
        isOpen={isCopiasOpen}
        onClose={() => setIsCopiasOpen(false)}
        onExportBackup={onExportBackup}
        onImportBackup={onImportBackup}
        onResetData={onResetData}
      />

      <ImprimirEstadoCuentaModal
        isOpen={isEstadoCuentaOpen}
        onClose={() => setIsEstadoCuentaOpen(false)}
        gym={gym}
        clients={clients}
      />

      {/* Modal de Búsqueda y Selección de Alumnos */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Seleccionar Alumno</h3>
                  <p className="text-[11px] text-slate-500">
                    Sustituye {'{nombre}'}, {'{deuda}'} y {'{fecha}'} con los datos reales del alumno
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSearchModalOpen(false);
                  setSearchTerm('');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Buscador */}
            <div className="p-3 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar alumno por nombre, DNI o teléfono..."
                  autoFocus
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Lista de Alumnos */}
            <div className="overflow-y-auto p-2 divide-y divide-slate-100 flex-1">
              {filteredClients.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <User className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold">No se encontraron alumnos con esa búsqueda</p>
                </div>
              ) : (
                filteredClients.map((client) => {
                  const isSelected = selectedClient?.id === client.id;
                  return (
                    <div
                      key={client.id}
                      onClick={() => handleSelectClient(client)}
                      className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-blue-50/90 border border-blue-200'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {client.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {client.fullName}
                            </span>
                            {isSelected && (
                              <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded">
                                SELECCIONADO
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span>DNI: {client.dni || 'S/D'}</span>
                            <span>•</span>
                            <span>Tel: {client.phone || 'S/D'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`font-bold text-xs ${client.pendingDebt > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          ${client.pendingDebt.toLocaleString('es-CO')}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Vence: {client.dueDate ? client.dueDate.split('-').reverse().join('/') : 'S/D'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                {filteredClients.length} alumno(s) disponible(s)
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsSearchModalOpen(false);
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

