'use server'

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database'; 
import {  offerSchema } from '@/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = offerSchema.parse(body);

    const newOffer = await prisma.offer.create({
      data: {
        ...validatedData
      },
    });

    return NextResponse.json(newOffer, { status: 201 });
  } catch (error) {
    console.error("Error creating offer:", error);
    let errorMessage = "Error interno del servidor al crear oferta.";
    if (error instanceof Error) {
        errorMessage = `Error al crear oferta: ${error.message}`;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: {
        createdAt: 'desc', 
      }
    });

    return NextResponse.json(offers, { status: 200 });
  } catch (error) {
    console.error("Error fetching offers:", error);
    let errorMessage = "Error interno del servidor al obtener ofertas.";
    if (error instanceof Error) {
      errorMessage = `Error al obtener ofertas: ${error.message}`;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
