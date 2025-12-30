import React, { useState } from 'react';
import { generateManualContent } from '../services/geminiService';
import { ManualContent } from '../types';
import { Book, FileText, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Assuming we'd parse markdown, for this pure HTML approach we will render text simply or process safe HTML

export const ManualGenerator: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [manual, setManual] = useState<ManualContent | null>(null);
  const [activeTab, setActiveTab] = useState<'user_manual' | 'technical_glossary' | 'methodology' | null>(null);

  const fetchManual = async (type: 'user_manual' | 'technical_glossary' | 'methodology') => {
    setLoading(true);
    setActiveTab(type);
    const result = await generateManualContent(type);
    setManual(result);
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-[600px] flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Documentación Inteligente</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Genere documentación actualizada al instante utilizando IA, explicando el modelo, términos técnicos y uso de la aplicación.
        </p>
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar for Manuals */}
        <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 p-4 space-y-2">
          <button
            onClick={() => fetchManual('user_manual')}
            disabled={loading}
            className={`w-full text-left p-3 rounded-lg flex items-center space-x-2 transition-colors ${activeTab === 'user_manual' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            <Book size={18} />
            <span className="font-medium">Manual de Usuario</span>
          </button>

          <button
            onClick={() => fetchManual('technical_glossary')}
            disabled={loading}
            className={`w-full text-left p-3 rounded-lg flex items-center space-x-2 transition-colors ${activeTab === 'technical_glossary' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            <FileText size={18} />
            <span className="font-medium">Glosario Técnico</span>
          </button>

          <button
            onClick={() => fetchManual('methodology')}
            disabled={loading}
            className={`w-full text-left p-3 rounded-lg flex items-center space-x-2 transition-colors ${activeTab === 'methodology' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            <Info size={18} />
            <span className="font-medium">Metodología CIN</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto max-h-[700px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 space-y-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p>Generando documentación con Gemini...</p>
            </div>
          ) : manual ? (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{manual.title}</h3>
              <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                {manual.content}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
              <Book size={48} className="mb-4 opacity-20" />
              <p>Seleccione un documento del menú lateral para comenzar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};