'use server'

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database'; // Importa la instancia de Prisma desde tu utilidad
import { EducationItem, ExperienceItem, LanguageItem } from '@/types/cv';


interface CandidateRequestBody {
  name: string;
  email?: string;
  phone?: string;
  experience: any[];
  education: any[];
  skills: string[];
  languages: any[];
  summary?: string;
  rawText?: string;
  employabilityScore: number;
  topRecommendations: string[];
  lastProcessed: string; // Recibir como string, convertir a Date
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

// POST - Crear un nuevo candidato
export async function POST(request: NextRequest) {
  try {
    const body: CandidateRequestBody = await request.json();

    const {
      name,
      email,
      phone,
      experience,
      education,
      skills,
      languages,
      summary,
      rawText,
      employabilityScore,
      topRecommendations,
      lastProcessed, 
      areasForDevelopment,
      interviewQuestions,
      lastJob,
      lastEducation,
      disability,
      previousIncarceration,
      formalEducationYears,
      workExperienceYears,
      isAptForEmployment,
      cvFileName,
    } = body;

    const newCandidate = await prisma.candidate.create({
      data: {
        name,
        email,
        phone,
        experience,
        education,
        skills,
        languages,
        summary,
        rawText,
        employabilityScore,
        topRecommendations,
        lastProcessed: new Date(lastProcessed), 
        areasForDevelopment,
        interviewQuestions,
        lastJob,
        lastEducation,
        disability,
        previousIncarceration,
        formalEducationYears,
        workExperienceYears,
        isAptForEmployment,
        cvFileName,
      },
    });

    return NextResponse.json(newCandidate, { status: 201 });
  } catch (error) {
    console.error("Error creating candidate:", error);
    let errorMessage = "Error interno del servidor al crear candidato.";
    if (error instanceof Error) {
        errorMessage = `Error al crear candidato: ${error.message}`;
    }
    // Puedes añadir más lógica para diferenciar errores de validación, etc.

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// GET - Obtener todos los candidatos
export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: {
        createdAt: 'desc', 
      },
      select: {
        id: true,
        name: true,
        cvFileName: true,
        lastProcessed: true,
        employabilityScore: true,
        createdAt: true,
      }
    });

    return NextResponse.json(candidates, { status: 200 });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    let errorMessage = "Error interno del servidor al obtener candidatos.";
    if (error instanceof Error) {
      errorMessage = `Error al obtener candidatos: ${error.message}`;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Opcional: Para otros métodos HTTP no implementados
export async function PUT() {
  return NextResponse.json({ message: "Método PUT no permitido para /api/candidates" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Método DELETE no permitido para /api/candidates" }, { status: 405 });
}