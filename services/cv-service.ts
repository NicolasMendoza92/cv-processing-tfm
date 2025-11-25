import type { CVRecord, CandidateDetails, JobRecommendationsResponse, CandidateSummary } from "@/types/cv"
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
