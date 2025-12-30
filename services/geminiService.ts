// services/geminiService.ts
// Versión sin llamadas a Google Gemini (todo local)

export type ManualType = "user_manual" | "technical_glossary" | "methodology";

export interface ManualContent {
  title: string;
  content: string;
}

export async function generateManualContent(
  type: ManualType,
  context?: any // por si más adelante querés pasar parámetros
): Promise<ManualContent> {
  switch (type) {
    case "user_manual":
      return {
        title: "Manual de Usuario Integral",
        content: `
Este manual detalla el funcionamiento del "Simulador de Presupuesto Universitario - Modelo CIN".

### 1. Panel de Control (Dashboard)
El tablero principal ofrece una visión inmediata de la situación financiera y académica de la institución calculada según el modelo.
- **Presupuesto Estimado**: Monto anual que le correspondería a la universidad basado en su participación relativa ('share') en el sistema.
- **Score Polinómico**: Puntaje total normalizado que combina las tres dimensiones (Educación, Normativa, Investigación).
- **Costo por Alumno**: Indicador de eficiencia (Presupuesto / Total Alumnos).
- **Gráficas**:
  - *Estructura de Bloques*: Muestra qué % del puntaje proviene de lo Académico (B1), Plantas/Normativo (B2) o Investigación (B3).
  - *Desglose de Varibles*: Detalle fino de puntos por categoría (ej. Docentes, Alumnos, Infraestructura).
- **Comparativa**: Tabla y gráficos para contrastar la institución actual con otras del sistema simulado.

### 2. Simulador y Carga de Datos
Esta es la herramienta central ("Simulador Modelo CIN Oficial"). Aquí se parametrizan las variables que alimentan el algoritmo.

#### A. Gestión de Carreras (Corazón del Modelo)
Las carreras definen la demanda educativa y generan los "Módulos Docentes" necesarios.
- **Agregar Carrera**: Seleccione Disciplina (Medicina, Ingeniería, etc.) y Tipo.
- **Matriz Anual y Distribución Estudiantil**:
  El sistema distribuye atomáticamente los alumnos ingresados ("Alum. Ajust.") en los 5 años de la carrera.
  
  **¿Cómo se calculan los 'Alumnos (Calc)'?**
   Para cada año, se aplica la fórmula:
   \`AlumnosAño[i] = (Nuevos * Retención * %Dist_Nuevos[i]) + (Reinscriptos * %Dist_Reinscriptos[i])\`
   
   *Nota: El sistema aplica un redondeo inteligente para asegurar que la suma de los 5 años sea exactamente igual al total de alumnos ajustados.*

- **Tipos de Materia (Matriz)**:
  - *Tipos de Materia*: A (Salud/Campo), B (Lab), C (Teórico-Práctico), D (Teórico).
  - *Distribución*: Puede editar cuántas materias de cada tipo hay en cada año del plan.
- **Alumnos**: Ingrese Ingresantes (Nuevos), Tasa de Retención y Reinscriptos. El sistema distribuye estos alumnos en los años según curvas estándar.

#### B. Bloque Normativo (Plantas)
- **Conversión de Módulos**: El Bloque 1 calcula cuántos módulos docentes se necesitan. En esta sección, Ud. define qué estructura de cargos desea para cubrir esos módulos (% Exclusiva / Semi / Simple).
- **Autoridades**: Cargue la cantidad de Rectores, Decanos y Secretarios.
- **No Docentes**: Personal de apoyo (Categorías A y B).
- **Infraestructura**: Metros cuadrados edificados y espacios verdes (impactan en puntos de mantenimiento).

#### C. Bloque Investigación
- Cargue la matriz de investigadores según su categoría (1 a 5) y dedicación.
- Incluya becarios de investigación.

#### D. Parámetros Globales (Configuración)
- **Presupuesto Sistema**: Monto total a repartir entre TODAS las universidades (Variable exógena).
- **Puntos Base Sistema**: La suma de puntos del resto del sistema universitario (para calcular la participación relativa).

### 3. Checklist: Datos de Entrada para Nueva Universidad
Para cargar una nueva institución desde cero, asegúrese de contar con la siguiente información:

#### A. Académico (Por cada Carrera)
- [ ] **Nombre de la Carrera**
- [ ] **Disciplina**: Determina el coeficiente de complejidad (ej. Medicina > Abogacía).
- [ ] **Tipo**: Larga (>4 años) o Corta (<=4 años). Define la curva de retención teórica.
- [ ] **Cantidad de Alumnos**:
    - Nuevos Inscriptos (Año corriente).
    - Reinscriptos (Total del padrón activo).
- [ ] **Tasa de Retención Real**: Porcentaje (0.0 a 1.0) de alumnos que permanecen de un año a otro.
- [ ] **Matriz de Asignaturas**: Cantidad de materias Tipo A, B, C y D por año del plan de estudios.

#### B. Bloque Normativo (Estructura)
- [ ] **Docentes**: Porcentaje deseado de Cargos Exclusivos, Semi-Exclusivos y Simples (debe sumar 100%).
- [ ] **Autoridades**: Cantidad de Rectores, Decanos y Secretarios.
- [ ] **No Docentes**: Cantidad de agentes Categoría A (Superior) y Categoría B (Operativo/Administrativo).
- [ ] **Infraestructura**:
    - Metros Cuadrados Educativos (Aulas, laboratorios, oficinas).
    - Metros Cuadrados de Espacios Verdes (Parques, campos deportivos).
- [ ] **Cursos de Ingreso**: Cantidad de alumnos y horas cátedra totales destinadas.

#### C. Bloque Investigación
- [ ] **Matriz de Investigadores**: Cantidad de docentes categorizados (I, II, III, IV, V) desagregados por dedicación (Ex, Semi, Simple).
- [ ] **Becarios**: Cantidad total de becarios de investigación.

`
      };

    case "technical_glossary":
      return {
        title: "Glosario Técnico y Definiciones",
        content: `
Definiciones de las variables y conceptos claves del algoritmo CIN implementado:

### Conceptos Generales
- **Participación (Share)**: Porcentaje del presupuesto total del sistema que le corresponde a la universidad. Se calcula como: *(Puntos Propis / Puntos Totales Sistema)*.
- **Alumno Ajustado**: Métricas de alumnos que consideran la deserción y reinscripción. Base de cálculo para bloques académicos.

### Variables Académicas
- **Tipos de Asignatura (Ratios Docente/Alumno)**:
  - **Tipo A (Salud/Campo)**: Requiere 1 Profesor cada 30 alumnos y 1 Auxiliar cada 15. (Muy intensivo).
  - **Tipo B (Lab/Taller)**: 1 Prof / 60 alum, 1 Aux / 25 alum.
  - **Tipo C (Teórico-Práctico)**: 1 Prof / 90 alum, 1 Aux / 35 alum.
  - **Tipo D (Teórico)**: 1 Prof / 120 alum, 1 Aux / 60 alum. (Poco intensivo).
- **Factor de Utilización**: Coeficiente que ajusta la necesidad docente según el rendimiento real de los alumnos (Materias Aprobadas / Materias del Plan).
- **Complejidad (Disciplina)**: Ponderador aplicado al alumno según la carrera (ej. Medicina tiene peso 2.72, Derecho 1.00).

### Variables de Planta (Normativo)
- **Módulo Docente**: Unidad de medida de esfuerzo académico. 1 Módulo ≈ 10 horas reloj de dedicación frente a curso (teórico).
- **Economías de Escala**: Factor que ajusta los costos fijos (autoridades, infra) según el tamaño de la institución.

### Categorías de Investigación
- **Categoría I-V**: Clasificación de docentes investigadores según el programa de incentivos.
- **Ponderación**: Un investigador Cat I Exclusivo suma 1.5 pts, mientras que un Cat V Simple suma 0.065 pts.
`
      };

    case "methodology":
      return {
        title: "Metodología de Cálculo (Algoritmo CIN)",
        content: `
El modelo asigna un "Puntaje Polinómico" a la universidad, el cual determina su porción del presupuesto. Este puntaje se compone de 3 Bloques:

### Bloque 1: Educación y Calidad (Peso: 45%)
Se enfoca en la demanda educativa y la complejidad.
1. **Puntos por Actividad**: *Alumnos Ajustados × Factor Actividad*.
2. **Puntos por Complejidad**: *Alumnos Ajustados × Peso Disciplinar* (ej. Ingeniería = 1.92).
3. **Puntos por Egresados**: *Cantidad Egresados × 5.0*.
4. **Cálculo de Insumo (Módulos)**: Se calcula la "Demanda de Módulos Docentes" proyectando la matrícula en la matriz de asignaturas (A, B, C, D) año por año. Este valor NO suma puntos directo aquí, sino que **alimenta al Bloque 2**.

### Bloque 2: Presupuesto Normativo (Peso: 50%)
Calcula la planta ideal necesaria para sostener la actividad del Bloque 1 y la estructura.
1. **Planta Docente**:
   - Toma los *Módulos Requeridos* del B1.
   - Los convierte a Cargos (Exclusiva/Semi/Simple) según la distribución definida por el usuario.
   - Asigna puntos: Exclusiva (4 pts), Semi (2 pts), Simple (1 pt).
2. **Autoridades**: Suma fija por cargo (Rector=10, Decano=8, Secretario=6).
3. **No Docentes**: Puntos por personal de apoyo (Cat A=2.5, Cat B=1.5).
4. **Infraestructura**: Puntos por m² construidos y espacios verdes.

### Bloque 3: Ciencia y Técnica (Peso: 5%)
Fomenta la investigación.
- Suma ponderada de la matriz de investigadores (Categoría x Dedicación).
- Adicional por Becarios.

### Distribución Final
El objetivo último del modelo es determinar qué porción de la torta presupuestaria le corresponde a cada institución.

1. **Score Propio (Puntaje Polinómico Total)**
   Representa el "mérito absoluto" de la universidad y es el resultado de consolidar los puntajes obtenidos en cada dimensión (Bloques), ponderados por la importancia política que el CIN asigna a cada área.
   - **Origen de los Datos**:
     - *B1 (Puntos Académicos)*: Suma de puntos por Alumnos, Complejidad y Egresados.
     - *B2 (Puntos Normativos)*: Suma de puntos por Autoridades, Planta Docente/No Docente e Infraestructura.
     - *B3 (Puntos Investigación)*: Suma de puntos por Investigadores y Becarios.
   - **Cálculo Matemático**: Se multiplica cada puntaje bruto por su peso específico:
     Score Propio = (Puntos_B1 × 0.45) + (Puntos_B2 × 0.50) + (Puntos_B3 × 0.05)
   - *Interpretación*: Un Score Propio alto indica una universidad grande, compleja y con fuerte estructura de investigación. Este valor es el que luego compite contra el resto del sistema.

2. **Score Resto del Sistema (Contexto Competitivo)**
   Es la sumatoria de los *Scores Propios* de todas las otras universidades nacionales (excluyendo la propia).
   - **¿De dónde sale?**: Es un dato estadístico provisto anualmente por la Secretaría de Políticas Universitarias (SPU) o el CIN. Se calcula sumando (B1, B2, B3) de cada una de las otras 56+ universidades.
   - **Dinámica**: Funciona como la "vara" con la que se mide el desempeño. Si el resto del sistema crece (abren nuevas carreras, mejoran sus indicadores), este número aumenta.
   - **Efecto Dilución**: Si el *Resto del Sistema* crece más rápido que la universidad propia, la participación de esta última caerá, aunque sus indicadores internos hayan mejorado.

3. **Participación (Share del Sistema)**
   Determina el peso relativo de la universidad frente al *Sistema Universitario Nacional (CIN)* en su conjunto.
   - **Formula**: Participación = Score Propio / (Score Propio + Score Resto del Sistema)
   - **Interpretación**: Es un "juego de suma cero" en términos porcentuales. La torta es el 100%, y cada punto adicional que gana una universidad, se lo "roba" fraccionalmente a las demás si el presupuesto es fijo.

4. **Presupuesto Anual (Monto Final)**
   Es la asignación monetaria efectiva que recibirá la universidad para cubrir sus gastos corrientes (principalmente salarios docentes/nodocentes y gastos de funcionamiento).
   - **Mecanismo de Asignación**: Una vez calculada la *Participación*, se aplica ese porcentaje directamente sobre la masa de fondos disponibles.
   - **Formula**: Presupuesto = Participación × Presupuesto Total Disponible
   - **Variable Exógena**: El *Presupuesto Total Disponible* es definido externamente por el Congreso de la Nación (Ley de Presupuesto). El modelo CIN es una herramienta de distribución (reparto), no de definición de necesidades financieras absolutas. Si el presupuesto total baja, a todos les baja proporcionalmente su cuota.

   ***

   ### RESUMEN: FÓRMULA DE DISTRIBUCIÓN FINAL
   
   Presupuesto Final = [Score Propio / (Score Propio + Score Resto del Sistema)] × Presupuesto Total Disponible

### Anexo: Tablas de Distribución Estudiantil (Modelo CIN)
Las curvas de distribución definen cómo se dispersan los alumnos nuevos y reinscriptos a lo largo del plan de estudios.

**Carreras Largas (>4 años)**
| Año | % Nuevos | % Reinscriptos |
|-----|----------|----------------|
| 1°  | 100%     | 5%             |
| 2°  | 0%       | 35%            |
| 3°  | 0%       | 25%            |
| 4°  | 0%       | 20%            |
| 5°  | 0%       | 15%            |

**Carreras Cortas (<=4 años)**
*Nota: Observe que en el modelo estándar, el 2° año no recibe reinscriptos, concentrándose en 4° y 5° año.*
| Año | % Nuevos | % Reinscriptos |
|-----|----------|----------------|
| 1°  | 100%     | 0%             |
| 2°  | 0%       | 0%             |
| 3°  | 0%       | 10%            |
| 4°  | 0%       | 55%            |
| 5°  | 0%       | 35%            |
`
      };

    default:
      return {
        title: "Seleccione un manual",
        content: "Haga clic en el menú lateral para ver la documentación detallada."
      };
  }
}
