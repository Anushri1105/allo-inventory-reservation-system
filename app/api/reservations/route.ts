import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const { inventoryId, quantity } = body;

    const reservation =
      await prisma.$transaction(async (tx) => {

        const inventory =
          await tx.inventory.findUnique({
            where: {
              id: inventoryId,
            },
          });

        if (!inventory) {
          throw new Error("INVENTORY_NOT_FOUND");
        }

        const availableStock =
          inventory.totalUnits -
          inventory.reservedUnits;

        if (availableStock < quantity) {
          throw new Error("OUT_OF_STOCK");
        }

        await tx.inventory.update({
          where: {
            id: inventoryId,
          },
          data: {
            reservedUnits: {
              increment: quantity,
            },
          },
        });

        const reservation =
          await tx.reservation.create({
            data: {
              inventoryId,
              quantity,
              status: "PENDING",
              expiresAt: new Date(
                Date.now() + 10 * 60 * 1000
              ),
            },
          });

        return reservation;
      });

    return NextResponse.json(reservation);

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}