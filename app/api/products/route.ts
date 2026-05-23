import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  const inventories = await prisma.inventory.findMany({
    include: {
      product: true,
      warehouse: true,
    },
  });

  const result = inventories.map((item) => ({
    inventoryId: item.id,
    product: item.product.name,
    warehouse: item.warehouse.name,
    totalUnits: item.totalUnits,
    reservedUnits: item.reservedUnits,
    availableStock:
      item.totalUnits - item.reservedUnits,
  }));

  return NextResponse.json(result);
}