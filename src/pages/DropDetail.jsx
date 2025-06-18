import { useParams } from "react-router-dom";
import ProductGrid from "../components/Products/ProductGrid";

const dropData = {
  ronaldo: {
    name: "Cristiano Ronaldo",
    product: "R7 Streetwear Edition",
    description:
      "Inspired by Ronaldo's fierce spirit. This limited edition outfit brings athletic energy to luxury streetwear.",
    price: "₹4,999",
    image: "https://picsum.photos/seed/r7product/700/500",
  },
  // ... other footballers
};

const usedProducts = [
  {
    _id: "dress1",
    name: "Worn R7 Hoodie",
    price: "2,499",
    images: [
      {
        url: "https://picsum.photos/seed/ronaldodress1/500/600",
        altText: "Worn R7 Hoodie",
      },
    ],
  },
  {
    _id: "dress2",
    name: "Training Tee - CR7",
    price: "1,999",
    images: [
      {
        url: "https://picsum.photos/seed/ronaldodress2/500/600",
        altText: "CR7 Tee",
      },
    ],
  },
  {
    _id: "dress3",
    name: "Signature Joggers",
    price: "2,799",
    images: [
      {
        url: "https://picsum.photos/seed/ronaldodress3/500/600",
        altText: "CR7 Joggers",
      },
    ],
  },
  {
    _id: "dress4",
    name: "Post-match Windbreaker",
    price: "3,299",
    images: [
      {
        url: "https://picsum.photos/seed/ronaldodress4/500/600",
        altText: "Windbreaker",
      },
    ],
  },
];

const DropDetail = () => {
  const { slug } = useParams();
  const data = dropData[slug];

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-red-500">Drop not found</h1>
        <p className="text-gray-500">Please check the link or go back to drops.</p>
      </div>
    );
  }

  return (
    <>
      {/* Drop Overview */}
      <section className="py-16 px-4 lg:px-0">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-sky-50 rounded-3xl">
          {/* Left */}
          <div className="lg:w-1/2 p-8 text-center lg:text-left">
            <h2 className="text-lg font-semibold text-sky-600 mb-2 tracking-wide uppercase">
              {data.name} Drop
            </h2>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-sky-600 to-blue-600 text-transparent bg-clip-text">
              {data.product}
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              {data.description}
            </p>
            <p className="text-2xl font-bold text-gray-800 mb-6">{data.price}</p>
            <button className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800">
              Buy Now
            </button>
          </div>

          {/* Right */}
          <div className="lg:w-1/2">
            <img
              src={data.image}
              alt={data.product}
              className="w-full h-[700px] object-cover lg:rounded-tr-3xl lg:rounded-br-3xl"
            />
          </div>
        </div>
      </section>

      {/* Used Dress Section */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Used Drop Collection</h2>
        <ProductGrid products={usedProducts} />
      </section>
    </>
  );
};

export default DropDetail;
