import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./BestSellersSection.css";

const BestSellersSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        // console.log("Best Seller Response 👉", data); // 🔍 Inspect here
        setBestSellers(data);
      } catch (err) {
        setError("Failed to load best sellers");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  if (loading) return <p className="text-center">Loading Best sellers...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (bestSellers.length === 0)
    return <p className="text-center">No best sellers found.</p>;

  return (
    <div className="p-4">
      {/* <h2 className="text-2xl font-bold text-blue-900 mb-4">🔥 Best Sellers</h2> */}
      <div className="best-seller-wrapper">
        <div className="best-seller-marquee">
          {bestSellers.map((item, idx) => (
            <div key={idx} className="product-card-wrapper">
              <ProductCard product={item} badge={`Total ${item.totalSold} users buy this product. Now your turn!!`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellersSection;
