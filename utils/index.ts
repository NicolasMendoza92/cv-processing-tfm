import { candidateSchema } from "@/schemas";
import {
  CandidateDataExtended,
  CandidateToAnalyzeType, CandidateDetails, CandidateExtractedData
} from "@/types";

export function mapDetailsToCandidateToAnalyze(
  d: CandidateDetails
): import("@/types").CandidateToAnalyzeType {
  return {
    id: d.cvFileName, 
    name: d.name,
    summary: d.lastJob, // o cualquier campo que uses como resumen
    experience: [], // <-- si no tienes experiencia en Details, deja vacío
    education: [], // <-- igual que arriba
    languages: d.languages,
    skills: d.skills,
    gender: d.gender ?? null,
    age: d.age ?? null,
    maritalStatus: d.maritalStatus ?? null,
    birthCountry: d.birthCountry ?? null,
    numLanguages: d.numLanguages ?? null,
    hasCar: d.hasCar ?? null,
    criminalRecord: d.criminalRecord ?? null,
    restrainingOrder: d.restrainingOrder ?? null,
    numChildren: d.numChildren ?? null,
    workDisability: d.workDisability ?? null,
    disabilityFlag: d.disabilityFlag ?? null,
    jobSeeker: d.jobSeeker ?? null,
    weaknesses: d.weaknesses ?? null,
    trainingProfile: d.trainingProfile ?? null,
  };
}

export const transformToCandidateToAnalyze = (
  extendedData: CandidateDataExtended,
  candidateId: string
): CandidateToAnalyzeType => {
  /* 1.  Limpieza TOTAL de nulls en campos que Zod valide como string */
  const clean = {
    ...extendedData,
    name: extendedData.name ?? "",
    email: extendedData.email ?? "",
    phone: extendedData.phone ?? "",
    summary: extendedData.summary ?? "",
    rawText: extendedData.rawText ?? "",
    weaknesses: extendedData.weaknesses ?? "",
    trainingProfile: extendedData.trainingProfile ?? "",
    gender: extendedData.gender ?? "otro",
    birthCountry: extendedData.birthCountry ?? "",
    maritalStatus: extendedData.maritalStatus ?? "otro",
    cvFileName: extendedData.cvFileName ?? "",
    // languages: array, pero sus strings internos también
    languages: (extendedData.languages || []).map((l) => ({
      name: l.name ?? "",
      level: l.level ?? "",
    })),
    experience: (extendedData.experience || []).map((e) => ({
      title: e.title ?? "",
      years: e.years ?? 0,
      company: e.company ?? "",
    })),
    education: (extendedData.education || []).map((e) => ({
      degree: e.degree ?? "",
      year: e.year ?? null,
      institution: e.institution ?? "",
    })),
    skills: extendedData.skills || [],
  };

  /* 2.  Validación con Zod (ahora no fallará) */
  const validatedData = candidateSchema.safeParse({
    employabilityScore: clean.employabilityScore ?? 0,
    lastProcessed: clean.lastProcessed ?? new Date().toISOString(),
    ...clean,
  });
  if (!validatedData.success) {
    throw new Error(
      `Datos inválidos: ${validatedData.error.errors[0].message}`
    );
  }

  /* 3.  Retorno (igual que antes) */
  return {
    id: candidateId,
    name: clean.name,
    summary: clean.summary,
    experience: clean.experience,
    education: clean.education,
    skills: clean.skills,
    languages: clean.languages,
    gender: clean.gender === "h" ? "m" : clean.gender,
    age: clean.age ?? null,
    maritalStatus: clean.maritalStatus,
    birthCountry: clean.birthCountry,
    numLanguages: clean.languages.length,
    hasCar: clean.hasCar ?? null,
    criminalRecord: clean.criminalRecord ?? null,
    restrainingOrder: clean.restrainingOrder ?? null,
    numChildren: clean.numChildren ?? null,
    workDisability: clean.workDisability ?? null,
    disabilityFlag: !!clean.disability || clean.workDisability || false,
    jobSeeker: clean.jobSeeker ?? true,
    weaknesses: clean.weaknesses,
    trainingProfile: clean.trainingProfile,
  };
};

export function mapExtendedToDetails(
  ext: CandidateDataExtended
): CandidateDetails {
  // Último trabajo
  const lastJobItem =
    ext.experience && ext.experience.length > 0
      ? ext.experience[ext.experience.length - 1]
      : null;

  const lastJob = lastJobItem
    ? lastJobItem.title ||
      (lastJobItem.company
        ? `${lastJobItem.title ?? ""} - ${lastJobItem.company}`
        : lastJobItem.title ?? "")
    : "Sin experiencia registrada";

  // Último estudio
  const lastEduItem =
    ext.education && ext.education.length > 0
      ? ext.education[ext.education.length - 1]
      : null;

  const lastEducation = lastEduItem
    ? lastEduItem.degree ||
      (lastEduItem.institution
        ? `${lastEduItem.degree ?? ""} - ${lastEduItem.institution}`
        : lastEduItem.degree ?? "")
    : "Sin formación registrada";

  // Años de experiencia laboral (suma de years)
  const workExperienceYears = (ext.experience || []).reduce(
    (acc, exp) => acc + (exp.years || 0),
    0
  );

  // Años de educación formal (puedes ajustar lógica: aquí cuenta items)
  const formalEducationYears = (ext.education || []).length;

  // Num de idiomas
  const numLanguages = (ext.languages || []).length;

  // Regla de aptitud (puedes cambiarla a lo que use tu modelo)
  const score = ext.employabilityScore ?? 0;
  const isAptForEmployment = score >= 0.5;

  return {
    name: ext.name,
    email: ext.email ?? "",
    phone: ext.phone ?? "",
    lastJob,
    lastEducation,
    skills: ext.skills || [],
    languages: ext.languages || [],
    disability: ext.disability ?? undefined,
    previousIncarceration: ext.previousIncarceration ?? undefined,
    formalEducationYears,
    workExperienceYears,
    employabilityScore: score,
    isAptForEmployment,
    topRecommendations: ext.topRecommendations || [],
    developmentRecommendations: ext.areasForDevelopment || [],
    interviewQuestions: ext.interviewQuestions || [],
    cvFileName: ext.cvFileName ?? "",
    gender: ext.gender,
    age: ext.age,
    maritalStatus: ext.maritalStatus,
    birthCountry: ext.birthCountry,
    numLanguages: numLanguages,
    hasCar: ext.hasCar,
    criminalRecord: ext.criminalRecord,
    restrainingOrder: ext.restrainingOrder,
    numChildren: ext.numChildren,
    workDisability: ext.workDisability,
    disabilityFlag: ext.disabilityFlag,
    jobSeeker: ext.jobSeeker,
    weaknesses: ext.weaknesses,
    trainingProfile: ext.trainingProfile,
  };
}

export function mapCandidateExtractedDataToDetails(
  data: CandidateExtractedData
): CandidateDetails {
  const lastJob = data.experience.length > 0
    ? data.experience[data.experience.length - 1].title
    : 'No especificado';

  const lastEducation = data.education.length > 0
    ? data.education[data.education.length - 1].degree
    : 'No especificado';

  const workExperienceYears = data.experience.reduce((sum, item) => sum + (item.years ?? 0), 0);

  const formalEducationYears = data.education.length > 0
    ? data.education.filter(edu => edu.year !== null && edu.year !== undefined).length 
    : 0;

  const isAptForEmployment = data.employabilityScore > 0.5; 

  return {
    name: data.name,
    email: data.email ?? 'N/A', 
    phone: data.phone ?? 'N/A', 
    lastJob: lastJob,
    lastEducation: lastEducation,
    skills: data.skills,
    languages: data.languages,
    disability: data.disability ?? 'No especificado', 
    previousIncarceration: data.previousIncarceration ?? 'No especificado', 
    formalEducationYears: formalEducationYears,
    workExperienceYears: workExperienceYears,
    employabilityScore: data.employabilityScore,
    isAptForEmployment: isAptForEmployment,
    topRecommendations: data.topRecommendations,
    interviewQuestions: data.interviewQuestions ?? [],
    developmentRecommendations: data.areasForDevelopment,
    cvFileName: data.cvFileName ?? 'Sin archivo CV', 
  };
}

type Gender = "h" | "m" | "otro" | null | undefined;
type MaritalStatus =
  | "soltero"
  | "casado"
  | "divorciado"
  | "viudo"
  | "otro"
  | null
  | undefined;

export function getMaritalStatusByGender(
  maritalStatus?: MaritalStatus,
  gender?: Gender
): string {
  if (!maritalStatus || maritalStatus === "otro") return "otro";

  const isMale = gender === "h";
  const isFemale = gender === "m";

  if (!isMale && !isFemale) return maritalStatus;

  const map: Record<
    Exclude<MaritalStatus, null | undefined | "otro">,
    { m: string; f: string }
  > = {
    soltero: { m: "soltero", f: "soltera" },
    casado: { m: "casado", f: "casada" },
    divorciado: { m: "divorciado", f: "divorciada" },
    viudo: { m: "viudo", f: "viuda" },
  };

  return isMale ? map[maritalStatus].m : map[maritalStatus].f;
}

export function getGender(gender?: Gender): string {
  switch (gender) {
    case "h":
      return "hombre";
    case "m":
      return "mujer";
    default:
      return "otro";
  }
}

export function getYesNo(value?: boolean | null): string {
  if (value === true) return "Sí";
  if (value === false) return "No";
  return "—";
}

  export const getScoreColor = (score: number) => {
    if (score >= 0.70) return "text-green-600"
    if (score >= 0.50) return "text-amber-600"
    return "text-red-600"
  }

  


