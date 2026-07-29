import React, { useState, useEffect } from 'react';
import { Gym, Client, Expense, WhatsAppConfig, ActiveUser } from './types';
import {
  getGyms,
  saveGyms,
  getClients,
  saveClients,
  getExpenses,
  saveExpenses,
  getWhatsAppConfig,
  saveWhatsAppConfig,
  getActiveUser,
  saveActiveUser,
  getThemeMode,
  saveThemeMode,
  resetToDemoData,
} from './utils/storage';

import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ProfileSwitchModal } from './components/Auth/ProfileSwitchModal';
import { SuperAdminView } from './components/SuperAdmin/SuperAdminView';

import { Principal } from './components/GymAdmin/Principal';
import { PanelControlClientes } from './components/GymAdmin/PanelControlClientes';
import { RegistrarCliente } from './components/GymAdmin/RegistrarCliente';
import { EstadoClientes } from './components/GymAdmin/EstadoClientes';
import { BalanceGastos } from './components/GymAdmin/BalanceGastos';
import { AjustesMensajes } from './components/GymAdmin/AjustesMensajes';
import { AsistenteIAModal } from './components/AI/AsistenteIAModal';
import { Sparkles } from 'lucide-react';

export type ScreenName =
  | 'principal'
  | 'panel'
  | 'estado'
  | 'registrar'
  | 'balance'
  | 'ajustes'
  | 'superadmin';

export default function App() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [waConfig, setWaConfig] = useState<WhatsAppConfig>({
    preferredApp: 'prompt',
    templates: { cobro: '', vencimiento: '', amistoso: '' },
  });
  const [activeUser, setActiveUser] = useState<ActiveUser>({
    role: 'gym_admin',
    gymId: 'gym_01',
    username: 'admin_fit',
    gymName: 'Gimnasio Fitness Zone',
  });

  const [activeScreen, setActiveScreen] = useState<ScreenName>('principal');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isProfileSwitchOpen, setIsProfileSwitchOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load state on initial mount
  useEffect(() => {
    const loadedGyms = getGyms();
    const loadedClients = getClients();
    const loadedExpenses = getExpenses();
    const loadedWa = getWhatsAppConfig();
    const loadedUser = getActiveUser();
    const loadedTheme = getThemeMode();

    setGyms(loadedGyms);
    setClients(loadedClients);
    setExpenses(loadedExpenses);
    setWaConfig(loadedWa);
    setActiveUser(loadedUser);
    setTheme(loadedTheme);

    if (loadedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (loadedUser.role === 'superadmin') {
      setActiveScreen('superadmin');
    } else {
      setActiveScreen('principal');
    }
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveThemeMode(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Update handlers with persistent storage
  const handleUpdateGyms = (newGyms: Gym[]) => {
    setGyms(newGyms);
    saveGyms(newGyms);
  };

  const handleUpdateClients = (newClients: Client[]) => {
    setClients(newClients);
    saveClients(newClients);
  };

  const handleUpdateExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    saveExpenses(newExpenses);
  };

  const handleSaveWhatsAppConfig = (newConfig: WhatsAppConfig) => {
    setWaConfig(newConfig);
    saveWhatsAppConfig(newConfig);
  };

  const handleSaveGym = (updatedGym: Gym) => {
    const updated = gyms.map((g) => (g.id === updatedGym.id ? updatedGym : g));
    handleUpdateGyms(updated);

    // Update activeUser gymName if matching current active gym
    if (activeUser.gymId === updatedGym.id) {
      const newUser = {
        ...activeUser,
        gymName: updatedGym.brandName || updatedGym.name,
      };
      setActiveUser(newUser);
      saveActiveUser(newUser);
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      gyms,
      clients,
      expenses,
      waConfig,
      activeUser,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `copia_seguridad_gymsaas_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.gyms && parsed.clients) {
        if (Array.isArray(parsed.gyms)) handleUpdateGyms(parsed.gyms);
        if (Array.isArray(parsed.clients)) handleUpdateClients(parsed.clients);
        if (Array.isArray(parsed.expenses)) handleUpdateExpenses(parsed.expenses);
        if (parsed.waConfig) handleSaveWhatsAppConfig(parsed.waConfig);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const handleSelectUser = (user: ActiveUser) => {
    setActiveUser(user);
    saveActiveUser(user);

    if (user.role === 'superadmin') {
      setActiveScreen('superadmin');
    } else {
      setActiveScreen('principal');
    }
  };

  const handleLogout = () => {
    const loggedOutUser: ActiveUser = {
      role: 'gym_admin',
      gymId: '',
      username: '',
      gymName: '',
    };
    setActiveUser(loggedOutUser);
    saveActiveUser(loggedOutUser);
    setIsProfileSwitchOpen(true);
  };

  const handleResetData = () => {
    if (confirm('¿Restablecer datos de prueba a la versión inicial?')) {
      resetToDemoData();
      setGyms(getGyms());
      setClients(getClients());
      setExpenses(getExpenses());
      setWaConfig(getWhatsAppConfig());
      alert('Datos restablecidos correctamente.');
    }
  };

  const handleSaveSingleClient = (client: Client) => {
    const exists = clients.some((c) => c.id === client.id);
    let updated: Client[];
    if (exists) {
      updated = clients.map((c) => (c.id === client.id ? client : c));
    } else {
      updated = [client, ...clients];
    }
    handleUpdateClients(updated);
    setEditingClient(null);
  };

  // Filter clients and expenses for current gym context
  const currentGymId = activeUser.gymId || 'gym_01';
  const gymClients = clients.filter((c) => c.gymId === currentGymId);
  const currentGym =
    gyms.find((g) => g.id === currentGymId) || {
      id: currentGymId,
      name: activeUser.gymName || 'Gimnasio Fitness Zone',
      brandName: activeUser.gymName || 'TEMPLARIOS GYM',
      ownerName: 'Administrador',
      email: 'contacto@gym.com',
      phone: '+57 300 000 0000',
      username: activeUser.username,
      password: '',
      subscriptionFee: 150000,
      nextDueDate: '2026-08-15',
      status: 'active',
      createdAt: '2026-01-01',
      primaryColor: '#2563eb',
      secondaryColor: '#1d4ed8',
    };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} font-sans antialiased selection:bg-emerald-500 selection:text-white relative transition-colors`}>
      {/* Navbar */}
      <Navbar
        activeUser={activeUser}
        activeGym={currentGym}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenProfileSwitch={() => setIsProfileSwitchOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onResetData={handleResetData}
        onLogout={handleLogout}
      />

      {/* Floating AI Assistant Trigger Button */}
      {activeUser.role !== 'superadmin' && (
        <button
          onClick={() => setIsAiAssistantOpen(true)}
          className="fixed bottom-36 right-4 z-40 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 p-3 rounded-full shadow-lg border border-amber-300 flex items-center gap-2 font-black text-xs transition-transform hover:scale-105 active:scale-95 shadow-amber-500/20"
        >
          <Sparkles className="w-5 h-5 text-slate-950" />
          <span className="hidden sm:inline">Asistente IA</span>
        </button>
      )}

      {/* Main Content View Container */}
      <main className="min-h-[calc(100vh-120px)]">
        {activeUser.role === 'superadmin' && activeScreen === 'superadmin' ? (
          <SuperAdminView
            gyms={gyms}
            onUpdateGyms={handleUpdateGyms}
            onSelectUser={handleSelectUser}
            activeUser={activeUser}
            onUpdateActiveUser={(updated) => {
              setActiveUser(updated);
              saveActiveUser(updated);
            }}
            onLogout={handleLogout}
          />
        ) : (
          <>
            {activeScreen === 'principal' && (
              <Principal
                clients={gymClients}
                onNavigateTo={(screen) => setActiveScreen(screen)}
              />
            )}

            {activeScreen === 'panel' && (
              <PanelControlClientes
                clients={gymClients}
                waConfig={waConfig}
                onUpdateClients={(updatedGymClients) => {
                  // Merge gym specific client edits with all clients
                  const otherClients = clients.filter((c) => c.gymId !== currentGymId);
                  handleUpdateClients([...updatedGymClients, ...otherClients]);
                }}
                onNavigateTo={(screen) => setActiveScreen(screen)}
                onEditClient={(client) => {
                  setEditingClient(client);
                  setActiveScreen('registrar');
                }}
              />
            )}

            {activeScreen === 'registrar' && (
              <RegistrarCliente
                gymId={currentGymId}
                editingClient={editingClient}
                onSaveClient={handleSaveSingleClient}
                onNavigateTo={(screen) => {
                  setEditingClient(null);
                  setActiveScreen(screen);
                }}
              />
            )}

            {activeScreen === 'estado' && (
              <EstadoClientes
                clients={gymClients}
                onNavigateTo={(screen) => setActiveScreen(screen)}
                onUpdateClients={(updatedGymClients) => {
                  const otherClients = clients.filter((c) => c.gymId !== currentGymId);
                  handleUpdateClients([...updatedGymClients, ...otherClients]);
                }}
              />
            )}

            {activeScreen === 'balance' && (
              <BalanceGastos
                gymId={currentGymId}
                clients={gymClients}
                expenses={expenses}
                onUpdateExpenses={handleUpdateExpenses}
              />
            )}

            {activeScreen === 'ajustes' && (
              <AjustesMensajes
                gym={currentGym}
                clients={gymClients}
                waConfig={waConfig}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onSaveWhatsAppConfig={handleSaveWhatsAppConfig}
                onSaveGym={handleSaveGym}
                onExportBackup={handleExportBackup}
                onImportBackup={handleImportBackup}
                onResetData={handleResetData}
                onNavigateTo={(screen) => setActiveScreen(screen)}
                onLogout={handleLogout}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Tab Bar */}
      <BottomNav
        activeScreen={activeScreen}
        activeUser={activeUser}
        onNavigateTo={(screen) => setActiveScreen(screen)}
      />

      {/* Profile & Role Switcher Modal */}
      <ProfileSwitchModal
        isOpen={isProfileSwitchOpen}
        onClose={() => setIsProfileSwitchOpen(false)}
        gyms={gyms}
        activeUser={activeUser}
        onSelectUser={handleSelectUser}
        onLogout={handleLogout}
      />

      {/* Gemini AI Assistant Modal */}
      <AsistenteIAModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        gymName={currentGym.brandName || currentGym.name}
      />
    </div>
  );
}
