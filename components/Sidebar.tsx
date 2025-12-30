import React from 'react';
import { LayoutDashboard, Calculator, BookOpen, GraduationCap } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Panel General', icon: LayoutDashboard },
    { id: AppView.SIMULATOR, label: 'Simulador y Datos', icon: Calculator },
    { id: AppView.MANUALS, label: 'Manuales y Ayuda', icon: BookOpen },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shadow-xl sticky top-0 h-screen">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
        <GraduationCap className="text-blue-400 w-8 h-8" />
        <h1 className="text-xl font-bold tracking-tight">UniBudget <span className="text-blue-400">Pro</span></h1>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 text-xs text-slate-400 text-center">
        <p>Modelo CIN Compatible</p>
        <p className="mt-1">v1.0.0</p>
      </div>
    </div>
  );
};