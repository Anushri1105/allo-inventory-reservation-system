import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } = await context.params;

    const result =
      await prisma.$transaction(async (tx) => {

        const reservation =
          await tx.reservation.findUnique({
            where: {
              id,
            },
          });

        if (!reservation) {
          throw new Error(
            "RESERVATION_NOT_FOUND"
          );
        }

        if (
          reservation.status === "RELEASED"
        ) {
          throw new Error(
            "ALREADY_RELEASED"
          );
        }

        await tx.inventory.update({
          where: {
            id: reservation.inventoryId,
          },
          data: {
            reservedUnits: {
              decrement:
                reservation.quantity,
            },
          },
        });

        const updatedReservation =
          await tx.reservation.update({
            where: {
              id,
            },
            data: {
              status: "RELEASED",
            },
          });

        return updatedReservation;
      });

    return NextResponse.json(result);

  } catch (error: any) {

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}