'use server'

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database'; // Importa la instancia de Prisma desde tu utilidad
import { candidateSchema } from '@/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = candidateSchema.parse(body);
    // Verificar si ya existe un candidato con ese email
    if (!validatedData.email) {
      return NextResponse.json(
        { message: "El email es requerido." },
        { status: 400 }
      );
    }

    const existingCandidate = await prisma.candidate.findUnique({
      where: { email: validatedData.email }
    });

    if (existingCandidate) {
      return NextResponse.json(
        { 
          message: "Este candidato ya existe con el email proporcionado.",
          candidate: existingCandidate 
        }, 
        { status: 409 } 
      );
    }


    const newCandidate = await prisma.candidate.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        experience: validatedData.experience,
        education: validatedData.education,
        skills: validatedData.skills,
        languages: validatedData.languages,
        summary: validatedData.summary,
        rawText: validatedData.rawText,
        gender: validatedData.gender,
        age: validatedData.age,
        maritalStatus: validatedData.maritalStatus,
        birthCountry: validatedData.birthCountry,
        numLanguages: validatedData.numLanguages,
        hasCar: validatedData.hasCar,
        numChildren: validatedData.numChildren,
        jobSeeker: validatedData.jobSeeker,
        criminalRecord: validatedData.criminalRecord,
        restrainingOrder: validatedData.restrainingOrder,
        disability: validatedData.disability,
        previousIncarceration: validatedData.previousIncarceration,
        weaknesses: validatedData.weaknesses,
        trainingProfile: validatedData.trainingProfile,
        employabilityScore: validatedData.employabilityScore,
        topRecommendations: validatedData.topRecommendations,
        lastProcessed: new Date(validatedData.lastProcessed),
        areasForDevelopment: validatedData.areasForDevelopment,
        interviewQuestions: validatedData.interviewQuestions,
        cvFileName: validatedData.cvFileName,
      },
    });

    return NextResponse.json(newCandidate, { status: 201 });
  } catch (error) {
    console.error("Error creating candidate:", error);
    let errorMessage = "Error interno del servidor al crear candidato.";
    if (error instanceof Error) {
        errorMessage = `Error al crear candidato: ${error.message}`;
    }
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
