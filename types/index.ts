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
  topRecomendations: string[];
  developmentRecommendations: string[];
  interviewQuestions: string[]; 
  cvFileName: string;
}


export interface CandidateAnalysisResponse {
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

export type FileStatus =
  | "pending"
  | "uploading"
  | "processing"
  | "ready_for_review"
  | "approved"
  | "error";
  

export interface UploadedFile {
  id: string;
  file: File; 
  name: string;
  size: number;
  status:FileStatus;
  progress: number; 
  errorMessage?: string;
  extractedData?: ExtractedCVData;
  candidateAnalysis?: CandidateAnalysisResponse;
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

export interface CandidateFile {
  id: string; 
  name: string;
  size: number;
  status: FileStatus;
  progress: number; 
  errorMessage?: string; 
  extractedData?: ExtractedCVData;
  candidateAnalysis?: CandidateAnalysisResponse;
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
  lastProcessed: string; 
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
  experience: any[]; 
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