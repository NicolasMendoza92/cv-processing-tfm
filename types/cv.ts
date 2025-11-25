export interface CVRecord {
  id: string
  fileName: string
  uploadDate: string
  status: "Cargado" | "Procesando..." | "Procesado" | "Error"
  detailsLink: string | null
  errorMessage?: string
}

export interface Language {
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
  languages: Language[]
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
  employabilityScore: number
  topRecommendations: string[]
  lastProcessed: string
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
  languages: Language[]
  summary?: string
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
