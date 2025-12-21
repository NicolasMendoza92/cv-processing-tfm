'use server'
import type {
  CVRecord,
  CandidateAnalysisResponse,
  ExtractedCVData,
  ErrorResponse,
  CandidateDataExtended,
  CandidateExtractedData,
  CandidateSummarizeResponse,
  CandidateToAnalyzeType,
  CandidateData,
} from "@/types";

const API_BASE_URL = "http://127.0.0.1:8000";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Función que recupera todos los candidatos
async function getCandidates(): Promise<CandidateData[]> {
  const response = await fetch(`${baseUrl}/api/candidates`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Fallo al obtener los candidatos");
  }

  const candidates: CandidateData[] = await response.json();
  return candidates;
}

export async function getCVsStatus(): Promise<CVRecord[]> {
  try {
    const candidates = await getCandidates();

    const cvRecords = candidates.map((candidate) => ({
      id: candidate.id,
      cvFileName: candidate.cvFileName,
      uploadDate: candidate.uploadDate || new Date().toISOString(),
      status: "Procesado",
      detailsLink: `/cv-extracted/${candidate.id}`,
      errorMessage: undefined,
    }));

    return cvRecords as CVRecord[];
  } catch (error) {
    console.error("Error transformando candidatos a CVRecords:", error);
    throw error;
  }
}

export async function getExtractedData(
  id: string
): Promise<CandidateExtractedData | null> {
  try {
    const response = await fetch(`${baseUrl}/api/candidates/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Candidato con ID ${id} no encontrado en la API.`);
        return null;
      }
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al obtener datos extraídos del candidato."
      );
    }

    const data: CandidateExtractedData = await response.json();
    return data;
  } catch (error) {
    console.error(`Fallo al obtener datos extraídos para ID ${id}:`, error);
    throw error;
  }
}

// --- MICROSERVICIO 1 para extraer datos del CV (adjunto) ---
export async function extractCVDataAction(file: File): Promise<{
  success: boolean;
  data?: ExtractedCVData;
  error?: string;
}> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/extract-cv-data`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      console.error("Backend error during CV extraction:", errorData.detail);
      return { success: false, error: errorData.detail };
    }

    const data = await response.json();

    return { success: true, data: data };
  } catch (e: any) {
    console.error("Network or unexpected error during CV extraction:", e);
    return { success: false, error: e.message || "Error de red o inesperado." };
  }
}

// --- Server Action MICROSERVICIO 2 para procesar los datos extraídos del candidato ---
export async function processCandidateDataAction(
  candidateData: CandidateToAnalyzeType
): Promise<{
  success: boolean;
  data?: CandidateAnalysisResponse;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/process-candidate-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(candidateData),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      console.error(
        "Backend error during candidate data processing:",
        errorData.detail
      );
      return { success: false, error: errorData.detail };
    }

    const data: CandidateAnalysisResponse = await response.json();
    return { success: true, data: data };
  } catch (e: any) {
    console.error(
      "Network or unexpected error during candidate data processing:",
      e
    );
    return { success: false, error: e.message || "Error de red o inesperado." };
  }
}

// --- Server Action para obtener el resumen de un candidato por ID ---
export async function candidateSummaryAction(
  candidateRawText: string
): Promise<{
  success: boolean;
  data?: CandidateSummarizeResponse;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/summarize-cv`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw_text: candidateRawText,
      }),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      console.error(
        "Backend error during candidate data processing:",
        errorData.detail
      );
      return { success: false, error: errorData.detail };
    }

    const data: CandidateSummarizeResponse = await response.json();

    return { success: true, data: data };
  } catch (e: any) {
    console.error(
      "Network or unexpected error during candidate data processing:",
      e
    );
    return { success: false, error: e.message || "Error de red o inesperado." };
  }
}

export async function getCandidateDetails(
  id: string
): Promise<CandidateDataExtended | null> {
  try {
    const response = await fetch(`${baseUrl}/api/candidates/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Candidato con ID ${id} no encontrado en la API.`);
        return null;
      }
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al obtener datos extraídos del candidato."
      );
    }

    const data: CandidateDataExtended = await response.json();
    return data;
  } catch (error) {
    console.error(`Fallo al obtener datos extraídos para ID ${id}:`, error);
    throw error; // Relanza el error para que el componente pueda manejarlo
  }
}

export async function getTopRecommendations(
  candidateId: string
): Promise<string[] | null> {
  try {
    const response = await fetch(`${baseUrl}/api/candidates/${candidateId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Candidato con ID ${candidateId} no encontrado.`);
        return null;
      }
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al obtener datos del candidato."
      );
    }

    const data: CandidateExtractedData = await response.json();

    // ⬅️ AQUÍ DEVUELVES SOLO topRecommendations
    return data.topRecommendations || [];
  } catch (error) {
    console.error(
      `Fallo al obtener recomendaciones para ID ${candidateId}:`,
      error
    );
    throw error;
  }
}

export async function getCandidatesSummary(): Promise<CandidateDataExtended[]> {
  const response = await fetch(`${baseUrl}/api/allcandidates`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Fallo al obtener los candidatos");
  }

  const candidates = await response.json();
  return candidates;
}

export async function createCandidate(
  data: Omit<CandidateDataExtended, "id">
): Promise<CandidateDataExtended> {
  const response = await fetch(`${baseUrl}/api/candidates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear el candidato");
  }

  return response.json();
}

export async function updateCandidate(
  id: string,
  updatedData: CandidateDataExtended
): Promise<CandidateDataExtended | null> {
  console.log("Actualizando candidato con id:", id);
  try {
    const response = await fetch(`${baseUrl}/api/candidates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.errors?.length) {
        const details = errorData.errors
          .map((e: any) => `${e.path.join(".")}: ${e.message}`) // ➜ muestra campo + mensaje
          .join(" | ");
        throw new Error(`Errores de validación: ${details}`);
      }
      throw new Error(errorData.message || "Error al actualizar el candidato.");
    }
    return response.json();
  } catch (error) {
    console.error(`Fallo al actualizar candidato con ID ${id}:`, error);
    throw error;
  }
}

export async function deleteCandidate(id: string) {
  try {
    const response = await fetch(`${baseUrl}/api/candidates/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al borrar el candidato.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Fallo al borrar candidato con ID ${id}:`, error);
    throw error;
  }
}

export async function sendFeedback(
  candidateId: string,
  feedbackData: any
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        `[v0] Simulando envío de feedback para ${candidateId}:`,
        feedbackData
      );
      resolve({
        success: true,
        message:
          "Feedback recibido exitosamente. ¡Gracias por contribuir a la mejora del modelo!",
      });
    }, 500);
  });
}
