export interface CVRecord {
  id: string
  fileName: string
  uploadDate: string
  status: "Cargado" | "Procesando..." | "Procesado" | "Error"
  detailsLink: string | null
  errorMessage?: string
}

export interface ExperienceItem {
  title: string
  years: number
}

export interface EducationItem {
  degree: string
  year?: number
}

export interface LanguageItem {
  name: string
  level: string
}

export interface CandidateDetails {
  id: string
  name: string
  email: string
  phone: string
  lastJob: string
  lastEducation: string
  skills: string[]
  languages: LanguageItem[]
  disability: string
  previousIncarceration: string
  formalEducationYears: number
  workExperienceYears: number
  employabilityScore: number
  isAptForEmployment: boolean
  developmentRecommendations: string[]
  cvFileName: string
}

export interface JobRecommendation {
  id: string
  title: string
  description: string
  requiredSkills: string[]
  compatibility: "Alta" | "Media" | "Baja"
  cluster?: string
}

export interface JobRecommendationsResponse {
  candidateId: string
  recommendations: JobRecommendation[]
}

export interface CandidateSummary {
  id: string
  name: string
  employability_score: number
  top_recommendations: string[]
  last_processed: string
  areas_for_development: string[]
  interview_questions?: string[]
}

export interface ExtractedCVData {
  id: string
  name: string
  email: string
  phone: string
  experience: Array<{
    title: string
    company: string
    years: number
  }>
  education: Array<{
    degree: string
    institution: string
    year?: number
  }>
  skills: string[]
  languages: LanguageItem[]
  summary?: string
}


export interface UploadedFile {
  id: string
  file: File // Referencia al archivo original
  name: string
  size: number
  status: "uploading" | "processing" | "ready_for_review" | "approved" | "error"
  progress: number // Progreso de la subida real
  errorMessage?: string
  extractedData?: ExtractedCVData // Datos extraídos para revisión
  candidateSummary?: CandidateSummary // Resumen final después de aprobación
}

export interface FeedbackData {
  candidateId: string
  candidateName: string
  gotJob: boolean
  jobTitle?: string
  hireDate?: string
  wasRecommended?: boolean | null
  rejectionReason?: string
  additionalComments?: string
  predictionAccuracy: string
}

export interface ErrorResponse {
  detail: string
}
