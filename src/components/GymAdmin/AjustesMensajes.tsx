import React, { useState } from 'react';
import { Gym, Client, WhatsAppConfig, WhatsAppAppChoice } from '../../types';
import { 
  ArrowLeft, MessageSquare, Printer, Database, User, ChevronRight, Check, Sparkles, Building2, SunMoon, LogOut
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

  const currentTemplateText = templates[activeTemplateType];

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

  // Live preview replacing variables
  const previewText = currentTemplateText
    .replace(/{nombre}/g, 'Juan Pérez')
    .replace(/{deuda}/g, '60.000')
    .replace(/{fecha}/g, '28/08/2026');

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
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Variables Disponibles (Toca para agregar)</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleInsertVariable('{nombre}')}
                className="bg-white border border-slate-300 hover:border-emerald-500 font-mono text-xs font-bold text-slate-800 px-3 py-1.5 rounded-xl transition shadow-2xs"
              >
                {'{nombre}'}
              </button>
              <button
                onClick={() => handleInsertVariable('{deuda}')}
                className="bg-white border border-slate-300 hover:border-emerald-500 font-mono text-xs font-bold text-slate-800 px-3 py-1.5 rounded-xl transition shadow-2xs"
              >
                {'{deuda}'}
              </button>
              <button
                onClick={() => handleInsertVariable('{fecha}')}
                className="bg-white border border-slate-300 hover:border-emerald-500 font-mono text-xs font-bold text-slate-800 px-3 py-1.5 rounded-xl transition shadow-2xs"
              >
                {'{fecha}'}
              </button>
            </div>
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
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 relative shadow-xs">
              <div className="flex items-center gap-2 text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Ejemplo para: Juan Pérez
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
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
    </div>
  );
};

