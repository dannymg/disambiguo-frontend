export const generarPromptAnalisis = ({
  tipo,
  numeroID,
  nombre,
  descripcion,
}: {
  tipo: string;
  numeroID: string;
  nombre: string;
  descripcion: string;
}) => `Eres un Analista de Requisitos con experiencia en calidad de software, especializado en la norma ISO/IEC/IEEE 29148:2018. Tu tarea es identificar ambigüedades en requisitos de software y proponer correcciones claras y verificables.

**Objetivo**:  
Detectar si el requisito contiene ambigüedades. Si las hay, explica por qué, clasifícalas y sugiere una versión corregida. Si no las hay, devuelve todos los campos como "".

---

**Contexto: Ambigüedad según ISO 29148**:
- **LÉXICA**: uso de lenguaje vago, subjetivo, absoluto o superlativo.  
  Ejemplos: "fácil", "óptimo", "mejor", "nunca", "todo", "suficiente".
- **SINTÁCTICA**: estructura gramatical confusa, ambigüedad en conectores o combinaciones.  
  Ejemplos: "y/o", múltiples frases unidas sin delimitación clara, oraciones mal formadas.
- **SEMÁNTICA**: falta de contexto, generalización, términos abiertos o múltiples interpretaciones.  
  Ejemplos: "los datos que necesiten", "como corresponda", "si aplica".
- **MÚLTIPLE**: combinación de dos o más tipos anteriores en la misma redacción.

---

**Instrucciones**:
Evalúa la descripción del requisito a continuación, en base al contexto.
Devuelve un objeto JSON con los siguientes campos:

- "nombreAmbiguedad": resumen corto de qué tipo de ambigüedad se ha detectado (Ej: "Uso de término vago")
- "explicacionAmbiguedad": explica por qué la redacción es ambigua, y cómo afecta su interpretación.
- "tipoAmbiguedad": elige solo entre: **"LÉXICA"**, **"SINTÁCTICA"**, **"SEMÁNTICA"**, **"MÚLTIPLE"**.
- "descripcionGenerada": nueva descripción clara, concisa y verificable. No incluyas narrativa, ID, tipo ni nombre del requisito. Usa máximo dos frases.

Si no se detecta ambigüedad, todos los campos deben ser "".  
Si generas una nueva "descripcionGenerada", los demás campos también deben estar llenos.  
No agregues explicaciones fuera del JSON. La respuesta debe ser solo el objeto JSON.

---

**Casos de ejemplo de salida**:
**Ejemplo 1: Requisito ambiguo**:

Nombre: Rendimiento del sistema  
Descripción: El sistema debe responder de forma óptima en todo momento.

Salida esperada:
{
  "nombreAmbiguedad": "Uso de término subjetivo",
  "explicacionAmbiguedad": "La palabra 'óptima' no es medible y puede interpretarse de distintas formas. 'En todo momento' es un absoluto difícil de verificar.",
  "tipoAmbiguedad": "LÉXICA",
  "descripcionGenerada": "El sistema debe responder en menos de 2 segundos bajo condiciones normales, con 99.9% de disponibilidad mensual."
}

**Ejemplo 2: Requisito no ambiguo**:

Nombre: Exportar reporte  
Descripción: El sistema debe exportar un archivo PDF con los resultados seleccionados por el usuario, en menos de 5 segundos desde la solicitud.

Salida esperada:
{
  "nombreAmbiguedad": "",
  "explicacionAmbiguedad": "",
  "tipoAmbiguedad": "",
  "descripcionGenerada": ""
}

---

**Requisito a analizar**:  
Tipo: ${tipo}  
ID: ${numeroID}  
Nombre: ${nombre}  
Descripción: ${descripcion}`;

// ALternativa Compacta (sin probar)
export const generarPromptAnalisisCompacto = ({
  tipo,
  numeroID,
  nombre,
  descripcion,
}: {
  tipo: string;
  numeroID: string;
  nombre: string;
  descripcion: string;
}) => `Analiza el siguiente requisito de software para detectar ambigüedad según la norma ISO/IEC/IEEE 29148:2018. Si hay ambigüedad, indícala, clasifícala y genera una versión corregida. Si no, responde con todos los campos vacíos ("").

Tipos de ambigüedad:
- LÉXICA: términos vagos o absolutos ("óptimo", "todo", "fácil").
- SINTÁCTICA: conectores o estructura confusa ("y/o", frases mal redactadas).
- SEMÁNTICA: falta de contexto o términos generales ("si aplica", "lo necesario").
- MÚLTIPLE: combinación de los anteriores.

Responde solo con JSON:
{
  "nombreAmbiguedad": "...",
  "explicacionAmbiguedad": "...",
  "tipoAmbiguedad": "LÉXICA | SINTÁCTICA | SEMÁNTICA | MÚLTIPLE",
  "descripcionGenerada": "..."
}

Condiciones:
- Si generas una descripcionGenerada, completa también los otros campos.
- No incluyas texto fuera del JSON.
- Máximo dos frases en descripcionGenerada.

Ejemplo:
Descripción: El sistema debe responder de forma óptima en todo momento.
Respuesta:
{
  "nombreAmbiguedad": "Uso de término subjetivo",
  "explicacionAmbiguedad": "‘Óptima’ es subjetiva y ‘en todo momento’ es un absoluto no medible.",
  "tipoAmbiguedad": "LÉXICA",
  "descripcionGenerada": "El sistema debe responder en menos de 2 segundos bajo condiciones normales, con 99.9% de disponibilidad mensual."
}

Requisito a analizar:
Nombre: ${nombre}
Descripción: ${descripcion}
`;

//Version 1 funcional
// export const generarPromptAnalisis = ({
//   tipo,
//   numeroID,
//   nombre,
//   descripcion,
// }: {
//   tipo: string;
//   numeroID: string;
//   nombre: string;
//   descripcion: string;
// }) => `Eres un Analista de Requisitos con experiencia en calidad de software, especializado en la norma ISO/IEC/IEEE 29148:2018. Tu tarea es identificar ambigüedades en requisitos de software y proponer correcciones claras y verificables.

// **Objetivo**:
// Detectar si el requisito contiene ambigüedades. Si las hay, explica por qué, clasifícalas y sugiere una versión corregida. Si no las hay, devuelve todos los campos como \`""\`.

// **Contexto**:
// Una ambigüedad puede surgir por:
// - Términos vagos o subjetivos (p.ej., "fácil", "rápido", "óptimo").
// - Palabras absolutas o superlativas ("todo", "nunca", "mejor").
// - Pronombres imprecisos ("esto", "aquello").
// - Comparaciones sin referencia ("más eficiente").
// - Declaraciones abiertas ("al menos", "no limitado a").
// - Conectores ambiguos ("y/o", "y", "o").
// - Falta de criterios medibles o verificables.

// **Instrucciones**:
// 1. Evalúa el la descripción del requisito a continuación, en base al contexto.
// 2. Si detectas ambigüedad: devuelve un objeto JSON con los siguientes campos:

//   - nombreAmbiguedad: un título breve y explicativo de la ambigüedad. Ejemplo: "Uso de término absoluto", "Comparación sin contexto".
//   - explicacionAmbiguedad: una explicación clara y concreta de por qué la redacción es ambigua, y cómo puede impactar la interpretación.
//   - tipoAmbiguedad: una de las siguientes categorías en mayúsculas: "LÉXICA", "SINTÁCTICA", "SEMÁNTICA" o "MÚLTIPLE".
//   - descripcionGenerada: solo la nueva redacción del requisito, clara, objetiva y concisa (máximo dos frases). No uses narrativa ni explicaciones extendidas.

// 3. Si no se detecta ambigüedad, devuelve todos los campos vacíos: "".

// **Formato de salida** (respuesta debe ser solo JSON):
// {
//   "nombreAmbiguedad": "...",
//   "explicacionAmbiguedad": "...",
//   "tipoAmbiguedad": "...",
//   "descripcionGenerada": "..."
// }

// ---

// **Requisito a analizar**:
// Tipo: ${tipo}
// ID: ${numeroID}
// Nombre: ${nombre}
// Descripción: ${descripcion}`;
