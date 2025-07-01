import React from "react";
import aboutImg from "../../assets/product3.jpg";

const About = () => {
  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left: Image */}
          <div className="h-full w-full">
            <img
              src={aboutImg}
              alt="About Raphaa"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right: Content */}
          <div className="p-8 md:p-12 flex flex-col justify-center space-y-5 text-gray-800">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
              About <span className="text-blue-600">RAPHAAA</span>
            </h1>

            <p className="text-lg leading-relaxed">
              At <strong>RAPHAAA</strong>, fashion is more than clothing—
              it's a statement of individuality. We believe what you wear should feel personal,
              empowering, and uniquely you. That’s why every piece we create is designed with
              thoughtfulness, style, and purpose.
            </p>

            <p className="text-lg leading-relaxed">
              We don’t follow trends—we create limited, exclusive collections
              that blend creativity with comfort. Whether for a bold day out
              or a quiet moment of confidence, our fashion is made to reflect your story.
              From vibrant seasonal drops to everyday essentials,
              <span className="font-semibold text-blue-600"> RAPHAAA</span> is where quality meets self-expression.
            </p>

            <p className="text-lg leading-relaxed">
              Each garment is a part of a curated journey—crafted not in bulk,
              but with care—so your wardrobe remains as unique as your personality.
              Proudly rooted in value and vision, <strong>RAPHAAA</strong> stands for thoughtful fashion,
              authentic design, and a community of bold, expressive individuals.
            </p>

            <p className="text-lg leading-relaxed font-semibold text-blue-600">
              Wear it your way. Own it every day. <br />
              Welcome to the <span className="font-bold">RAPHAAA</span> movement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
