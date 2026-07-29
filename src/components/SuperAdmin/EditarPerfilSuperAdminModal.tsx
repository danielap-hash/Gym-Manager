import React, { useState, useEffect, useRef } from 'react';
import { SuperAdminProfile } from '../../types';
import { 
  X, Camera, Lock, User, Mail, Phone, Shield, Eye, EyeOff, 
  Check, AlertCircle, Upload, Trash2 
} from 'lucide-react';

interface EditarPerfilSuperAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SuperAdminProfile;
  onSaveProfile: (updatedProfile: SuperAdminProfile) => void;
}

export const EditarPerfilSuperAdminModal: React.FC<EditarPerfilSuperAdminModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(profile.name || 'Súper Administrador');
  const [username, setUsername] = useState(profile.username || 'superadmin');
  const [email, setEmail] = useState(profile.email || 'superadmin@gymcontrol.com');
  const [phone, setPhone] = useState(profile.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  
  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(profile.name || 'Súper Administrador');
      setUsername(profile.username || 'superadmin');
      setEmail(profile.email || 'superadmin@gymcontrol.com');
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatarUrl || '');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('La imagen no debe superar los 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('El nombre no puede estar vacío.');
      return;
    }

    if (!username.trim()) {
      setErrorMsg('El nombre de usuario no puede estar vacío.');
      return;
    }

    let finalPassword = profile.password || 'super123';

    if (newPassword || confirmPassword) {
      if (newPassword.length < 4) {
        setErrorMsg('La contraseña debe tener al menos 4 caracteres.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('Las contraseñas no coinciden.');
        return;
      }
      finalPassword = newPassword;
    }

    const updated: SuperAdminProfile = {
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatarUrl,
      password: finalPassword,
    };

    onSaveProfile(updated);
    setSuccessMsg('¡Perfil de Súper Administrador actualizado correctamente!');
    
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-5 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">Editar Perfil Súper Admin</h2>
              <p className="text-xs text-slate-900 font-medium">Foto, datos personales y clave</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Photo / Avatar Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-3">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              Foto de Perfil
            </label>
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="relative group">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Foto de perfil"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400/50 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-dashed border-amber-500/50 flex items-center justify-center text-amber-800 font-bold text-2xl shadow-inner">
                    <Shield className="w-10 h-10 text-amber-700" />
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-600 text-slate-950 p-2 rounded-full shadow-lg border-2 border-white transition-transform hover:scale-105"
                  title="Subir foto desde archivo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  Subir Foto
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-bold text-rose-700 flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Quitar
                  </button>
                )}
              </div>

              {/* URL Input option */}
              <div className="w-full text-left pt-1">
                <label className="text-[10px] text-slate-500 font-semibold mb-1 block">O pegar enlace (URL de imagen):</label>
                <input
                  type="url"
                  value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://ejemplo.com/mifoto.jpg"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-3 pt-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Información Personal</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Súper Administrador"
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de Usuario</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="superadmin"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 300 000 0000"
                    className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@gymcontrol.com"
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Cambiar Contraseña
              </span>
              <span className="text-[10px] text-slate-400 font-medium">(Opcional)</span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Dejar en blanco para conservar clave actual"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm pr-9 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {newPassword.length > 0 && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Confirmar Nueva Contraseña</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita la nueva contraseña"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
