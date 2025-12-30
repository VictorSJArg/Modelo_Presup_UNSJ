
import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Simulator } from './components/Simulator';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ManualGenerator } from './components/ManualGenerator';
import { calculateDistributedStudents } from './utils/distribution';
import { UniversityData, ModelWeights, CalculationResult, AppView, SubjectType, Career, Discipline, CareerType, DISCIPLINE_WEIGHTS, RESEARCH_WEIGHTS, ResearchMatrixRow, STANDARD_YEARLY_MATRICES, STUDENT_DISTRIBUTION } from './types';

// Ratios defined for Block 1 Module calculation (Page 17)
const RATIOS: Record<SubjectType, { prof: number; aux: number }> = {
  [SubjectType.A]: { prof: 30, aux: 15 },
  [SubjectType.B]: { prof: 60, aux: 25 },
  [SubjectType.C]: { prof: 90, aux: 35 },
  [SubjectType.D]: { prof: 120, aux: 60 },
};

const SIMULATED_SYSTEM_TOTAL_POINTS = 1500000;

const INITIAL_CAREERS: Career[] = [
  {
    id: '1', name: 'Medicina', discipline: Discipline.MEDICINA, type: CareerType.LARGA,
    yearlyMatrix: JSON.parse(JSON.stringify(STANDARD_YEARLY_MATRICES[Discipline.MEDICINA])),
    freshmanCount: 1200, retentionRate: 0.75, reenrolledCount: 3500,
    subjectsInPlan: 35, averageSubjectsPassed: 4.5
  },
  {
    id: '2', name: 'Abogacía', discipline: Discipline.DERECHO, type: CareerType.LARGA,
    yearlyMatrix: JSON.parse(JSON.stringify(STANDARD_YEARLY_MATRICES[Discipline.DERECHO])),
    freshmanCount: 2000, retentionRate: 0.60, reenrolledCount: 5000,
    subjectsInPlan: 35, averageSubjectsPassed: 2.5
  },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const [universities, setUniversities] = useState<UniversityData[]>([
    {
      id: 'uni-1',
      name: 'Universidad Nacional Modelo',

      regionalCostFactor: 1.0,
      economiesOfScale: 1.0,

      careers: INITIAL_CAREERS,
      totalAdjustedStudents: 0,
      totalGraduates: 980,

      // Faculty Structure Distribution (default example)
      facultyDistribution: { exclusivePercent: 20, semiExclusivePercent: 30, simplePercent: 50 },

      // Admission
      admissionCourseStudents: 1500,
      admissionCourseHours: 120,

      authoritiesRectors: 2,
      authoritiesDeans: 12,
      authoritiesSecretaries: 40,

      nonTeachingCategoryA: 150,
      nonTeachingCategoryB: 700,
      infrastructureSqm: 55000,
      greenSpaceSqm: 100000,

      researchMatrix: {
        cat1: { exclusive: 10, semiExclusive: 5, simple: 2 },
        cat2: { exclusive: 20, semiExclusive: 10, simple: 5 },
        cat34: { exclusive: 40, semiExclusive: 20, simple: 10 },
        cat5: { exclusive: 10, semiExclusive: 10, simple: 10 },
      },
      fellowships: 50,
    }
  ]);

  const [selectedUniId, setSelectedUniId] = useState<string>('uni-1');

  const [weights, setWeights] = useState<ModelWeights>({
    weightBlockEducation: 0.45,
    weightBlockNormative: 0.50,
    weightBlockResearch: 0.05,
    totalSystemBudget: 50000000000,
    totalSystemPoints: SIMULATED_SYSTEM_TOTAL_POINTS
  });

  const handleAddUniversity = () => {
    const newId = `uni-${Date.now()}`;
    const newUni: UniversityData = {
      id: newId,
      name: 'Nueva Universidad',
      regionalCostFactor: 1.0,
      economiesOfScale: 1.0,
      careers: [],
      totalAdjustedStudents: 0,
      totalGraduates: 0,

      facultyDistribution: { exclusivePercent: 20, semiExclusivePercent: 30, simplePercent: 50 },
      admissionCourseStudents: 0,
      admissionCourseHours: 0,

      authoritiesRectors: 2,
      authoritiesDeans: 0,
      authoritiesSecretaries: 0,

      nonTeachingCategoryA: 0,
      nonTeachingCategoryB: 0,
      infrastructureSqm: 0,
      greenSpaceSqm: 0,

      researchMatrix: {
        cat1: { exclusive: 0, semiExclusive: 0, simple: 0 },
        cat2: { exclusive: 0, semiExclusive: 0, simple: 0 },
        cat34: { exclusive: 0, semiExclusive: 0, simple: 0 },
        cat5: { exclusive: 0, semiExclusive: 0, simple: 0 },
      },
      fellowships: 0,
    };
    setUniversities([...universities, newUni]);
    setSelectedUniId(newId);
  };

  const handleUniversityUpdate = (updatedUni: UniversityData) => {
    setUniversities(prev => prev.map(u => u.id === updatedUni.id ? updatedUni : u));
  };

  const currentUniData = universities.find(u => u.id === selectedUniId) || universities[0];

  // --- CORE POLYNOMIAL ALGORITHM ---
  const calculateResultForUni = (data: UniversityData): CalculationResult => {

    // --- BLOCK 1: ACADEMIC (45%) ---
    let pointsStudentsActivity = 0;
    let pointsStudentsComplexity = 0;
    let totalAdjustedStudents = 0;
    let totalModulesProf = 0;
    let totalModulesAux = 0;

    data.careers.forEach(c => {
      // 2.1.2 Adjusted Students Total
      const adjStudents = (c.freshmanCount * c.retentionRate) + c.reenrolledCount;
      totalAdjustedStudents += adjStudents;

      // Activity Factor (2.1.5 based logic)
      const activityMult = c.subjectsInPlan > 0 ? (c.averageSubjectsPassed / c.subjectsInPlan) : 0;
      pointsStudentsActivity += adjStudents * activityMult;

      // Complexity Factor (2.1.1)
      const weight = DISCIPLINE_WEIGHTS[c.discipline] || 1.0;
      pointsStudentsComplexity += adjStudents * weight;

      // 2.1.8 Module Calculation (Yearly Logic)
      const utilizationFactor = c.subjectsInPlan > 0 ? (c.averageSubjectsPassed / c.subjectsInPlan) : 0;

      const distNew = STUDENT_DISTRIBUTION[c.type].new;
      const distRe = STUDENT_DISTRIBUTION[c.type].reenrolled;

      const distPercentages = Array.from({ length: 5 }).map((_, i) => {
        const pN = distNew[i] || 0;
        const pR = distRe[i] || 0;
        const val = (c.freshmanCount * c.retentionRate * pN) + (c.reenrolledCount * pR);
        return adjStudents > 0 ? val / adjStudents : 0;
      });

      const distributedCounts = calculateDistributedStudents(adjStudents, distPercentages);

      c.yearlyMatrix.forEach((ym, yearIdx) => {
        const studentsInYear = distributedCounts[yearIdx] || 0;

        (['A', 'B', 'C', 'D'] as const).forEach(type => {
          const count = ym[type];
          if (count > 0) {
            const r = RATIOS[type];
            const fullLoadModulesProf = (studentsInYear / r.prof) * count;
            const fullLoadModulesAux = (studentsInYear / r.aux) * count;

            totalModulesProf += fullLoadModulesProf * utilizationFactor;
            totalModulesAux += fullLoadModulesAux * utilizationFactor;
          }
        });
      });
    });

    const pointsGraduates = data.totalGraduates * 5.0;
    const block1RawScore = pointsStudentsActivity + pointsStudentsComplexity + pointsGraduates;
    const totalRequiredModules = totalModulesProf + totalModulesAux;


    // --- BLOCK 2: NORMATIVE (50%) ---
    // 2.1.9 Conversion to Positions (Based on user distribution %)
    const totalModules = totalRequiredModules;
    const exclCount = (totalModules * (data.facultyDistribution.exclusivePercent / 100));
    const semiCount = (totalModules * (data.facultyDistribution.semiExclusivePercent / 100));
    const simpleCount = (totalModules * (data.facultyDistribution.simplePercent / 100));

    const pointsFaculty = (exclCount * 4.0) + (semiCount * 2.0) + (simpleCount * 1.0);

    // 2.2 Admission Courses (Approx 1 module per 40 students for 120h)
    const pointsAdmissionCourse = (data.admissionCourseStudents / 40) * 1.0;

    // Authorities
    const pointsAuthorities = (data.authoritiesRectors * 10) + (data.authoritiesDeans * 8) + (data.authoritiesSecretaries * 6);

    // Non-Teaching & Infra
    const pointsNonTeaching = (data.nonTeachingCategoryA * 2.5) + (data.nonTeachingCategoryB * 1.5);

    // Infra + Green Space
    const greenSpaceAgents = data.greenSpaceSqm / 30000;
    const scoreGreenSpace = greenSpaceAgents * 1.5;
    const pointsInfra = (data.infrastructureSqm * 0.05 * data.regionalCostFactor) + scoreGreenSpace;

    const block2RawScore = (pointsAuthorities + pointsFaculty + pointsAdmissionCourse + pointsNonTeaching + pointsInfra) * data.economiesOfScale;


    // --- BLOCK 3: SCIENCE (5%) ---
    // Research Matrix Calculation
    const calcRow = (row: ResearchMatrixRow, w: any) => (row.exclusive * w.ex) + (row.semiExclusive * w.se) + (row.simple * w.si);

    const scoreCat1 = calcRow(data.researchMatrix.cat1, RESEARCH_WEIGHTS.cat1);
    const scoreCat2 = calcRow(data.researchMatrix.cat2, RESEARCH_WEIGHTS.cat2);
    const scoreCat34 = calcRow(data.researchMatrix.cat34, RESEARCH_WEIGHTS.cat34);
    const scoreCat5 = calcRow(data.researchMatrix.cat5, RESEARCH_WEIGHTS.cat5);

    const pointsResearch = scoreCat1 + scoreCat2 + scoreCat34 + scoreCat5 + (data.fellowships * 0.25);
    const block3RawScore = pointsResearch;


    // --- WEIGHTING & RESULTS ---
    const block1WeightedScore = block1RawScore * weights.weightBlockEducation;
    const block2WeightedScore = block2RawScore * weights.weightBlockNormative;
    const block3WeightedScore = block3RawScore * weights.weightBlockResearch;

    const totalScore = block1WeightedScore + block2WeightedScore + block3WeightedScore;

    const systemTotalAdjusted = weights.totalSystemPoints + totalScore;
    const distributionPercentage = (totalScore / systemTotalAdjusted) * 100;
    const estimatedBudget = (distributionPercentage / 100) * weights.totalSystemBudget;

    const totalHeadcount = data.careers.reduce((acc, c) => acc + (c.freshmanCount + c.reenrolledCount), 0) || 1;
    const costPerStudent = estimatedBudget / totalHeadcount;

    const facultyCount = exclCount + semiCount + simpleCount;
    const facultyStudentRatio = facultyCount / totalHeadcount;

    return {
      pointsStudentsActivity,
      pointsStudentsComplexity,
      pointsGraduates,
      block1RawScore,
      block1WeightedScore,
      totalRequiredModules,

      pointsFaculty,
      pointsAdmissionCourse,
      pointsNonTeaching,
      pointsAuthorities,
      pointsInfra,
      block2RawScore,
      block2WeightedScore,

      pointsResearch,
      block3RawScore,
      block3WeightedScore,

      totalScore,
      estimatedBudget,
      distributionPercentage,
      costPerStudent,
      facultyStudentRatio
    };
  };

  const currentResult = useMemo(() => calculateResultForUni(currentUniData), [currentUniData, weights]);

  useEffect(() => {
    // Sync initial data (re-run logic to populate aggregated fields if needed for display)
  }, []);

  // Initialize dark mode from local storage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-200 ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />

      <main className="flex-1 p-8 overflow-y-auto h-screen scroll-smooth">
        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              {currentView === AppView.DASHBOARD && 'Tablero de Comando (Dashboard)'}
              {currentView === AppView.SIMULATOR && 'Simulador Modelo CIN Oficial'}
              {currentView === AppView.MANUALS && 'Centro de Documentación Técnica'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-2 py-0.5 rounded mr-2">Versión PDF</span>
              Asignación Presupuestaria Universitaria (CIN)
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              )}
            </button>
            <div className="text-right bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 min-w-[200px]">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Institución Activa</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-400 truncate max-w-[250px]">{currentUniData.name}</p>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto pb-12">
          {currentView === AppView.DASHBOARD && (
            <ResultsDashboard
              data={currentUniData}
              result={currentResult}
              weights={weights}
              allUniversities={universities}
              calculator={calculateResultForUni}
            />
          )}

          {currentView === AppView.SIMULATOR && (
            <Simulator
              universities={universities}
              selectedId={selectedUniId}
              weights={weights}
              result={currentResult}
              onUniversityChange={handleUniversityUpdate}
              onSelectUniversity={setSelectedUniId}
              onAddUniversity={handleAddUniversity}
              onWeightsChange={setWeights}
            />
          )}

          {currentView === AppView.MANUALS && (
            <ManualGenerator />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
