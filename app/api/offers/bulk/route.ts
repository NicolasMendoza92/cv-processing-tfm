import { NextResponse } from "next/server";
import { prisma } from "@/lib/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const offers = body.offers ?? [];

    const created = await prisma.offer.createMany({
      data: offers,
      skipDuplicates: true,
    });

    return NextResponse.json(created); // ✅ SIEMPRE JSON
  } catch (error: any) {
    console.error("❌ ERROR EN /api/offers/bulk:", error);
    return NextResponse.json(
      { message: error.message || "Error al crear ofertas masivas" },
      { status: 400 }
    );
  }
}

// export async function POST(request: Request) {
//   try {
//     const body = await request.json()
//     const offers = body.offers ?? []

//     // Opción A: crear una por una y devolver el array creado
//     const created = await Promise.all(
//       offers.map((data: any) =>
//         prisma.offer.create({ data })
//       )
//     )

//     return NextResponse.json(created) // ✅ array de JobOffer
//   } catch (error: any) {
//     return NextResponse.json(
//       { message: error.message || "Error al crear ofertas masivas" },
//       { status: 400 }
//     )
//   }
// }
