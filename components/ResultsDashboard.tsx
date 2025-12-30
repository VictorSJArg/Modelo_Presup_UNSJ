import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import { CalculationResult, UniversityData, ModelWeights } from '../types';
import { DollarSign, Activity, Users, BookOpen, Layers, Beaker, BarChart2, Layout, Building, GraduationCap, Table } from 'lucide-react';

interface ResultsDashboardProps {
  data: UniversityData;
  result: CalculationResult;
  weights: ModelWeights;
  allUniversities: UniversityData[];
  calculator: (data: UniversityData) => CalculationResult;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  data,
  result,
  weights,
  allUniversities,
  calculator
}) => {
  const [viewMode, setViewMode] = useState<'individual' | 'comparative'>('individual');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
  };

  const formatScore = (value: number) => value.toLocaleString('es-AR', { maximumFractionDigits: 0 });

  // --- INDIVIDUAL VIEW RENDER ---
  const renderIndividualView = () => {
    const pieData = [
      { name: 'Bloque 1 (Académico)', value: result.block1WeightedScore, color: '#4F46E5' }, // Indigo
      { name: 'Bloque 2 (Normativo)', value: result.block2WeightedScore, color: '#10B981' }, // Emerald
      { name: 'Bloque 3 (Ciencia)', value: result.block3WeightedScore, color: '#E11D48' }, // Rose
    ];

    const breakdownData = [
      { name: 'Actividad', points: result.pointsStudentsActivity, category: 'B1' },
      { name: 'Complejidad', points: result.pointsStudentsComplexity, category: 'B1' },
      { name: 'Egresados', points: result.pointsGraduates, category: 'B1' },

      { name: 'Autoridades', points: result.pointsAuthorities, category: 'B2' },
      { name: 'Docentes', points: result.pointsFaculty, category: 'B2' },
      { name: 'No Docentes', points: result.pointsNonTeaching, category: 'B2' },
      { name: 'Infra', points: result.pointsInfra, category: 'B2' },

      { name: 'Investigación', points: result.pointsResearch, category: 'B3' },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        {/* KPI MAIN ROW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Presupuesto Anual Estimado</p>
                <h3 className="text-4xl font-bold tracking-tight">{formatCurrency(result.estimatedBudget)}</h3>
                <div className="mt-4 flex items-center space-x-2">
                  <span className="bg-blue-500/30 px-2 py-1 rounded text-xs">Participación del Sistema: {result.distributionPercentage.toFixed(4)}%</span>
                </div>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">Costo por Alumno</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">{formatCurrency(result.costPerStudent)}</h3>
                <p className="text-xs text-slate-400 mt-1">Eficiencia de Inversión</p>
              </div>
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <Users className="text-slate-600 dark:text-slate-300 w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">Score Polinómico</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">{formatScore(result.totalScore)}</h3>
                <p className="text-xs text-slate-400 mt-1">Puntos Totales (CIN)</p>
              </div>
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <Activity className="text-slate-600 dark:text-slate-300 w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* COMPOSITION ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Estructura de Bloques (CIN)</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => formatScore(value)} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Desglose de Puntos por Variable</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                  <RechartsTooltip
                    cursor={{ fill: '#f1f5f9' }}
                    formatter={(value: number) => [formatScore(value), "Puntos Brutos"]}
                  />
                  <Bar dataKey="points" radius={[0, 4, 4, 0]} barSize={20}>
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.category === 'B1' ? '#4F46E5' : entry.category === 'B3' ? '#E11D48' : '#10B981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* DETAILED TABLES BY BLOCK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
            <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-3 flex items-center gap-2"><BookOpen size={16} /> Bloque 1: Académico</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-indigo-700 dark:text-indigo-300">Actividad Alumnos</span>
                <span className="font-mono font-bold dark:text-white">{formatScore(result.pointsStudentsActivity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-700 dark:text-indigo-300">Complejidad</span>
                <span className="font-mono font-bold dark:text-white">{formatScore(result.pointsStudentsComplexity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-700 dark:text-indigo-300">Egresados</span>
                <span className="font-mono font-bold dark:text-white">{formatScore(result.pointsGraduates)}</span>
              </div>
              <div className="border-t border-indigo-200 dark:border-indigo-700 pt-2 mt-2 flex justify-between font-bold dark:text-indigo-100">
                <span>Total Ponderado (45%)</span>
                <span>{formatScore(result.block1WeightedScore)}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-3 flex items-center gap-2"><Building size={16} /> Bloque 2: Normativo</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-emerald-700 dark:text-emerald-300">Autoridades</span>
                <span className="font-mono font-bold dark:text-white">{formatScore(result.pointsAuthorities)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 dark:text-emerald-300">Planta Docente</span>
                <span className="font-mono font-bold dark:text-white">{formatScore(result.pointsFaculty)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 dark:text-emerald-300">No Docentes</span>
                <span className="font-mono font-bold dark:text-white">{formatScore(result.pointsNonTeaching)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 dark:text-emerald-300">Infra (m² + Verdes)</span>
                <span className="font-mono font-bold dark:text-white">{formatScore(result.pointsInfra)}</span>
              </div>
              <div className="border-t border-emerald-200 dark:border-emerald-700 pt-2 mt-2 flex justify-between font-bold dark:text-emerald-100">
                <span>Total Ponderado (50%)</span>
                <span>{formatScore(result.block2WeightedScore)}</span>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4 border border-rose-100 dark:border-rose-800">
            <h4 className="font-bold text-rose-900 dark:text-rose-200 mb-3 flex items-center gap-2"><Beaker size={16} /> Bloque 3: CyT</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-rose-700 dark:text-rose-300">Investigadores</span>
                <span className="font-mono font-bold dark:text-white">{formatScore(result.pointsResearch)}</span>
              </div>
              <div className="border-t border-rose-200 dark:border-rose-700 pt-2 mt-2 flex justify-between font-bold dark:text-rose-100">
                <span>Total Ponderado (5%)</span>
                <span>{formatScore(result.block3WeightedScore)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- COMPARATIVE VIEW RENDER ---
  const renderComparativeView = () => {
    // Generate comparison data
    const comparisonData = allUniversities.map(uni => {
      const res = calculator(uni);
      return {
        name: uni.name,
        budget: res.estimatedBudget,
        score: res.totalScore,
        block1: res.block1WeightedScore,
        block2: res.block2WeightedScore,
        costStudent: res.costPerStudent,
      };
    });

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign size={20} className="text-green-600" />
            Comparativa Presupuestaria ($)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`} />
                <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="budget" name="Presupuesto" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Activity size={20} className="text-purple-600" />
              Puntaje Polinómico Total
            </h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                  <RechartsTooltip formatter={(value: number) => formatScore(value)} />
                  <Bar dataKey="score" name="Puntos" fill="#9333EA" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Users size={20} className="text-orange-600" />
              Costo por Alumno ($)
            </h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 0 }} /> {/* Hide text to fit */}
                  <YAxis tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="costStudent" name="Costo/Alumno" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* COMPARATIVE TABLE */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Table size={20} className="text-blue-600" />
            Detalle Comparativo de Indicadores
          </h3>
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="px-4 py-3">Universidad</th>
                <th className="px-4 py-3 text-right">Presupuesto ($)</th>
                <th className="px-4 py-3 text-right">Puntos Totales</th>
                <th className="px-4 py-3 text-right text-indigo-600 dark:text-indigo-400">B1 (Acad)</th>
                <th className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">B2 (Norm)</th>
                <th className="px-4 py-3 text-right">Costo Alumno</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {comparisonData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{item.name}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-blue-700 dark:text-blue-400">{formatCurrency(item.budget)}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold dark:text-slate-200">{formatScore(item.score)}</td>
                  <td className="px-4 py-3 text-right font-mono text-indigo-700 dark:text-indigo-300">{formatScore(item.block1)}</td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-700 dark:text-emerald-300">{formatScore(item.block2)}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">{formatCurrency(item.costStudent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg w-fit">
        <button
          onClick={() => setViewMode('individual')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'individual' ? 'bg-white dark:bg-slate-600 text-blue-700 dark:text-blue-300 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <div className="flex items-center gap-2">
            <Layout size={16} /> Vista Individual
          </div>
        </button>
        <button
          onClick={() => setViewMode('comparative')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'comparative' ? 'bg-white dark:bg-slate-600 text-blue-700 dark:text-blue-300 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <div className="flex items-center gap-2">
            <BarChart2 size={16} /> Comparativa
          </div>
        </button>
      </div>

      {viewMode === 'individual' ? renderIndividualView() : renderComparativeView()}
    </div>
  );
};
