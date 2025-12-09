import type { CVRecord, CandidateDetails, JobRecommendationsResponse, CandidateSummary, ExtractedCVData, ErrorResponse } from "@/types/cv"
import cvsData from "@/api_mocks/cvs-status.json"
import candidateData001 from "@/api_mocks/mocked_candidate_details_cv_001.json"
import candidateData002 from "@/api_mocks/mocked_candidate_details_cv_002.json"
import candidateData003 from "@/api_mocks/mocked_candidate_details_cv_003.json"
import candidateData005 from "@/api_mocks/mocked_candidate_details_cv_005.json"
import jobRecommendations001 from "@/api_mocks/mocked_job_recommendations_cv_001.json"
import jobRecommendations002 from "@/api_mocks/mocked_job_recommendations_cv_002.json"
import jobRecommendations003 from "@/api_mocks/mocked_job_recommendations_cv_003.json"
import jobRecommendations005 from "@/api_mocks/mocked_job_recommendations_cv_005.json"
import candidatesSummary from "@/api_mocks/mocked_candidates.json"


const API_BASE_URL = "http://127.0.0.1:8000"

const candidateMocks: Record<string, CandidateDetails> = {
  cv_001: candidateData001 as CandidateDetails,
  cv_002: candidateData002 as CandidateDetails,
  cv_003: candidateData003 as CandidateDetails,
  cv_005: candidateData005 as CandidateDetails,
}

const jobRecommendationsMocks: Record<string, JobRecommendationsResponse> = {
  cv_001: jobRecommendations001 as JobRecommendationsResponse,
  cv_002: jobRecommendations002 as JobRecommendationsResponse,
  cv_003: jobRecommendations003 as JobRecommendationsResponse,
  cv_005: jobRecommendations005 as JobRecommendationsResponse,
}

export async function getCVsStatus(): Promise<CVRecord[]> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 800))

  return cvsData as CVRecord[]
}

export async function getCVById(id: string): Promise<CVRecord | null> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const cv = cvsData.find((cv) => cv.id === id)
  return cv ? (cv as CVRecord) : null
}

export async function getCandidateDetails(id: string): Promise<CandidateDetails | null> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 700))

  const candidateData = candidateMocks[id]

  if (candidateData) {
    return candidateData
  } else {
    console.error(`[v0] No mock data found for candidate ID: ${id}`)
    return null
  }
}

export async function getJobRecommendations(candidateId: string): Promise<JobRecommendationsResponse | null> {
  // Simulate API latency (slightly longer for ML model processing)
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 1000))

  const recommendations = jobRecommendationsMocks[candidateId]

  if (recommendations) {
    return recommendations
  } else {
    console.error(`[v0] No job recommendations found for candidate ID: ${candidateId}`)
    return null
  }
}

export async function getExtractedData(id: string): Promise<CandidateDetails | null> {
  // Simulate API latency for PLN processing
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 600))

  const candidateData = candidateMocks[id]

  if (candidateData) {
    return candidateData
  } else {
    console.error(`[v0] No extracted data found for CV ID: ${id}`)
    return null
  }
}

export async function getCandidatesSummary(): Promise<CandidateSummary[]> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 700))

  return candidatesSummary as CandidateSummary[]
}

export async function saveCandidate(candidateData: CandidateDetails): Promise<boolean> {
  // Simulate API call to save candidate
  await new Promise((resolve) => setTimeout(resolve, 500))

  console.log("[v0] Candidate saved (mocked):", candidateData.id)
  return true
}

export async function deleteCandidate(id: string): Promise<boolean> {
  // Simulate API call to delete candidate
  await new Promise((resolve) => setTimeout(resolve, 400))

  console.log("[v0] Candidate deleted (mocked):", id)
  return true
}

export async function sendFeedback(
  candidateId: string,
  feedbackData: any,
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[v0] Simulando envío de feedback para ${candidateId}:`, feedbackData)
      resolve({
        success: true,
        message: "Feedback recibido exitosamente. ¡Gracias por contribuir a la mejora del modelo!",
      })
    }, 500)
  })
}

// --- Server Action para extraer datos del CV ---
export async function extractCVDataAction(file: File): Promise<{
  success: boolean
  data?: ExtractedCVData
  error?: string
}> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/extract-cv-data`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      console.error("Backend error during CV extraction:", errorData.detail)
      return { success: false, error: errorData.detail }
    }

    const data: ExtractedCVData = await response.json()
    console.log("Extracted CV Data from backend:", data)


    return { success: true, data: data }
  } catch (e: any) {
    console.error("Network or unexpected error during CV extraction:", e)
    return { success: false, error: e.message || "Error de red o inesperado." }
  }
}

// --- Server Action para procesar los datos extraídos del candidato ---
export async function processCandidateDataAction(
  candidateData: ExtractedCVData,
): Promise<{ success: boolean; data?: CandidateSummary; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/process-candidate-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(candidateData),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      console.error("Backend error during candidate data processing:", errorData.detail)
      return { success: false, error: errorData.detail }
    }

    const data: CandidateSummary = await response.json()
    console.log("Candidate Summary from backend:", data)

    return { success: true, data: data }
  } catch (e: any) {
    console.error("Network or unexpected error during candidate data processing:", e)
    return { success: false, error: e.message || "Error de red o inesperado." }
  }
}

// --- Server Action para obtener el resumen de un candidato por ID ---
export async function getCandidateSummaryAction(
  candidateId: string,
): Promise<{ success: boolean; data?: CandidateSummary; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/candidate-summary/${candidateId}`, {
      method: "GET",
      // cache: 'no-store' // Podrías querer no cachear si los datos pueden cambiar
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      console.error("Backend error fetching candidate summary:", errorData.detail)
      return { success: false, error: errorData.detail }
    }

    const data: CandidateSummary = await response.json()
    return { success: true, data: data }
  } catch (e: any) {
    console.error("Network or unexpected error fetching candidate summary:", e)
    return { success: false, error: e.message || "Error de red o inesperado." }
  }
}