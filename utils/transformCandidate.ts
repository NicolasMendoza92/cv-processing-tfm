import { candidateSchema } from "@/schemas";
import { CandidateDataExtended, CandidateDetails, CandidateToAnalyzeType } from "@/types";

export const transformToCandidateToAnalyze = (
  extendedData: CandidateDataExtended,
  candidateId: string
): CandidateToAnalyzeType => {
  /* 1.  Limpieza TOTAL de nulls en campos que Zod valide como string */
  const clean = {
    ...extendedData,
    name: extendedData.name ?? '',
    email: extendedData.email ?? '',
    phone: extendedData.phone ?? '',
    summary: extendedData.summary ?? '',
    rawText: extendedData.rawText ?? '',
    weaknesses: extendedData.weaknesses ?? '',
    trainingProfile: extendedData.trainingProfile ?? '',
    gender: extendedData.gender ?? 'otro',
    birthCountry: extendedData.birthCountry ?? '',
    maritalStatus: extendedData.maritalStatus ?? 'otro',
    cvFileName: extendedData.cvFileName ?? '',
    // languages: array, pero sus strings internos también
    languages: (extendedData.languages || []).map(l => ({
      name: l.name ?? '',
      level: l.level ?? '',
    })),
    experience: (extendedData.experience || []).map(e => ({
      title: e.title ?? '',
      years: e.years ?? 0,
      company: e.company ?? '',
    })),
    education: (extendedData.education || []).map(e => ({
      degree: e.degree ?? '',
      year: e.year ?? null,
      institution: e.institution ?? '',
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
    throw new Error(`Datos inválidos: ${validatedData.error.errors[0].message}`);
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
    gender: clean.gender === 'h' ? 'm' : clean.gender,
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

export function mapExtendedToDetails(ext: CandidateDataExtended): CandidateDetails {
  // Último trabajo
  const lastJobItem = ext.experience && ext.experience.length > 0
    ? ext.experience[ext.experience.length - 1]
    : null;

  const lastJob =
    lastJobItem
      ? lastJobItem.title ||
        (lastJobItem.company
          ? `${lastJobItem.title ?? ""} - ${lastJobItem.company}`
          : lastJobItem.title ?? "")
      : "Sin experiencia registrada";

  // Último estudio
  const lastEduItem = ext.education && ext.education.length > 0
    ? ext.education[ext.education.length - 1]
    : null;

  const lastEducation =
    lastEduItem
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
    topRecomendations: ext.topRecommendations || [],
    developmentRecommendations: ext.areasForDevelopment || [],
    interviewQuestions: ext.interviewQuestions || [],
    cvFileName: ext.cvFileName ?? "",
  };
}