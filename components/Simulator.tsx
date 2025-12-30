
import React, { useState } from 'react';
import { UniversityData, ModelWeights, Career, SubjectType, Discipline, CareerType, RESEARCH_WEIGHTS, ResearchMatrixRow, STANDARD_YEARLY_MATRICES, STUDENT_DISTRIBUTION, CalculationResult } from '../types';
import { calculateDistributedStudents } from '../utils/distribution';
import { BookOpen, Users, Beaker, Building, Plus, Trash2, Calculator, School, TreeDeciduous, GraduationCap, Briefcase, ChevronDown, ChevronUp, Table, Settings, DollarSign, Activity } from 'lucide-react';

interface SimulatorProps {
    universities: UniversityData[];
    selectedId: string;
    weights: ModelWeights;
    onUniversityChange: (updatedUni: UniversityData) => void;
    onSelectUniversity: (id: string) => void;
    onAddUniversity: () => void;
    onWeightsChange: (weights: ModelWeights) => void;
    result: CalculationResult;
}

// PDF Page 17 - 2.1.6 Relaciones estándares
const RATIOS: Record<SubjectType, { prof: number; aux: number; name: string; desc: string }> = {
    [SubjectType.A]: { prof: 30, aux: 15, name: 'Tipo A', desc: 'Salud / Campo' },
    [SubjectType.B]: { prof: 60, aux: 25, name: 'Tipo B', desc: 'Laboratorio' },
    [SubjectType.C]: { prof: 90, aux: 35, name: 'Tipo C', desc: 'Teórico-Práctico' },
    [SubjectType.D]: { prof: 120, aux: 60, name: 'Tipo D', desc: 'Teórico puro' },
};

const MathRow = ({
    label,
    value,
    onChange,
    concept,
    weight,
    prefix = "",
    highlight = false,
    unit = "pts"
}: any) => {
    const points = Math.round((value || 0) * weight);

    return (
        <div className={`flex flex-col lg:flex-row gap-4 p-4 border rounded-lg items-center transition-all ${highlight ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-500'}`}>
            <div className="w-full lg:w-1/2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">{label}</label>
                <p className="text-xs text-slate-500 mb-2 min-h-[1.5em]">{concept}</p>
                <div className="relative flex-1">
                    {prefix && <span className="absolute left-3 top-2 text-slate-400 text-sm font-bold">{prefix}</span>}
                    <input
                        type="number"
                        value={value}
                        onChange={onChange}
                        className={`w-full border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-100 dark:bg-slate-900 font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none p-2 ${prefix ? 'pl-8' : ''}`}
                    />
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-end bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 sm:gap-4 text-sm font-mono flex-wrap justify-end">
                    <div className="text-center">
                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Valor</span>
                        <span className="font-bold text-slate-700">{(value || 0).toLocaleString()}</span>
                    </div>
                    <div className="text-slate-400 font-bold">×</div>
                    <div className="text-center">
                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Coef</span>
                        <span className="font-bold text-blue-600">{weight.toFixed(4)}</span>
                    </div>
                    <div className="text-slate-400 font-bold">=</div>
                    <div className="text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-3 py-1 rounded shadow-sm min-w-[80px]">
                        <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Puntos</span>
                        <span className="font-bold text-emerald-600 text-lg">{points.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Simulator: React.FC<SimulatorProps> = ({
    universities,
    selectedId,
    weights,
    onUniversityChange,
    onSelectUniversity,
    onAddUniversity,
    onWeightsChange,
    result
}) => {
    const currentUni = universities.find(u => u.id === selectedId) || universities[0];
    const [expandedCareerId, setExpandedCareerId] = useState<string | null>(null);
    const [showGlobalSettings, setShowGlobalSettings] = useState<boolean>(true);

    if (!currentUni) return <div className="p-10 text-center text-slate-500">Cargando datos de la universidad...</div>;

    const toggleExpand = (id: string) => {
        setExpandedCareerId(expandedCareerId === id ? null : id);
    };

    const handleCareerChange = (index: number, field: keyof Career, value: any) => {
        const updatedCareers = [...currentUni.careers];

        // If discipline changes, load the standard matrix from PDF (Yearly)
        if (field === 'discipline') {
            const yearlyMatrix = STANDARD_YEARLY_MATRICES[value as Discipline] || [];
            // Calculate total subjects
            const totalSubj = yearlyMatrix.reduce((acc, y) => acc + y.A + y.B + y.C + y.D, 0);

            updatedCareers[index] = {
                ...updatedCareers[index],
                discipline: value,
                yearlyMatrix: JSON.parse(JSON.stringify(yearlyMatrix)), // Deep copy
                subjectsInPlan: totalSubj
            };
        } else {
            updatedCareers[index] = { ...updatedCareers[index], [field]: value };
        }
        onUniversityChange({ ...currentUni, careers: updatedCareers });
    };

    const handleYearlyMatrixChange = (careerIndex: number, yearIdx: number, type: 'A' | 'B' | 'C' | 'D', val: number) => {
        const updatedCareers = [...currentUni.careers];
        const updatedMatrix = [...updatedCareers[careerIndex].yearlyMatrix];
        updatedMatrix[yearIdx] = { ...updatedMatrix[yearIdx], [type]: val };

        const totalSubjects = updatedMatrix.reduce((acc, y) => acc + y.A + y.B + y.C + y.D, 0);

        updatedCareers[careerIndex] = {
            ...updatedCareers[careerIndex],
            yearlyMatrix: updatedMatrix,
            subjectsInPlan: totalSubjects
        };
        onUniversityChange({ ...currentUni, careers: updatedCareers });
    };

    const handleSimpleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onUniversityChange({
            ...currentUni,
            [name]: name === 'name' ? value : Number(value)
        });
    };

    const handleResearchChange = (cat: keyof typeof currentUni.researchMatrix, field: keyof ResearchMatrixRow, value: number) => {
        const updatedMatrix = { ...currentUni.researchMatrix };
        updatedMatrix[cat] = { ...updatedMatrix[cat], [field]: value };
        onUniversityChange({ ...currentUni, researchMatrix: updatedMatrix });
    };

    const addCareer = () => {
        const defaultDiscipline = Discipline.SOCIALES;
        const defaultMatrix = STANDARD_YEARLY_MATRICES[defaultDiscipline];
        const totalSubj = defaultMatrix.reduce((acc, y) => acc + y.A + y.B + y.C + y.D, 0);

        const newCareer: Career = {
            id: Date.now().toString(),
            name: 'Nueva Carrera',
            discipline: defaultDiscipline,
            type: CareerType.LARGA,
            yearlyMatrix: JSON.parse(JSON.stringify(defaultMatrix)),
            freshmanCount: 100,
            retentionRate: 0.8,
            reenrolledCount: 300,
            subjectsInPlan: totalSubj,
            averageSubjectsPassed: 3,
        };
        onUniversityChange({ ...currentUni, careers: [...currentUni.careers, newCareer] });
    };

    const removeCareer = (index: number) => {
        const updatedCareers = currentUni.careers.filter((_, i) => i !== index);
        onUniversityChange({ ...currentUni, careers: updatedCareers });
    };

    const totalCalculatedModules = currentUni.careers.reduce((acc, c) => {
        // Recalculate modules here for display summary
        let totalMod = 0;
        const distNew = STUDENT_DISTRIBUTION[c.type].new;
        const distRe = STUDENT_DISTRIBUTION[c.type].reenrolled;
        const utilization = c.subjectsInPlan > 0 ? c.averageSubjectsPassed / c.subjectsInPlan : 0;

        c.yearlyMatrix.forEach((ym, i) => {
            const studentsInYear = (c.freshmanCount * c.retentionRate * (distNew[i] || 0)) + (c.reenrolledCount * (distRe[i] || 0));

            (['A', 'B', 'C', 'D'] as const).forEach(type => {
                const count = ym[type];
                if (count > 0) {
                    const r = RATIOS[type];
                    totalMod += ((studentsInYear / r.prof) + (studentsInYear / r.aux)) * count * utilization;
                }
            });
        });
        return acc + totalMod;
    }, 0);

    // Research Matrix Display Logic
    const calcResearchRow = (row: ResearchMatrixRow, weights: any) => {
        return (row.exclusive * weights.ex) + (row.semiExclusive * weights.se) + (row.simple * weights.si);
    };

    return (
        <div className="pb-20 space-y-8">

            {/* HEADER MANAGER & GLOBAL SETTINGS */}
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-700">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <div className="bg-blue-600 p-2 rounded-lg"><School className="text-white w-6 h-6" /></div>
                        <div className="flex-1">
                            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Seleccionar Universidad</label>
                            <div className="flex gap-2">
                                <select
                                    value={currentUni.id}
                                    onChange={(e) => onSelectUniversity(e.target.value)}
                                    className="bg-slate-700 text-white border border-slate-600 rounded px-3 py-1 outline-none text-sm w-48"
                                >
                                    {universities.map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}
                                </select>
                                <button onClick={onAddUniversity} className="bg-emerald-600 hover:bg-emerald-700 px-2 py-1 rounded text-white"><Plus size={16} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-auto flex-1 md:max-w-md">
                        <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Nombre Institucional</label>
                        <input
                            type="text"
                            name="name"
                            value={currentUni.name}
                            onChange={handleSimpleInputChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white outline-none font-bold"
                        />
                    </div>
                    <button
                        onClick={() => setShowGlobalSettings(!showGlobalSettings)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-xs uppercase font-bold border border-slate-700 px-3 py-2 rounded hover:bg-slate-800"
                    >
                        <Settings size={14} /> {showGlobalSettings ? 'Ocultar Parámetros' : 'Configurar Modelo'}
                    </button>
                </div>

                {/* GLOBAL MODEL PARAMETERS (Exogenous Variables) */}
                {showGlobalSettings && (
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                        <div className="flex flex-col gap-2">
                            <label className="text-emerald-400 text-xs font-bold uppercase flex items-center gap-2">
                                <DollarSign size={14} /> Presupuesto Total a Distribuir ($)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-mono">$</span>
                                <input
                                    type="number"
                                    value={weights.totalSystemBudget}
                                    onChange={(e) => onWeightsChange({ ...weights, totalSystemBudget: Number(e.target.value) })}
                                    className="w-full bg-slate-900 border border-slate-600 rounded pl-8 pr-4 py-2 text-white font-mono font-bold focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400">Monto total disponible para todo el sistema universitario (Variable exógena).</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-purple-400 text-xs font-bold uppercase flex items-center gap-2">
                                <Activity size={14} /> Puntos Totales del Sistema (Base)
                            </label>
                            <input
                                type="number"
                                value={weights.totalSystemPoints}
                                onChange={(e) => onWeightsChange({ ...weights, totalSystemPoints: Number(e.target.value) })}
                                className="w-full bg-slate-900 border border-slate-600 rounded px-4 py-2 text-white font-mono font-bold focus:border-purple-500 outline-none"
                            />
                            <p className="text-[10px] text-slate-400">Suma total de puntos de todas las universidades (para calcular la participación relativa).</p>
                        </div>
                    </div>
                )}
            </div>

            {/* === BLOCK 1: ACADEMIC (45%) === */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/20">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <BookOpen className="text-indigo-600 w-6 h-6" />
                            <div>
                                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200">Bloque 1: Calidad y Actividad (45%)</h3>
                                <p className="text-xs text-indigo-600 dark:text-indigo-400">Gestión de Matrices Disciplinares por Año y Distribución Estudiantil (PDF 2.1.3).</p>
                            </div>
                        </div>
                        <button onClick={addCareer} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm hover:bg-indigo-700">
                            <Plus size={16} /> Agregar Carrera
                        </button>
                    </div>
                </div>

                {/* Careers Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-3 py-3 w-40">Carrera</th>
                                <th className="px-3 py-3 w-32">Disciplina</th>
                                <th className="px-3 py-3 w-28">Tipo</th>
                                <th className="px-2 py-3 text-center w-20" title="Nuevos Inscriptos">Inscriptos</th>
                                <th className="px-2 py-3 text-center w-20" title="Factor Deserción">Retención</th>
                                <th className="px-2 py-3 text-center w-20" title="Reinscriptos">Reinscrip.</th>
                                <th className="px-2 py-3 text-center bg-blue-50 dark:bg-blue-900/20 w-24 border-l border-blue-200 dark:border-blue-800">Alum. Ajust.</th>
                                <th className="px-2 py-3 text-center w-16" title="Materias Plan">Mat. Plan</th>
                                <th className="px-2 py-3 text-center w-24">Acciones</th>
                                <th className="w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {currentUni.careers.map((career, idx) => {
                                const adjustedStudents = (career.freshmanCount * career.retentionRate) + career.reenrolledCount;
                                const isExpanded = expandedCareerId === career.id;

                                // ---- MODULE CALCULATION FOR DISPLAY ----
                                const utilizationFactor = career.subjectsInPlan > 0 ? (career.averageSubjectsPassed / career.subjectsInPlan) : 0;
                                let rawModulesProf = 0;
                                let rawModulesAux = 0;

                                const distNew = STUDENT_DISTRIBUTION[career.type].new;
                                const distRe = STUDENT_DISTRIBUTION[career.type].reenrolled;

                                career.yearlyMatrix.forEach((ym, yearIdx) => {
                                    const studentsInYear = (career.freshmanCount * career.retentionRate * (distNew[yearIdx] || 0)) + (career.reenrolledCount * (distRe[yearIdx] || 0));
                                    (['A', 'B', 'C', 'D'] as const).forEach(type => {
                                        const count = ym[type];
                                        if (count > 0) {
                                            const r = RATIOS[type];
                                            rawModulesProf += (studentsInYear / r.prof) * count;
                                            rawModulesAux += (studentsInYear / r.aux) * count;
                                        }
                                    });
                                });

                                const adjustedTotalModules = (rawModulesProf + rawModulesAux) * utilizationFactor;
                                // ----------------------------------------

                                return (
                                    <React.Fragment key={career.id}>
                                        <tr className={`hover:bg-slate-50 dark:hover:bg-slate-750 group transition-colors ${isExpanded ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                                            <td className="px-3 py-2"><input type="text" value={career.name} onChange={(e) => handleCareerChange(idx, 'name', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded px-2 py-1 text-xs font-medium dark:text-slate-200" /></td>
                                            <td className="px-3 py-2">
                                                <select value={career.discipline} onChange={(e) => handleCareerChange(idx, 'discipline', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded px-2 py-1 text-xs truncate dark:text-slate-200">
                                                    {Object.entries(Discipline).map(([k, v]) => <option key={k} value={v}>{v}</option>)}
                                                </select>
                                            </td>
                                            <td className="px-3 py-2">
                                                <select value={career.type} onChange={(e) => handleCareerChange(idx, 'type', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded px-2 py-1 text-xs dark:text-slate-200">
                                                    {Object.entries(CareerType).map(([k, v]) => <option key={k} value={v}>{v}</option>)}
                                                </select>
                                            </td>

                                            <td className="px-2 py-2"><input type="number" value={career.freshmanCount} onChange={(e) => handleCareerChange(idx, 'freshmanCount', Number(e.target.value))} className="w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded px-1 py-1 dark:text-slate-200" /></td>
                                            <td className="px-2 py-2"><input type="number" step="0.01" value={career.retentionRate} onChange={(e) => handleCareerChange(idx, 'retentionRate', Number(e.target.value))} className="w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded px-1 py-1 dark:text-slate-200" /></td>
                                            <td className="px-2 py-2"><input type="number" value={career.reenrolledCount} onChange={(e) => handleCareerChange(idx, 'reenrolledCount', Number(e.target.value))} className="w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded px-1 py-1 dark:text-slate-200" /></td>

                                            <td className="px-2 py-2 bg-blue-50 dark:bg-blue-900/20 border-l border-blue-200 dark:border-blue-800 text-center font-bold text-blue-700 dark:text-blue-300">{Math.round(adjustedStudents)}</td>

                                            <td className="px-2 py-2 bg-slate-50 dark:bg-slate-800 text-center font-mono text-xs text-slate-500 dark:text-slate-400">{career.subjectsInPlan}</td>

                                            <td className="px-2 py-2 text-center">
                                                <button
                                                    onClick={() => toggleExpand(career.id)}
                                                    className={`text-xs px-2 py-1 rounded border flex items-center justify-center gap-1 w-full ${isExpanded ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`}
                                                >
                                                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />} Matriz
                                                </button>
                                            </td>

                                            <td className="px-2 py-2 text-center"><button onClick={() => removeCareer(idx)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button></td>
                                        </tr>

                                        {/* EXPANDED YEARLY MATRIX DETAIL */}
                                        {isExpanded && (
                                            <tr>
                                                <td colSpan={10} className="bg-slate-50 dark:bg-slate-800/80 p-4 border-b border-slate-200 dark:border-slate-700 shadow-inner">
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase border-b border-indigo-200 dark:border-indigo-800 pb-1 mb-2">
                                                            <Table size={14} /> Detalle Matriz Anual y Distribución Estudiantil (PDF 2.1.3)
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                            <div className="col-span-2">
                                                                <table className="w-full text-xs text-center border-collapse bg-white shadow-sm rounded-lg overflow-hidden border border-slate-200">
                                                                    <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                                                                        <tr>
                                                                            <th className="p-2 border border-slate-200 dark:border-slate-600 w-16">Año</th>
                                                                            <th className="p-2 border border-slate-200 dark:border-slate-600 bg-blue-50/50 dark:bg-blue-900/30">Alumnos (Calc)</th>
                                                                            <th className="p-2 border border-slate-200 dark:border-slate-600 w-12 text-red-600 dark:text-red-400" title="Campo/Salud">A (30)</th>
                                                                            <th className="p-2 border border-slate-200 dark:border-slate-600 w-12 text-orange-600 dark:text-orange-400" title="Laboratorio">B (60)</th>
                                                                            <th className="p-2 border border-slate-200 dark:border-slate-600 w-12 text-yellow-600 dark:text-yellow-400" title="Teorico-Practico">C (90)</th>
                                                                            <th className="p-2 border border-slate-200 dark:border-slate-600 w-12 text-green-600 dark:text-green-400" title="Teorico">D (120)</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {(() => {
                                                                            const totalAdjusted = (career.freshmanCount * career.retentionRate) + career.reenrolledCount;
                                                                            const distPercentages = career.yearlyMatrix.map((_, i) => {
                                                                                const pN = STUDENT_DISTRIBUTION[career.type].new[i] || 0;
                                                                                const pR = STUDENT_DISTRIBUTION[career.type].reenrolled[i] || 0;
                                                                                const val = (career.freshmanCount * career.retentionRate * pN) + (career.reenrolledCount * pR);
                                                                                return totalAdjusted > 0 ? val / totalAdjusted : 0;
                                                                            });
                                                                            const distributedStudents = calculateDistributedStudents(totalAdjusted, distPercentages);

                                                                            return career.yearlyMatrix.map((ym, yearIdx) => {
                                                                                const distNew = STUDENT_DISTRIBUTION[career.type].new[yearIdx] || 0;
                                                                                const distRe = STUDENT_DISTRIBUTION[career.type].reenrolled[yearIdx] || 0;
                                                                                const yearStudents = distributedStudents[yearIdx];

                                                                                return (
                                                                                    <tr key={yearIdx} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                                                                                        <td className="p-2 border border-slate-200 dark:border-slate-600 font-bold bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300">{ym.year}° Año</td>
                                                                                        <td className="p-2 border border-slate-200 dark:border-slate-600 font-mono text-blue-700 dark:text-blue-300 font-bold bg-blue-50/30 dark:bg-blue-900/10">
                                                                                            {Math.round(yearStudents).toLocaleString()}
                                                                                            <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-normal">{(distNew * 100).toFixed(0)}% N + {(distRe * 100).toFixed(0)}% R</span>
                                                                                        </td>
                                                                                        <td className="p-1 border border-slate-200 dark:border-slate-600"><input type="number" className="w-full text-center py-1 bg-red-50/30 dark:bg-red-900/20 rounded dark:text-slate-200" value={ym.A} onChange={(e) => handleYearlyMatrixChange(idx, yearIdx, 'A', Number(e.target.value))} /></td>
                                                                                        <td className="p-1 border border-slate-200 dark:border-slate-600"><input type="number" className="w-full text-center py-1 bg-orange-50/30 dark:bg-orange-900/20 rounded dark:text-slate-200" value={ym.B} onChange={(e) => handleYearlyMatrixChange(idx, yearIdx, 'B', Number(e.target.value))} /></td>
                                                                                        <td className="p-1 border border-slate-200 dark:border-slate-600"><input type="number" className="w-full text-center py-1 bg-yellow-50/30 dark:bg-yellow-900/20 rounded dark:text-slate-200" value={ym.C} onChange={(e) => handleYearlyMatrixChange(idx, yearIdx, 'C', Number(e.target.value))} /></td>
                                                                                        <td className="p-1 border border-slate-200 dark:border-slate-600"><input type="number" className="w-full text-center py-1 bg-green-50/30 dark:bg-green-900/20 rounded dark:text-slate-200" value={ym.D} onChange={(e) => handleYearlyMatrixChange(idx, yearIdx, 'D', Number(e.target.value))} /></td>
                                                                                    </tr>
                                                                                )
                                                                            });
                                                                        })()}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            <div className="col-span-1 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center gap-4">
                                                                <div>
                                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Promedio Materias Aprobadas</label>
                                                                    <input type="number" step="0.1" value={career.averageSubjectsPassed} onChange={(e) => handleCareerChange(idx, 'averageSubjectsPassed', Number(e.target.value))} className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-900 rounded p-2 text-center font-bold text-lg dark:text-white" />
                                                                    <p className="text-[10px] text-slate-400 mt-1">Factor de Actividad (2.1.4)</p>
                                                                </div>
                                                                <div className="border-t dark:border-slate-700 pt-4">
                                                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Total Materias Plan</p>
                                                                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">{career.subjectsInPlan}</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* MODULE CALCULATION BREAKDOWN */}
                                                        <div className="mt-6 border-t border-slate-200 pt-4">
                                                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                                                <Calculator size={14} /> Cálculo de Módulos Docentes (Impacto Presupuestario)
                                                            </h4>
                                                            <div className="bg-indigo-50/50 rounded-lg border border-indigo-100 p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                                                                {/* RAW MODULES */}
                                                                <div className="md:col-span-3 space-y-2">
                                                                    <div className="flex justify-between items-center text-sm">
                                                                        <span className="text-slate-600">Módulos Profesor (Teóricos)</span>
                                                                        <span className="font-mono font-bold text-slate-800">{rawModulesProf.toFixed(1)}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-sm">
                                                                        <span className="text-slate-600">Módulos Auxiliar (Prácticos)</span>
                                                                        <span className="font-mono font-bold text-slate-800">{rawModulesAux.toFixed(1)}</span>
                                                                    </div>
                                                                    <div className="border-t border-indigo-200 pt-1 mt-1 flex justify-between items-center text-xs font-bold text-indigo-700">
                                                                        <span>Total Módulos Base</span>
                                                                        <span>{(rawModulesProf + rawModulesAux).toFixed(1)}</span>
                                                                    </div>
                                                                </div>

                                                                {/* MULTIPLIER */}
                                                                <div className="md:col-span-1 flex justify-center">
                                                                    <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm border border-slate-200 text-slate-400 font-bold">
                                                                        ×
                                                                    </div>
                                                                </div>

                                                                {/* UTILIZATION FACTOR */}
                                                                <div className="md:col-span-3 text-center bg-white p-3 rounded border border-slate-200 shadow-sm">
                                                                    <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Factor de Utilización</div>
                                                                    <div className="text-2xl font-bold text-blue-600 font-mono">{utilizationFactor.toFixed(4)}</div>
                                                                    <div className="text-[10px] text-slate-400">({career.averageSubjectsPassed} aprobadas / {career.subjectsInPlan} plan)</div>
                                                                </div>

                                                                {/* EQUALS */}
                                                                <div className="md:col-span-1 flex justify-center">
                                                                    <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm border border-slate-200 text-slate-400 font-bold">
                                                                        =
                                                                    </div>
                                                                </div>

                                                                {/* RESULT */}
                                                                <div className="md:col-span-4 bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-center shadow-sm">
                                                                    <div className="text-xs text-emerald-800 uppercase font-bold mb-1">Módulos Docentes Requeridos</div>
                                                                    <div className="text-3xl font-bold text-emerald-600 font-mono">{adjustedTotalModules.toFixed(1)}</div>
                                                                    <div className="text-[10px] text-emerald-600/70 mt-1 font-medium">Input para Bloque 2 (Conversión a Cargos)</div>
                                                                </div>

                                                            </div>

                                                            <div className="mt-2 text-[10px] text-slate-400 flex gap-4">
                                                                <p>• Fórmula: (Alumnos / Ratio Docente) × Materias × Factor Utilización</p>
                                                                <p>• Ratios: A(30/15), B(60/25), C(90/35), D(120/60)</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Block 1 Footer */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border-t border-indigo-100 dark:border-indigo-800 p-4 rounded-b-xl flex justify-between items-center mt-6 -mx-6 -mb-6">
                    <span className="text-indigo-800 dark:text-indigo-300 font-bold uppercase text-sm flex items-center gap-2">
                        <Calculator size={16} /> Total Puntos Bloque 1 (Ponderado)
                    </span>
                    <span className="text-2xl font-bold font-mono text-indigo-700 dark:text-indigo-400">{result.block1WeightedScore.toLocaleString()}</span>
                </div>
            </div>

            {/* === BLOCK 2: NORMATIVE (50%) === */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2 border-b border-emerald-100 pb-4 mb-6">
                    <Building className="text-emerald-600" />
                    Bloque 2: Presupuesto Normativo (50%)
                </h3>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {/* 2.1.9 Conversion Módulos -> Cargos */}
                        <div className="bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg p-4">
                            <h4 className="text-sm font-bold text-emerald-800 uppercase flex items-center gap-2 mb-3">
                                <Calculator size={14} /> 2.1.9 Conversión de Módulos
                            </h4>
                            <div className="mb-4 text-xs text-emerald-700 dark:text-emerald-400">
                                Total Módulos (Bloque 1): <span className="font-bold text-lg">{totalCalculatedModules.toFixed(1)}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Defina la estructura (%) para transformar los módulos requeridos en cargos docentes.</p>

                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div>
                                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Exclusiva (%)</label>
                                    <input type="number" value={currentUni.facultyDistribution.exclusivePercent} onChange={(e) => onUniversityChange({ ...currentUni, facultyDistribution: { ...currentUni.facultyDistribution, exclusivePercent: Number(e.target.value) } })} className="w-full text-center border border-emerald-300 dark:border-emerald-700 dark:bg-slate-900 dark:text-slate-100 rounded p-1" />
                                </div>
                                <div>
                                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Semi (%)</label>
                                    <input type="number" value={currentUni.facultyDistribution.semiExclusivePercent} onChange={(e) => onUniversityChange({ ...currentUni, facultyDistribution: { ...currentUni.facultyDistribution, semiExclusivePercent: Number(e.target.value) } })} className="w-full text-center border border-emerald-300 dark:border-emerald-700 dark:bg-slate-900 dark:text-slate-100 rounded p-1" />
                                </div>
                                <div>
                                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Simple (%)</label>
                                    <input type="number" value={currentUni.facultyDistribution.simplePercent} onChange={(e) => onUniversityChange({ ...currentUni, facultyDistribution: { ...currentUni.facultyDistribution, simplePercent: Number(e.target.value) } })} className="w-full text-center border border-emerald-300 dark:border-emerald-700 dark:bg-slate-900 dark:text-slate-100 rounded p-1" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase flex items-center gap-2 mb-2 bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded">
                                <GraduationCap size={14} /> Autoridades Superiores (Nivel 1-2)
                            </h4>
                            <MathRow
                                label="Rectores y Vices"
                                value={currentUni.authoritiesRectors}
                                onChange={(e: any) => onUniversityChange({ ...currentUni, authoritiesRectors: Number(e.target.value) })}
                                weight={10.0}
                                concept="Máximas autoridades (Costo Unitario Alto)."
                            />
                            <MathRow
                                label="Decanos"
                                value={currentUni.authoritiesDeans}
                                onChange={(e: any) => onUniversityChange({ ...currentUni, authoritiesDeans: Number(e.target.value) })}
                                weight={8.0}
                                concept="Responsables de Unidad Académica."
                            />
                            <MathRow
                                label="Secretarios"
                                value={currentUni.authoritiesSecretaries}
                                onChange={(e: any) => onUniversityChange({ ...currentUni, authoritiesSecretaries: Number(e.target.value) })}
                                weight={6.0}
                                concept="Secretarios de gestión."
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* 2.2 Admission Courses */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase flex items-center gap-2 mb-3">
                                <Users size={14} /> 2.2 Cursos de Ingreso
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Alumnos Curso</label>
                                    <input type="number" value={currentUni.admissionCourseStudents} onChange={(e) => onUniversityChange({ ...currentUni, admissionCourseStudents: Number(e.target.value) })} className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-900 rounded p-1.5 dark:text-white" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Horas Cátedra</label>
                                    <input type="number" value={currentUni.admissionCourseHours} onChange={(e) => onUniversityChange({ ...currentUni, admissionCourseHours: Number(e.target.value) })} className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-900 rounded p-1.5 dark:text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase flex items-center gap-2 mb-2 bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded">
                                <Briefcase size={14} /> No Docentes
                            </h4>
                            <MathRow
                                label="Cat. A (Superiores)"
                                value={currentUni.nonTeachingCategoryA}
                                onChange={(e: any) => onUniversityChange({ ...currentUni, nonTeachingCategoryA: Number(e.target.value) })}
                                weight={2.5}
                                concept="Tramos Superiores del Convenio."
                            />
                            <MathRow
                                label="Cat. B (Operativos)"
                                value={currentUni.nonTeachingCategoryB}
                                onChange={(e: any) => onUniversityChange({ ...currentUni, nonTeachingCategoryB: Number(e.target.value) })}
                                weight={1.5}
                                concept="Personal administrativo y técnico."
                            />
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase flex items-center gap-2 mb-2 bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded">
                                <Calculator size={14} /> Infraestructura
                            </h4>
                            <div className="flex flex-col gap-2 p-3 border rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"><TreeDeciduous size={14} className="text-green-600 dark:text-green-400" /> Espacios Verdes (m²)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        value={currentUni.greenSpaceSqm}
                                        onChange={(e) => onUniversityChange({ ...currentUni, greenSpaceSqm: Number(e.target.value) })}
                                        className="w-32 border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded p-1 text-right font-mono"
                                    />
                                    <div className="text-xs font-mono text-slate-500 flex-1">
                                        1 Agente / 30.000m² = <span className="text-emerald-600 font-bold">{Math.round(currentUni.greenSpaceSqm / 30000).toLocaleString()} cargos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Block 2 Footer */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-100 dark:border-emerald-800 p-4 rounded-b-xl flex justify-between items-center mt-6 -mx-6 -mb-6">
                    <span className="text-emerald-800 dark:text-emerald-300 font-bold uppercase text-sm flex items-center gap-2">
                        <Calculator size={16} /> Total Puntos Bloque 2 (Ponderado)
                    </span>
                    <span className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">{result.block2WeightedScore.toLocaleString()}</span>
                </div>
            </div>

            {/* === BLOCK 3: SCIENCE (5%) === */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-rose-900 flex items-center gap-2 border-b border-rose-100 pb-4 mb-6">
                    <Beaker className="text-rose-600" />
                    Bloque 3: Ciencia y Técnica (5%)
                </h3>

                {/* RESEARCH MATRIX */}
                <div className="overflow-x-auto mb-6">
                    <h4 className="text-sm font-bold text-rose-800 uppercase mb-3">Matriz Docentes-Investigadores (Ponderada)</h4>
                    <table className="w-full text-sm text-center border-collapse">
                        <thead className="bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-200 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-2 border border-rose-200 dark:border-rose-800 text-left w-32">Categoría</th>
                                <th className="p-2 border border-rose-200 dark:border-rose-800 bg-rose-100/50 dark:bg-rose-900/40">Exclusiva (EX)</th>
                                <th className="p-2 border border-rose-200 dark:border-rose-800">Semi (SE)</th>
                                <th className="p-2 border border-rose-200 dark:border-rose-800">Simple (SI)</th>
                                <th className="p-2 border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 w-24">Puntos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-rose-100 dark:divide-rose-900/30">
                            {/* CAT 1 */}
                            <tr>
                                <td className="p-2 border border-rose-200 dark:border-rose-800 font-bold text-left dark:text-rose-200">Categoría 1</td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-900/10">
                                    <input type="number" value={currentUni.researchMatrix.cat1.exclusive} onChange={(e) => handleResearchChange('cat1', 'exclusive', Number(e.target.value))} className="w-16 text-center border rounded p-1 text-xs dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    <div className="text-[9px] text-slate-400">x{RESEARCH_WEIGHTS.cat1.ex}</div>
                                </td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800">
                                    <input type="number" value={currentUni.researchMatrix.cat1.semiExclusive} onChange={(e) => handleResearchChange('cat1', 'semiExclusive', Number(e.target.value))} className="w-16 text-center border rounded p-1 text-xs dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    <div className="text-[9px] text-slate-400">x{RESEARCH_WEIGHTS.cat1.se}</div>
                                </td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800">
                                    <input type="number" value={currentUni.researchMatrix.cat1.simple} onChange={(e) => handleResearchChange('cat1', 'simple', Number(e.target.value))} className="w-16 text-center border rounded p-1 text-xs dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    <div className="text-[9px] text-slate-400">x{RESEARCH_WEIGHTS.cat1.si}</div>
                                </td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800 font-bold text-rose-700 dark:text-rose-400">{calcResearchRow(currentUni.researchMatrix.cat1, RESEARCH_WEIGHTS.cat1).toFixed(2)}</td>
                            </tr>
                            {/* CAT 2 */}
                            <tr>
                                <td className="p-2 border border-rose-200 dark:border-rose-800 font-bold text-left dark:text-rose-200">Categoría 2</td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-900/10">
                                    <input type="number" value={currentUni.researchMatrix.cat2.exclusive} onChange={(e) => handleResearchChange('cat2', 'exclusive', Number(e.target.value))} className="w-16 text-center border rounded p-1 text-xs dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    <div className="text-[9px] text-slate-400">x{RESEARCH_WEIGHTS.cat2.ex}</div>
                                </td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800">
                                    <input type="number" value={currentUni.researchMatrix.cat2.semiExclusive} onChange={(e) => handleResearchChange('cat2', 'semiExclusive', Number(e.target.value))} className="w-16 text-center border rounded p-1 text-xs dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    <div className="text-[9px] text-slate-400">x{RESEARCH_WEIGHTS.cat2.se}</div>
                                </td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800">
                                    <input type="number" value={currentUni.researchMatrix.cat2.simple} onChange={(e) => handleResearchChange('cat2', 'simple', Number(e.target.value))} className="w-16 text-center border rounded p-1 text-xs dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    <div className="text-[9px] text-slate-400">x{RESEARCH_WEIGHTS.cat2.si}</div>
                                </td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800 font-bold text-rose-700 dark:text-rose-400">{calcResearchRow(currentUni.researchMatrix.cat2, RESEARCH_WEIGHTS.cat2).toFixed(2)}</td>
                            </tr>
                            {/* CAT 3-4 */}
                            <tr>
                                <td className="p-2 border border-rose-200 dark:border-rose-800 font-bold text-left dark:text-rose-200">Categoría 3-4</td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-900/10">
                                    <input type="number" value={currentUni.researchMatrix.cat34.exclusive} onChange={(e) => handleResearchChange('cat34', 'exclusive', Number(e.target.value))} className="w-16 text-center border rounded p-1 text-xs dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    <div className="text-[9px] text-slate-400">x{RESEARCH_WEIGHTS.cat34.ex}</div>
                                </td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800">
                                    <input type="number" value={currentUni.researchMatrix.cat34.semiExclusive} onChange={(e) => handleResearchChange('cat34', 'semiExclusive', Number(e.target.value))} className="w-16 text-center border rounded p-1 text-xs dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    <div className="text-[9px] text-slate-400">x{RESEARCH_WEIGHTS.cat34.se}</div>
                                </td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800">
                                    <input type="number" value={currentUni.researchMatrix.cat34.simple} onChange={(e) => handleResearchChange('cat34', 'simple', Number(e.target.value))} className="w-16 text-center border rounded p-1 text-xs dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    <div className="text-[9px] text-slate-400">x{RESEARCH_WEIGHTS.cat34.si}</div>
                                </td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800 font-bold text-rose-700 dark:text-rose-400">{calcResearchRow(currentUni.researchMatrix.cat34, RESEARCH_WEIGHTS.cat34).toFixed(2)}</td>
                            </tr>
                            {/* CAT 5 */}
                            <tr>
                                <td className="p-2 border border-rose-200 dark:border-rose-800 font-bold text-left dark:text-rose-200">Categoría 5</td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-900/10">
                                    <input type="number" value={currentUni.researchMatrix.cat5.exclusive} onChange={(e) => handleResearchChange('cat5', 'exclusive', Number(e.target.value))} className="w-16 text-center border rounded p-1 text-xs dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    <div className="text-[9px] text-slate-400">x{RESEARCH_WEIGHTS.cat5.ex}</div>
                                </td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800">
                                    <input type="number" value={currentUni.researchMatrix.cat5.semiExclusive} onChange={(e) => handleResearchChange('cat5', 'semiExclusive', Number(e.target.value))} className="w-16 text-center border rounded p-1 text-xs dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    <div className="text-[9px] text-slate-400">x{RESEARCH_WEIGHTS.cat5.se}</div>
                                </td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800">
                                    <input type="number" value={currentUni.researchMatrix.cat5.simple} onChange={(e) => handleResearchChange('cat5', 'simple', Number(e.target.value))} className="w-16 text-center border rounded p-1 text-xs dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                                    <div className="text-[9px] text-slate-400">x{RESEARCH_WEIGHTS.cat5.si}</div>
                                </td>
                                <td className="p-2 border border-rose-200 dark:border-rose-800 font-bold text-rose-700 dark:text-rose-400">{calcResearchRow(currentUni.researchMatrix.cat5, RESEARCH_WEIGHTS.cat5).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <MathRow
                    label="Becarios (Estímulo)"
                    value={currentUni.fellowships}
                    onChange={(e: any) => onUniversityChange({ ...currentUni, fellowships: Number(e.target.value) })}
                    weight={0.25}
                    concept="Formación de RRHH en CyT"
                />

                {/* Block 3 Footer */}
                <div className="bg-rose-50 dark:bg-rose-900/20 border-t border-rose-100 dark:border-rose-800 p-4 rounded-b-xl flex justify-between items-center mt-6 -mx-6 -mb-6">
                    <span className="text-rose-800 dark:text-rose-300 font-bold uppercase text-sm flex items-center gap-2">
                        <Calculator size={16} /> Total Puntos Bloque 3 (Ponderado)
                    </span>
                    <span className="text-2xl font-bold font-mono text-rose-700 dark:text-rose-400">{result.block3WeightedScore.toLocaleString()}</span>
                </div>
            </div>

            {/* === FINAL DISTRIBUTION SUMMARY === */}
            <div className="bg-slate-900 rounded-xl p-8 text-white shadow-xl animate-fade-in border border-slate-700">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-emerald-400">
                    <DollarSign size={24} /> Cálculo de Distribución Final (Metodología CIN)
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT COL: SCORE PROPIO - DETAILED BREAKDOWN */}
                    <div className="space-y-8">
                        <div className="bg-slate-800 p-6 rounded-lg border border-slate-600">
                            <h4 className="text-base uppercase font-bold text-slate-300 mb-6 border-b border-slate-600 pb-2">1. Score Propio (Desagregado)</h4>

                            {/* BLOQUE 1 */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold">
                                    <BookOpen size={16} /> Bloque 1: Académico (45%)
                                </div>
                                <div className="pl-6 space-y-1 text-xs text-slate-400 font-mono">
                                    <div className="flex justify-between">
                                        <span>+ Puntos Alumnos:</span>
                                        <span>{result.pointsStudentsActivity.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>+ Puntos Complejidad:</span>
                                        <span>{result.pointsStudentsComplexity.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-700 pb-1">
                                        <span>+ Puntos Egresados:</span>
                                        <span>{result.pointsGraduates.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-indigo-200 pt-1">
                                        <span>= Subtotal B1 (Sin Ponderar):</span>
                                        <span>{result.block1RawScore.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-indigo-900/40 p-2 rounded border border-indigo-500/30 mt-2">
                                        <span className="font-bold text-indigo-300">Total Puntos Bloque 1:</span>
                                        <span className="font-bold text-white text-sm">{result.block1WeightedScore.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* BLOQUE 2 */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold">
                                    <Building size={16} /> Bloque 2: Normativo (50%)
                                </div>
                                <div className="pl-6 space-y-1 text-xs text-slate-400 font-mono">
                                    <div className="flex justify-between">
                                        <span>+ Puntos Docentes:</span>
                                        <span>{result.pointsFaculty.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>+ Puntos No Docentes:</span>
                                        <span>{result.pointsNonTeaching.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>+ Puntos Autoridades:</span>
                                        <span>{result.pointsAuthorities.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>+ Puntos Infraestructura:</span>
                                        <span>{result.pointsInfra.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-700 pb-1">
                                        <span>+ Puntos Cursos Ingreso:</span>
                                        <span>{result.pointsAdmissionCourse.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-emerald-200 pt-1">
                                        <span>= Subtotal B2 (Pre-Escala):</span>
                                        <span>{(result.pointsFaculty + result.pointsNonTeaching + result.pointsAuthorities + result.pointsInfra + result.pointsAdmissionCourse).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 italic">
                                        <span>× Economía de Escala:</span>
                                        <span>{currentUni.economiesOfScale.toFixed(4)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-emerald-200 border-t border-slate-700 pt-1 mt-1">
                                        <span>= Subtotal B2 (Final):</span>
                                        <span>{result.block2RawScore.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-emerald-900/40 p-2 rounded border border-emerald-500/30 mt-2">
                                        <span className="font-bold text-emerald-300">Total Puntos Bloque 2:</span>
                                        <span className="font-bold text-white text-sm">{result.block2WeightedScore.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* BLOQUE 3 */}
                            <div className="mb-2">
                                <div className="flex items-center gap-2 mb-2 text-rose-400 font-bold">
                                    <Beaker size={16} /> Bloque 3: Investigación (5%)
                                </div>
                                <div className="pl-6 space-y-1 text-xs text-slate-400 font-mono">
                                    <div className="flex justify-between border-b border-slate-700 pb-1">
                                        <span>+ Puntos Matrices + Becarios:</span>
                                        <span>{result.pointsResearch.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-rose-200 pt-1">
                                        <span>= Subtotal B3 (Sin Ponderar):</span>
                                        <span>{result.block3RawScore.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-rose-900/40 p-2 rounded border border-rose-500/30 mt-2">
                                        <span className="font-bold text-rose-300">Total Puntos Bloque 3:</span>
                                        <span className="font-bold text-white text-sm">{result.block3WeightedScore.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TOTAL PROPIO */}
                        <div className="bg-gradient-to-r from-yellow-900/50 to-slate-800 p-5 rounded-lg border border-yellow-700/50">
                            <div className="flex justify-between items-center">
                                <span className="text-yellow-400 font-bold uppercase text-sm">Sumatoria de Puntos</span>
                                <span className="text-3xl font-bold font-mono text-yellow-400">{result.totalScore.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-yellow-600/70 mt-1 text-right">Total Bloque 1 + Total Bloque 2 + Total Bloque 3</p>
                        </div>
                    </div>

                    {/* RIGHT COL: PARTICIPATION AND BUDGET */}
                    <div className="space-y-6">
                        <div className="bg-slate-800 p-5 rounded-lg border border-slate-600">
                            <h4 className="text-sm uppercase font-bold text-slate-400 mb-4">2. Contexto Competitivo</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300">Score Resto del Sistema</span>
                                    <span className="font-mono font-bold">{weights.totalSystemPoints.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-slate-600 pt-2">
                                    <span className="text-purple-300 font-bold">Score Total Sistema (Suma)</span>
                                    <span className="font-mono font-bold text-lg text-purple-300">{(weights.totalSystemPoints + result.totalScore).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-5 rounded-lg border border-slate-600 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Activity size={100} />
                            </div>
                            <h4 className="text-sm uppercase font-bold text-slate-400 mb-4">3. Participación (Share)</h4>

                            <div className="text-center py-2">
                                <div className="font-mono text-sm text-slate-300 mb-2">Score Propio / (Score Propio + Score Resto)</div>
                                <div className="text-3xl font-bold text-blue-400 font-mono">
                                    {result.distributionPercentage.toFixed(6)}%
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Porcentaje de la "torta" presupuestaria.</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 p-5 rounded-lg border border-emerald-700 relative shadow-lg">
                            <h4 className="text-sm uppercase font-bold text-emerald-400 mb-4">4. Presupuesto Final Asignado</h4>

                            <div className="flex flex-col gap-1 mb-4">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Presupuesto Total Disponible (Exógeno):</span>
                                    <span className="font-mono text-white">${weights.totalSystemBudget.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Participación:</span>
                                    <span className="font-mono text-white">{result.distributionPercentage.toFixed(6)}%</span>
                                </div>
                            </div>

                            <div className="text-center border-t border-emerald-800 pt-4">
                                <div className="text-4xl font-bold text-white font-mono tracking-tight">
                                    ${result.estimatedBudget.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                </div>
                                <div className="text-emerald-400 text-sm font-bold mt-1">Monto Anual Estimado</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-slate-500">
                    * El cálculo es dinámico. Modifique las variables en los bloques superiores o la configuración global para ver el impacto inmediato.
                </div>
            </div>
        </div>


    );
};
