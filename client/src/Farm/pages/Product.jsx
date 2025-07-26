import axios from "axios";
import React, { useEffect, useState } from "react";

function Product() {
  const [products, setProducts] = useState([]);
  const getProductFarm = async () => {
    const id = localStorage.getItem("farmer_id");
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `farm-products/${id}`
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    getProductFarm();
  }, []);

  return (
    <div>
      Product
      <pre className="p-4">{JSON.stringify(products, null, 2)}</pre>
    </div>
  );
}

export default Product;
