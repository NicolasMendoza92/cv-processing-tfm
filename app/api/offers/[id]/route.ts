import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import {  offerSchema } from "@/schemas";
import z from "zod";

interface RouteParams {
  id: string;
}

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
    const offer = await prisma.offer.findUnique({
      where: {
        id: id,
      },
    });

    if (!offer) {
      return NextResponse.json(
        { message: `Candidato con ID ${id} no encontrado.` },
        { status: 404 }
      );
    }

    return NextResponse.json(offer, { status: 200 });
  } catch (error) {
    console.error("Error fetching offer:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al obtener el offer." },
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
    const validatedData = offerSchema.parse(body);
    const updatedOffer = await prisma.offer.update({
      where: {
        id: id,
      },
      data: {
        ...validatedData
      },
    });

    return NextResponse.json(updatedOffer, { status: 200 });
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
          { message: `Oferta  no encontrada para actualizar.` },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: `Error al actualizar oferta: ${error.message}` },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error interno del servidor al actualizar oferta." },
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

    const deletedOffer = await prisma.offer.delete({
      where: { id },
    });

    return NextResponse.json(deletedOffer, { status: 200 });
  } catch (error: any) {
    console.error("Error al borrar oferta:", error);
    return NextResponse.json(
      { message: `Error al borrar oferta: ${error.message}` },
      { status: 500 }
    );
  }
}
