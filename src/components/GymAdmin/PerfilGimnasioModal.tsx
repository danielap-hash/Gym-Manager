import React, { useState, useRef } from 'react';
import { Gym } from '../../types';
import { X, Upload, Palette, Check, Building2, User, Mail, Phone, Image as ImageIcon } from 'lucide-react';

interface PerfilGimnasioModalProps {
  isOpen: boolean;
  onClose: () => void;
  gym: Gym;
  onSaveGym: (updatedGym: Gym) => void;
}

const COLOR_PRESETS = [
  { name: 'Azul Real', primary: '#2563eb', secondary: '#1d4ed8' },
  { name: 'Verde Esmeralda', primary: '#10b981', secondary: '#059669' },
  { name: 'Púrpura Imperial', primary: '#7c3aed', secondary: '#6d28d9' },
  { name: 'Rojo Intenso', primary: '#dc2626', secondary: '#b91c1c' },
  { name: 'Ámbar Cálido', primary: '#d97706', secondary: '#b45309' },
  { name: 'Grafito Elegante', primary: '#0f172a', secondary: '#334155' },
];

export const PerfilGimnasioModal: React.FC<PerfilGimnasioModalProps> = ({
  isOpen,
  onClose,
  gym,
  onSaveGym,
}) => {
  const [brandName, setBrandName] = useState(gym.brandName || gym.name || 'TEMPLARIOS GYM');
  const [ownerName, setOwnerName] = useState(gym.ownerName || '');
  const [email, setEmail] = useState(gym.email || '');
  const [phone, setPhone] = useState(gym.phone || '');
  const [logoUrl, setLogoUrl] = useState(gym.logoUrl || '');
  const [primaryColor, setPrimaryColor] = useState(gym.primaryColor || '#2563eb');
  const [secondaryColor, setSecondaryColor] = useState(gym.secondaryColor || '#1d4ed8');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedGym: Gym = {
      ...gym,
      name: brandName,
      brandName,
      ownerName,
      email,
      phone,
      logoUrl,
      primaryColor,
      secondaryColor,
    };

    onSaveGym(updatedGym);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 leading-tight">Perfil y Marca del Gimnasio</h2>
              <p className="text-xs text-slate-500">Personaliza nombre, logotipo y colores corporativos</p>
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
        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs font-medium">
          {/* Logo Upload Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <label className="block text-slate-800 font-bold text-sm">Logotipo Corporativo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo Gimnasio" className="w-full h-full object-contain p-1" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="space-y-1.5 flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Subir imagen desde dispositivo</span>
                </button>
                <p className="text-[10px] text-slate-400">Formatos recomendados: PNG, JPG o SVG. Máx 5MB.</p>
                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="text-[10px] text-red-600 font-semibold hover:underline block"
                  >
                    Quitar logotipo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Nombre Comercial y Propietario */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
            <div>
              <label className="block text-slate-800 font-bold mb-1">Nombre Comercial (Branding)</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="ej: TEMPLARIOS GYM"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Propietario / Administrador</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Nombre del encargado"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Color Palette Section */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-slate-800 font-bold text-sm flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-slate-600" />
                Colores del Tema
              </label>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrimaryColor(preset.primary);
                    setSecondaryColor(preset.secondary);
                  }}
                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                    primaryColor === preset.primary
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <span className="text-[11px] font-bold text-slate-700 truncate">{preset.name}</span>
                </button>
              ))}
            </div>

            {/* Custom Color Pickers */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Color Primario</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Color Secundario</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Correo de Contacto</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@gym.com"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 300 0000000"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-white font-bold rounded-lg text-xs shadow-xs transition-opacity flex items-center justify-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <Check className="w-4 h-4" />
            Guardar Cambios de Marca
          </button>
        </form>
      </div>
    </div>
  );
};
