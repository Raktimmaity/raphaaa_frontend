import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./BestSellersSection.css";

const BestSellersSection = () => {
  const [collabActive, setCollabActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bestSellers, setBestSellers] = useState([]);

  // ✅ Always call this hook
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/collabs/active`)
      .then((res) => setCollabActive(res.data.isActive))
      .catch(() => setCollabActive(false));
  }, []);

  // ✅ Always call this hook
  useEffect(() => {
    if (collabActive === false) {
      const fetchBestSellers = async () => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
          );
          setBestSellers(data);
        } catch (err) {
          setError("Failed to load best sellers");
        } finally {
          setLoading(false);
        }
      };

      fetchBestSellers();
    }
  }, [collabActive]);

  // ✅ Now safely handle UI conditions
  if (collabActive === null) return null;        // waiting for status check
  if (collabActive === true) return null;        // hide section when collab is active
  if (loading) return <p className="text-center">Loading Best sellers...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (bestSellers.length === 0)
    return <p className="text-center">No best sellers found.</p>;

  return (
    <>
      <div className="text-center mb-8 pt-8">
        <h2 className="text-3xl font-bold inline-block relative">
          Best Seller
          <div className="mt-2 h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-blue-200 rounded-full" />
        </h2>
      </div>
      <div className="p-4">
        <div className="best-seller-wrapper">
          <div className="best-seller-marquee">
            {[...bestSellers, ...bestSellers].map((item, idx) => (
              <div key={idx} className="product-card-wrapper">
                <ProductCard
                  product={item}
                  badge={`Total ${item.totalSold} users buy this product. Now your turn!!`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BestSellersSection;
