import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { candidateSchema } from "@/schemas";
import z from "zod";

interface RouteParams {
  id: string;
}

// GET - Obtener un candidato por ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { message: "ID del candidato es requerido." },
        { status: 400 }
      );
    }
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

    return NextResponse.json(candidate, { status: 200 });
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al obtener el candidato." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { message: "ID del candidato es requerido." },
        { status: 400 }
      );
    }
    const body = await request.json();
    const validatedData = candidateSchema.parse(body);
    const updatedCandidate = await prisma.candidate.update({
      where: {
        id: id,
      },
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
        disability: validatedData.disability,
        previousIncarceration: validatedData.previousIncarceration,
        // --- NUEVOS CAMPOS SOCIO‑LABORALES ---
        gender: validatedData.gender ?? null,
        age: validatedData.age ?? null,
        maritalStatus: validatedData.maritalStatus ?? null,
        birthCountry: validatedData.birthCountry ?? null,
        numLanguages: validatedData.numLanguages ?? null,
        hasCar: validatedData.hasCar ?? null,
        criminalRecord: validatedData.criminalRecord ?? null,
        restrainingOrder: validatedData.restrainingOrder ?? null,
        numChildren: validatedData.numChildren ?? null,
        workDisability: validatedData.workDisability ?? null,
        disabilityFlag: validatedData.disabilityFlag ?? null,
        jobSeeker: validatedData.jobSeeker ?? null,
        weaknesses: validatedData.weaknesses ?? null,
        trainingProfile: validatedData.trainingProfile ?? null,
        // --- OUTPUTS DE IA ---
        employabilityScore: validatedData.employabilityScore,
        topRecommendations: validatedData.topRecommendations,
        lastProcessed: new Date(validatedData.lastProcessed),
        areasForDevelopment: validatedData.areasForDevelopment ?? [],
        interviewQuestions: validatedData.interviewQuestions ?? [],
        cvFileName: validatedData.cvFileName ?? null,
      },
    });

    return NextResponse.json(updatedCandidate, { status: 200 });
  } catch (error) {
    console.error(`Error al actualizar candidato}:`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Datos de entrada inválidos para la actualización",
          errors: error.errors,
        },
        { status: 400 } // Bad Request
      );
    } else if (error instanceof Error) {
      if (error.message.includes("Record to update not found")) {
        return NextResponse.json(
          { message: `Candidato  no encontrado para actualizar.` },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: `Error al actualizar candidato: ${error.message}` },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error interno del servidor al actualizar candidato." },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log("ID recibido en DELETE:", id);

    if (!id) {
      return NextResponse.json(
        { message: "ID del candidato es requerido." },
        { status: 400 }
      );
    }

    const deletedCandidate = await prisma.candidate.delete({
      where: { id },
    });

    return NextResponse.json(deletedCandidate, { status: 200 });
  } catch (error: any) {
    console.error("Error al borrar candidato:", error);
    return NextResponse.json(
      { message: `Error al borrar candidato: ${error.message}` },
      { status: 500 }
    );
  }
}
