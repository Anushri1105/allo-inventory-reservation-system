"use client";

import { useEffect, useState } from "react";

export default function Home() {

  const [products, setProducts] = useState([]);

  async function fetchProducts() {

    const res =
      await fetch(
        "http://localhost:3000/api/products"
      );

    const data = await res.json();

    setProducts(data);
  }

  async function reserveProduct(
    inventoryId: string
  ) {

    const res = await fetch(
      "http://localhost:3000/api/reservations",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          inventoryId,
          quantity: 1,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {

      alert(
        `Reservation Created: ${data.id}`
      );

      fetchProducts();

    } else {

      alert(data.error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (

    <div style={{ padding: "30px" }}>

      <h1>
        Inventory Reservation System
      </h1>

      {products.map((item: any) => (

        <div
          key={item.inventoryId}
          style={{
            border: "1px solid gray",
            padding: "20px",
            marginBottom: "20px",
          }}
        >

          <h2>{item.product}</h2>

          <p>
            Warehouse:
            {" "}
            {item.warehouse}
          </p>

          <p>
            Available Stock:
            {" "}
            {item.availableStock}
          </p>

          <button
            onClick={() =>
              reserveProduct(
                item.inventoryId
              )
            }
          >
            Reserve
          </button>

        </div>
      ))}
    </div>
  );
}