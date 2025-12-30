export interface ErrorResponse {
  detail: string;
}
export interface ExperienceItem {
  title: string;
  years?: number | null;
  company?: string | null;
}

export interface EducationItem {
  degree: string;
  year?: number | null;
  institution?: string | null;
}

export interface LanguageItem {
  name: string;
  level: string | null;
}
// Tipado despues del PNL 1er microservicio
export interface ExtractedCVData {
  name: string;
  email: string;
  phone: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  languages: LanguageItem[];
  summary?: string;
  raw_text?: string;
}

export type FileStatus =
  | "pending"
  | "uploading"
  | "processing"
  | "ready_for_review"
  | "approved"
  | "saved"
  | "error";

export interface EmployabilityResults {
  score: number;
  isApt: boolean;
  developmentAreas: string[];
}

// Tipado despues del analisis del 2do microservicio (empleabilidad)
export interface CandidateAnalysisResponse {
  name: string;
  employability_score: number;
  top_recommendations: string[];
  last_processed: string;
  areas_for_development: string[];
  interview_questions?: string[];
}
export interface CandidateDataExtended {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  experience: ExperienceItem[];
  education: EducationItem[];
  languages: LanguageItem[];
  skills: string[];
  disability?: string | null;
  previousIncarceration?: string | null;
  summary?: string | null;
  rawText?: string | null;
  gender?: "h" | "m" | "otro" | null;
  age?: number | null;
  maritalStatus?: "soltero" | "casado" | "divorciado" | "viudo" | "otro" | null;
  birthCountry?: string | null;
  numLanguages?: number | null;
  hasCar?: boolean | null;
  criminalRecord?: boolean | null;
  restrainingOrder?: boolean | null;
  numChildren?: number | null;
  workDisability?: boolean | null;
  disabilityFlag?: boolean | null;
  jobSeeker?: boolean | null;
  weaknesses?: string | null;
  trainingProfile?: string | null;
  cvFileName?: string;
  createdAt: string;
  updatedAt: string;
  employabilityScore?: number;
  topRecommendations: string[];
  lastProcessed?: string;
  areasForDevelopment?: string[];
  interviewQuestions?: string[];
}
export interface CandidateData {
  id: string;
  cvFileName: string;
  uploadDate: string;
  status: FileStatus;
  errorMessage?: string;
  extractedData?: ExtractedCVData;
  employabilityResults?: EmployabilityResults;
  extendedData?: CandidateDataExtended;
  feedbackStatus?: "sent" | "not_sent";
  candidateAnalysis?: CandidateAnalysisResponse;
}

export interface CandidateDetails {
  name: string;
  email: string;
  phone: string;
  lastJob: string;
  lastEducation: string;
  skills: string[];
  languages: LanguageItem[];
  disability?: string;
  previousIncarceration?: string;
  formalEducationYears: number;
  workExperienceYears: number;
  employabilityScore: number;
  isAptForEmployment: boolean;
  topRecommendations: string[];
  developmentRecommendations: string[];
  interviewQuestions: string[];
  cvFileName: string;
  gender?: "h" | "m" | "otro" | null;
  age?: number | null;
  maritalStatus?: "soltero" | "casado" | "divorciado" | "viudo" | "otro" | null;
  birthCountry?: string | null;
  numLanguages?: number | null;
  hasCar?: boolean | null;
  criminalRecord?: boolean | null;
  restrainingOrder?: boolean | null;
  numChildren?: number | null;
  workDisability?: boolean | null;
  disabilityFlag?: boolean | null;
  jobSeeker?: boolean | null;
  weaknesses?: string | null;
  trainingProfile?: string | null;
}

export interface CandidateSummarizeResponse {
  summary?: string;
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

export interface CandidateToAnalyzeType {
  id: string;
  name: string;
  summary: string | null;
  experience: ExperienceItem[];
  education: EducationItem[];
  languages: LanguageItem[];
  skills: string[];
  gender?: "h" | "m" | "otro" | null;
  age?: number | null;
  maritalStatus?: "soltero" | "casado" | "divorciado" | "viudo" | "otro" | null;
  birthCountry?: string | null;
  numLanguages?: number | null;
  hasCar?: boolean | null;
  criminalRecord?: boolean | null;
  restrainingOrder?: boolean | null;
  numChildren?: number | null;
  workDisability?: boolean | null;
  disabilityFlag?: boolean | null;
  jobSeeker?: boolean | null;
  weaknesses?: string | null;
  trainingProfile?: string | null;
}

export interface CandidateExtractedData {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  languages: LanguageItem[];
  summary?: string | null;
  rawText?: string | null;
  disability?: string | null;
  previousIncarceration?: string | null;
  employabilityScore: number;
  topRecommendations: string[];
  lastProcessed: string;
  areasForDevelopment: string[];
  interviewQuestions: string[];
  cvFileName?: string | null;
  createdAt: string;
  updatedAt: string;
}


// USADO EN history.tsx y cvServices.ts
export interface CVRecord {
  id: string;
  cvFileName: string | null;
  uploadDate: string;
  status: "Procesado" | "Error";
  detailsLink: string | null;
  errorMessage?: string;
}
export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  status: FileStatus;
  progress: number;
  errorMessage?: string;
  extractedData?: ExtractedCVData;
  candidateAnalysis?: CandidateAnalysisResponse;
  isSaved?: boolean;
}

// TIPOS PARA LA PAGINA OFERTAS
// export type Categoria =
//   | "Desarrollo"
//   | "Disenio"
//   | "Marketing"
//   | "Ventas"
//   | "Admin"
//   | "Otros";

export interface JobOffer {
  id: string;
  puesto: string;
  categoria?: string;
  empresa?: string;
  descripcion?: string;
  activo: boolean;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  createdAt: Date;
}
export interface JobOfferFormData {
  puesto?: string;
  categoria?: string;
  empresa?: string;
  descripcion?: string;
  activo: boolean;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
}

export interface ExcelRowData {
  puesto: string;
  categoria?: string;
  empresa?: string;
  descripcion?: string;
  // activo: string | boolean
  fecha_inicio: string;
  fecha_fin: string;
}


// OFERTAS Y MATHCER 

export interface OfferMatchSummary {
  totalOffers: number;
  matchedOffers: number;
  bestMatchScore: number; // 0-1
}

// Oferta individual ya mapeada
export interface MatchedOffer {
  id: string;
  title: string;
  company: string;
  matchScore: number; // 0-1
  reasons: string[];
}

// Respuesta completa de la acción
export interface OfferMatchResponse {
  summary?: OfferMatchSummary;
  offers?: MatchedOffer[];
}
export interface OfferInput {
  id: string;
  puesto: string;
  categoria: string;
  descripcion: string;
}

export interface CandidateMatchSummary {
  totalCandidates: number;
  matchedCandidates: number;
  bestMatchScore: number; // 0-1
}

export interface MatchedCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  currentPosition: string;
  matchScore: number; // 0-1
  reasons: string[];
}

export interface CandidateMatchResponse {
  summary: CandidateMatchSummary;
  candidates: MatchedCandidate[];
}