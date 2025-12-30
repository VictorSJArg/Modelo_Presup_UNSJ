
// Data types for the University Input based on CIN Model Argentina

// PDF Page 17: Relaciones estándares de docentes por alumnos
export enum SubjectType {
  A = 'A', // Salud/Campo (Ratio 30/15)
  B = 'B', // Laboratorio/Taller (Ratio 60/25)
  C = 'C', // Teórico-Práctico (Ratio 90/35)
  D = 'D', // Teórico (Ratio 120/60)
}

// Weights from PDF Page 7
export enum Discipline {
  MEDICINA = 'Medicina',
  VETERINARIA = 'Veterinaria',
  ODONTOLOGIA = 'Odontología',
  AGRONOMIA = 'Agronomía',
  FARMACIA_BIOQ = 'Farmacia y Bioquímica',
  INGENIERIA = 'Ingeniería',
  ARQUITECTURA = 'Arquitectura',
  EXACTAS = 'Ciencias Exactas',
  ARTES = 'Artes',
  PSICOLOGIA = 'Psicología',
  SOCIALES = 'Ciencias Sociales',
  ECONOMICAS = 'Ciencias Económicas',
  HUMANIDADES = 'Humanidades',
  DERECHO = 'Derecho',
  TERCIARIOS = 'Terciarios',
  OTROS = 'Otros (Inicial/Medio)'
}

export enum CareerType {
  LARGA = 'Larga (>4 años)',
  CORTA = 'Corta (<=4 años)',
  ARTICULADA = 'Articulada'
}

export const DISCIPLINE_WEIGHTS: Record<Discipline, number> = {
  [Discipline.MEDICINA]: 2.7202,
  [Discipline.VETERINARIA]: 2.4042,
  [Discipline.ODONTOLOGIA]: 2.3223,
  [Discipline.AGRONOMIA]: 2.0438,
  [Discipline.FARMACIA_BIOQ]: 1.9490,
  [Discipline.INGENIERIA]: 1.9236,
  [Discipline.ARQUITECTURA]: 1.7518,
  [Discipline.EXACTAS]: 1.6263,
  [Discipline.ARTES]: 1.4921,
  [Discipline.PSICOLOGIA]: 1.3285,
  [Discipline.SOCIALES]: 1.2551,
  [Discipline.ECONOMICAS]: 1.1937,
  [Discipline.HUMANIDADES]: 1.0137,
  [Discipline.DERECHO]: 1.0000,
  [Discipline.TERCIARIOS]: 0.9000,
  [Discipline.OTROS]: 0.8000,
};

// 2.1.3 Student Distribution percentages
export const STUDENT_DISTRIBUTION = {
  [CareerType.LARGA]: {
    new: [1.0, 0, 0, 0, 0], // 100% in 1st year
    reenrolled: [0.05, 0.35, 0.25, 0.20, 0.15]
  },
  [CareerType.CORTA]: {
    new: [1.0, 0, 0, 0, 0],
    reenrolled: [0, 0, 0.10, 0.55, 0.35] // Adapted from PDF "Carrera corta" table rows
  }
};

export interface YearDetail {
  year: number;
  A: number;
  B: number;
  C: number;
  D: number;
}

// PDF Pages 12-15: Standard Subject Distribution per Discipline (Year by Year)
export const STANDARD_YEARLY_MATRICES: Record<Discipline, YearDetail[]> = {
  [Discipline.AGRONOMIA]: [
    { year: 1, A: 0, B: 4, C: 2, D: 2 },
    { year: 2, A: 1, B: 4, C: 2, D: 1 },
    { year: 3, A: 1, B: 5, C: 3, D: 0 },
    { year: 4, A: 2, B: 4, C: 3, D: 1 },
    { year: 5, A: 3, B: 4, C: 1, D: 0 },
  ],
  [Discipline.INGENIERIA]: [
    { year: 1, A: 0, B: 2, C: 4, D: 2 },
    { year: 2, A: 0, B: 3, C: 4, D: 1 },
    { year: 3, A: 0, B: 5, C: 3, D: 0 },
    { year: 4, A: 0, B: 5, C: 4, D: 0 },
    { year: 5, A: 1, B: 6, C: 2, D: 0 },
  ],
  [Discipline.MEDICINA]: [ // Salud table
    { year: 1, A: 1, B: 2, C: 3, D: 1 },
    { year: 2, A: 1, B: 3, C: 2, D: 1 },
    { year: 3, A: 3, B: 4, C: 0, D: 0 },
    { year: 4, A: 5, B: 0, C: 1, D: 1 },
    { year: 5, A: 6, B: 0, C: 1, D: 0 },
  ],
  [Discipline.ECONOMICAS]: [
    { year: 1, A: 0, B: 1, C: 3, D: 2 },
    { year: 2, A: 0, B: 0, C: 3, D: 3 },
    { year: 3, A: 0, B: 2, C: 4, D: 1 },
    { year: 4, A: 0, B: 2, C: 4, D: 1 },
    { year: 5, A: 3, B: 1, C: 2, D: 1 },
  ],
  [Discipline.ARQUITECTURA]: [
    { year: 1, A: 0, B: 4, C: 2, D: 1 },
    { year: 2, A: 0, B: 4, C: 2, D: 1 },
    { year: 3, A: 0, B: 4, C: 2, D: 1 },
    { year: 4, A: 0, B: 4, C: 2, D: 1 },
    { year: 5, A: 0, B: 4, C: 2, D: 1 },
  ],
  [Discipline.SOCIALES]: [
    { year: 1, A: 0, B: 0, C: 2, D: 5 },
    { year: 2, A: 0, B: 1, C: 2, D: 4 },
    { year: 3, A: 1, B: 1, C: 2, D: 4 },
    { year: 4, A: 1, B: 2, C: 2, D: 3 },
    { year: 5, A: 4, B: 1, C: 1, D: 2 },
  ],
  // Default fallback for others (distributed somewhat evenly)
  [Discipline.VETERINARIA]: [
     { year: 1, A: 1, B: 3, C: 4, D: 2 },
     { year: 2, A: 1, B: 3, C: 3, D: 3 },
     { year: 3, A: 2, B: 3, C: 3, D: 2 },
     { year: 4, A: 2, B: 4, C: 4, D: 1 },
     { year: 5, A: 4, B: 4, C: 2, D: 1 },
  ],
  [Discipline.DERECHO]: [
     { year: 1, A: 0, B: 0, C: 3, D: 3 },
     { year: 2, A: 0, B: 0, C: 4, D: 3 },
     { year: 3, A: 0, B: 0, C: 4, D: 3 },
     { year: 4, A: 0, B: 0, C: 4, D: 3 },
     { year: 5, A: 0, B: 0, C: 5, D: 3 },
  ],
  // ... Simplified defaults for remaining
  [Discipline.ODONTOLOGIA]: [{year:1,A:5,B:0,C:0,D:3},{year:2,A:6,B:0,C:0,D:2},{year:3,A:8,B:0,C:0,D:1},{year:4,A:8,B:0,C:0,D:1},{year:5,A:2,B:0,C:0,D:7}], // Page 14
  [Discipline.FARMACIA_BIOQ]: [{year:1,A:0,B:4,C:4,D:0},{year:2,A:0,B:5,C:3,D:0},{year:3,A:0,B:8,C:0,D:0},{year:4,A:0,B:8,C:0,D:0},{year:5,A:3,B:4,C:2,D:0}],
  [Discipline.EXACTAS]: [{year:1,A:0,B:1,C:4,D:1},{year:2,A:0,B:2,C:3,D:1},{year:3,A:1,B:3,C:3,D:0},{year:4,A:1,B:3,C:2,D:1},{year:5,A:1,B:2,C:2,D:2}],
  [Discipline.ARTES]: [{year:1,A:0,B:2,C:3,D:2},{year:2,A:0,B:4,C:2,D:1},{year:3,A:0,B:4,C:2,D:1},{year:4,A:1,B:4,C:1,D:2},{year:5,A:0,B:5,C:2,D:1}],
  [Discipline.PSICOLOGIA]: [{year:1,A:0,B:0,C:1,D:1},{year:2,A:1,B:1,C:4,D:1},{year:3,A:1,B:1,C:4,D:1},{year:4,A:2,B:2,C:2,D:1},{year:5,A:3,B:1,C:2,D:2}],
  [Discipline.HUMANIDADES]: [{year:1,A:0,B:1,C:1,D:4},{year:2,A:0,B:1,C:2,D:3},{year:3,A:0,B:2,C:1,D:3},{year:4,A:1,B:0,C:2,D:3},{year:5,A:1,B:0,C:2,D:3}],
  [Discipline.TERCIARIOS]: [{year:1,A:0,B:2,C:2,D:2},{year:2,A:0,B:2,C:2,D:2},{year:3,A:0,B:2,C:2,D:2},{year:4,A:0,B:0,C:0,D:0},{year:5,A:0,B:0,C:0,D:0}],
  [Discipline.OTROS]: [{year:1,A:0,B:0,C:0,D:5},{year:2,A:0,B:0,C:0,D:5},{year:3,A:0,B:0,C:0,D:5},{year:4,A:0,B:0,C:0,D:5},{year:5,A:0,B:0,C:0,D:5}],
};

// Research Category Coefficients (Page 28 PDF)
export const RESEARCH_WEIGHTS = {
  cat1: { ex: 1.50, se: 0.60, si: 0.250 },
  cat2: { ex: 1.00, se: 0.40, si: 0.165 },
  cat34: { ex: 0.60, se: 0.24, si: 0.100 },
  cat5: { ex: 0.40, se: 0.16, si: 0.065 },
};

export interface Career {
  id: string;
  name: string;
  discipline: Discipline; 
  type: CareerType;

  // New: Specific Yearly Matrix Distribution
  yearlyMatrix: YearDetail[];

  // 2.1.2 Distribución Estudiantil
  freshmanCount: number; // Nuevos Inscriptos
  retentionRate: number; // Factor Deserción (0.0 to 1.0)
  reenrolledCount: number; // Reinscriptos
  
  // 2.1.5 Alumnos por asignatura
  subjectsInPlan: number; // Total Materias Plan (Sum of A+B+C+D)
  averageSubjectsPassed: number; // Promedio aprobadas (Multiplicador Actividad)

  // Computed internally
  adjustedStudents?: number;
  requiredModulesProf?: number;
  requiredModulesAux?: number;
}

export interface ResearchMatrixRow {
  exclusive: number;
  semiExclusive: number;
  simple: number;
}

export interface ResearchData {
  cat1: ResearchMatrixRow;
  cat2: ResearchMatrixRow;
  cat34: ResearchMatrixRow;
  cat5: ResearchMatrixRow;
}

export interface UniversityData {
  id: string;
  name: string;
  
  // --- TRANSVERSAL ---
  regionalCostFactor: number;
  economiesOfScale: number; // Coeficiente 'a' calculado o seleccionado
  
  // --- BLOCK 1: ACADEMIC (45%) ---
  careers: Career[]; 
  totalGraduates: number; 

  // --- BLOCK 2: NORMATIVE BUDGET (50%) ---
  // Faculty Normative (Resulting from Modules)
  facultyDistribution: {
    exclusivePercent: number;
    semiExclusivePercent: number;
    simplePercent: number;
  };
  
  // Admission Courses (2.2)
  admissionCourseStudents: number;
  admissionCourseHours: number; // Min 120hs

  // Authorities
  authoritiesRectors: number;
  authoritiesDeans: number;
  authoritiesSecretaries: number;
  
  // Non-Teaching
  nonTeachingCategoryA: number; 
  nonTeachingCategoryB: number; 
  
  // Infrastructure
  infrastructureSqm: number; 
  greenSpaceSqm: number;

  // --- BLOCK 3: SCIENCE & TECH (5%) ---
  researchMatrix: ResearchData;
  fellowships: number;
  
  // Aggregates for comparison
  totalAdjustedStudents: number;
}

export interface ModelWeights {
  weightBlockEducation: number;
  weightBlockNormative: number;
  weightBlockResearch: number;
  totalSystemBudget: number;
  totalSystemPoints: number;
}

export interface CalculationResult {
  // Block 1 Breakdown
  pointsStudentsActivity: number;
  pointsStudentsComplexity: number;
  pointsGraduates: number;
  block1RawScore: number;
  block1WeightedScore: number;
  totalRequiredModules: number; // Sum of Prof + Aux modules
  
  // Block 2 Breakdown
  pointsFaculty: number; // Calculated from Modules -> Cargos
  pointsAdmissionCourse: number;
  pointsNonTeaching: number;
  pointsAuthorities: number;
  pointsInfra: number;
  block2RawScore: number;
  block2WeightedScore: number;
  
  // Block 3 Breakdown
  pointsResearch: number;
  block3RawScore: number;
  block3WeightedScore: number;
  
  totalScore: number;
  estimatedBudget: number;
  distributionPercentage: number;
  
  costPerStudent: number;
  facultyStudentRatio: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SIMULATOR = 'SIMULATOR',
  MANUALS = 'MANUALS',
}

export interface ManualContent {
  title: string;
  content: string;
}
