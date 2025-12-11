// app/api/candidates/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { EducationItem, ExperienceItem, LanguageItem } from '@/types/cv';

// Tipos para los parámetros de la ruta
interface RouteParams {
  id: string;
}

// GET - Obtener un candidato por ID
export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams } // Desestructura params de Next.js
) {
  try {
    const { id } = params;

    const candidate = await prisma.candidate.findUnique({
      where: {
        id: id,
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { message: `Candidato con ID ${id} no encontrado.` },
        { status: 404 }
      );
    }

    // Mapear el CandidateRecord (lo que devuelve Prisma) a tu CandidateDetails
    // Esto es crucial para mantener tu interfaz de frontend
    const mappedCandidateDetails = {
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      
      // Mapear los campos JSON a los tipos de frontend
      skills: candidate.skills, // Ya es string[]
      languages: candidate.languages as LanguageItem[], // Cast a tu interfaz de frontend
      
      // Aquí viene la lógica para los campos adicionales de CandidateDetails
      // Si lastJob / lastEducation no se guardan directamente en tu DB,
      // tendrás que inferirlos de los arrays 'experience'/'education' o dejarlos como null/undefined.
      lastJob: (candidate.experience as ExperienceItem[])?.[0]?.company || null, // Ejemplo: tomar el nombre de la compañía del primer item de experiencia
      lastEducation: (candidate.education as EducationItem[])?.[0]?.institution || null, // Ejemplo: tomar la institución del primer item de educación
      
      disability: candidate.disability,
      previousIncarceration: candidate.previousIncarceration,
      formalEducationYears: candidate.formalEducationYears,
      workExperienceYears: candidate.workExperienceYears,
      employabilityScore: candidate.employabilityScore,
      isAptForEmployment: candidate.isAptForEmployment,
      // Mapeo de `areasForDevelopment` a `developmentRecommendations`
      developmentRecommendations: candidate.areasForDevelopment,
      cvFileName: candidate.cvFileName,

      // Otros campos que pueden ser útiles y están en CandidateRecord pero no en tu CandidateDetails original
      summary: candidate.summary,
      rawText: candidate.rawText,
      topRecommendations: candidate.topRecommendations,
      lastProcessed: candidate.lastProcessed.toISOString(), // Convertir a string ISO
      interviewQuestions: candidate.interviewQuestions,
      createdAt: candidate.createdAt.toISOString(),
      updatedAt: candidate.updatedAt.toISOString(),
    };


    return NextResponse.json(mappedCandidateDetails, { status: 200 });
  } catch (error) {
    console.error(`Error fetching candidate with ID ${params.id}:`, error);
    let errorMessage = "Error interno del servidor al obtener el candidato.";
    if (error instanceof Error) {
      errorMessage = `Error al obtener el candidato: ${error.message}`;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}