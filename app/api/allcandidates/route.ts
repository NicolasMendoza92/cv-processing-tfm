import {  NextResponse } from 'next/server';
import { prisma } from '@/lib/database'; 

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: {
        createdAt: 'desc', 
      },
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