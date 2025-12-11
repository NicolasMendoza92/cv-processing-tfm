export interface CVRecord {
  id: string;
  fileName: string;
  uploadDate: string;
  status: "Cargado" | "Procesando..." | "Procesado" | "Error";
  detailsLink: string | null;
  errorMessage?: string;
}

export interface ExperienceItem {
  title: string;
  years: number;
}

export interface EducationItem {
  degree: string;
  year?: number;
}

export interface LanguageItem {
  name: string;
  level: string;
}

export interface CandidateDetails {
  id: string;
  name: string;
  email?: string | null; // Ahora puede ser null o undefined
  phone?: string | null; // Ahora puede ser null o undefined
  lastJob?: string | null;
  lastEducation?: string | null;
  skills: string[];
  languages: LanguageItem[];
  disability?: string | null;
  previousIncarceration?: string | null;
  formalEducationYears?: number | null;
  workExperienceYears?: number | null;
  employabilityScore: number;
  isAptForEmployment?: boolean | null;
  developmentRecommendations: string[]; // Asumo que siempre es un array, incluso si vacío
  cvFileName?: string | null;
  // Añade campos que pueden venir de CandidateRecord si los necesitas:
  summary?: string | null;
  rawText?: string | null;
  topRecommendations: string[];
  lastProcessed: string; // ISO string
  areasForDevelopment?: string[];
  interviewQuestions?: string[] | null;
  createdAt?: string;
  updatedAt?: string;
}
// export interface CandidateDetails {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   lastJob: string;
//   lastEducation: string;
//   skills: string[];
//   languages: LanguageItem[];
//   disability: string;
//   previousIncarceration: string;
//   formalEducationYears: number;
//   workExperienceYears: number;
//   employabilityScore: number;
//   isAptForEmployment: boolean;
//   developmentRecommendations: string[];
//   cvFileName: string;
// }

export interface JobRecommendation {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  compatibility: "Alta" | "Media" | "Baja";
  cluster?: string;
}

export interface JobRecommendationsResponse {
  candidateId: string;
  recommendations: JobRecommendation[];
}

export interface CandidateSummary {
  id: string;
  name: string;
  employability_score: number;
  top_recommendations: string[];
  last_processed: string;
  areas_for_development: string[];
  interview_questions?: string[];
}

export interface ExtractedCVData {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: Array<{
    title: string;
    company: string;
    years: number;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year?: number;
  }>;
  skills: string[];
  languages: LanguageItem[];
  summary?: string;
  raw_text?: string;
}

export interface UploadedFile {
  id: string;
  file: File; // Referencia al archivo original
  name: string;
  size: number;
  status:
    | "uploading"
    | "processing"
    | "ready_for_review"
    | "approved"
    | "error";
  progress: number; // Progreso de la subida real
  errorMessage?: string;
  extractedData?: ExtractedCVData;
  candidateSummary?: CandidateSummary;
}

export interface FeedbackData {
  candidateId: string;
  candidateName: string;
  gotJob: boolean;
  jobTitle?: string;
  hireDate?: string;
  wasRecommended?: boolean | null;
  rejectionReason?: string;
  additionalComments?: string;
  predictionAccuracy: string;
}

export interface ErrorResponse {
  detail: string;
}

export type FileStatus =
  | "pending"
  | "uploading"
  | "processing"
  | "ready_for_review"
  | "approved"
  | "error";
export interface CandidateFile {
  id: string; // ID único para el archivo en el UI (puede ser diferente del ID del CV)
  name: string;
  size: number;
  status: FileStatus;
  progress: number; // 0-100 para el progreso de subida
  errorMessage?: string; // Si hay un error
  extractedData?: ExtractedCVData;
  candidateSummary?: CandidateSummary;
}

export interface CandidateSaveData {
  name: string;
  email?: string;
  phone?: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  languages: LanguageItem[];
  summary?: string;
  rawText?: string;
  employabilityScore: number;
  topRecommendations: string[];
  lastProcessed: string; // ISO String
  areasForDevelopment?: string[];
  interviewQuestions?: string[];
  lastJob?: string;
  lastEducation?: string;
  disability?: string;
  previousIncarceration?: string;
  formalEducationYears?: number;
  workExperienceYears?: number;
  isAptForEmployment?: boolean;
  cvFileName?: string;
}


export interface CandidateRecord {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  experience: any[]; // Json en Prisma, en TS es 'any[]' o 'unknown[]'
  education: any[];
  skills: string[];
  languages: any[];
  summary: string | null;
  rawText: string | null;
  employabilityScore: number;
  topRecommendations: string[];
  lastProcessed: string; // Recibido como ISO string
  areasForDevelopment: string[];
  interviewQuestions: string[] | null;
  lastJob: string | null;
  lastEducation: string | null;
  disability: string | null;
  previousIncarceration: string | null;
  formalEducationYears: number | null;
  workExperienceYears: number | null;
  isAptForEmployment: boolean | null;
  cvFileName: string | null; // El nombre del archivo que subiste
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}