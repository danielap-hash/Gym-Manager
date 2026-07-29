import React, { useRef, useState } from 'react';
import { X, Download, Upload, RefreshCw, Database, Check, AlertCircle } from 'lucide-react';

interface CopiasSeguridadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonData: string) => boolean;
  onResetData: () => void;
}

export const CopiasSeguridadModal: React.FC<CopiasSeguridadModalProps> = ({
  isOpen,
  onClose,
  onExportBackup,
  onImportBackup,
  onResetData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = onImportBackup(content);
          if (success) {
            setImportStatus('success');
            setStatusMsg('¡Copia de seguridad restaurada exitosamente!');
          } else {
            setImportStatus('error');
            setStatusMsg('El archivo seleccionado no tiene un formato válido de copia de seguridad.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 leading-tight">Copias de Seguridad</h2>
              <p className="text-xs text-slate-500">Respaldo y restauración de información</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 text-xs font-medium">
          {importStatus !== 'idle' && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                importStatus === 'success'
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {importStatus === 'success' ? (
                <Check className="w-4 h-4 text-green-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span className="text-xs font-semibold">{statusMsg}</span>
            </div>
          )}

          {/* Export Option */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              Descargar Copia de Seguridad
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Exporta todos los datos de clientes, pagos, gastos y configuraciones a un archivo JSON seguro para guardarlo en tu computadora o teléfono.
            </p>
            <button
              onClick={onExportBackup}
              className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs shadow-blue-200"
            >
              <Download className="w-4 h-4" />
              Exportar archivo .JSON
            </button>
          </div>

          {/* Import Option */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              Restaurar Copia de Seguridad
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Sube un archivo de copia de seguridad previamente descargado (.JSON) para reemplazar o actualizar tus registros.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full mt-2 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <Upload className="w-4 h-4 text-slate-600" />
              Seleccionar archivo .JSON
            </button>
          </div>

          {/* Reset Demo Option */}
          <div className="pt-2">
            <button
              onClick={onResetData}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              Restablecer datos demo iniciales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
