import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Pink",
    "Beige",
    "Navy",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = [
    "Cotton",
    "Wool",
    "Denim",
    "Polyester",
    "Silk",
    "Linen",
    "Viscose",
    "Fleece",
  ];
  const brands = [
    "Urban Threads",
    "Modern Fit",
    "Street Style",
    "Beach Breeze",
    "fashionista",
    "ChicStyle",
  ];
  const genders = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 100,
    });
    setPriceRange([0, params.maxPrice || 100]);
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilters(filters);
    updateURLParams(newFilters);
  };

  return (
    <div className="p-6 bg-white/60 backdrop-blur-md shadow-2xl rounded-2xl space-y-10 border border-blue-200">
      <h3 className="text-2xl font-extrabold text-gradient-to-r from-blue-600 to-sky-500 mb-6">
        Filters
      </h3>

      {/* Category */}
      <div>
        <p className="text-blue-800 font-semibold mb-2">Category</p>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer text-sm text-blue-800 hover:text-sky-600"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === category}
                value={category}
                onChange={handleFilterChange}
                className="accent-sky-600 w-4 h-4"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <p className="text-blue-800 font-semibold mb-2">Gender</p>
        <div className="space-y-2">
          {genders.map((gender) => (
            <label
              key={gender}
              className="flex items-center gap-3 cursor-pointer text-sm text-blue-800 hover:text-sky-600"
            >
              <input
                type="radio"
                name="gender"
                checked={filters.gender === gender}
                value={gender}
                onChange={handleFilterChange}
                className="accent-sky-600 w-4 h-4"
              />
              {gender}
            </label>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <p className="text-blue-800 font-semibold mb-2">Color</p>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              name="color"
              value={color}
              onClick={handleFilterChange}
              className={`w-8 h-8 rounded-full border-2 shadow-md transition transform duration-200 hover:scale-110 ${
                filters.color === color
                  ? "ring-2 ring-sky-500 border-white"
                  : "border-blue-100"
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="text-blue-800 font-semibold mb-2">Size</p>
        <div className="grid grid-cols-3 gap-3">
          {sizes.map((size) => (
            <label
              key={size}
              className="flex items-center gap-2 text-sm text-blue-800 hover:text-sky-600"
            >
              <input
                type="checkbox"
                name="size"
                checked={filters.size.includes(size)}
                value={size}
                onChange={handleFilterChange}
                className="accent-sky-500 w-4 h-4"
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <p className="text-blue-800 font-semibold mb-2">Material</p>
        <div className="space-y-2">
          {materials.map((material) => (
            <label
              key={material}
              className="flex items-center gap-3 text-sm text-blue-800 hover:text-sky-600"
            >
              <input
                type="checkbox"
                name="material"
                checked={filters.material.includes(material)}
                value={material}
                onChange={handleFilterChange}
                className="accent-sky-500 w-4 h-4"
              />
              {material}
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <p className="text-blue-800 font-semibold mb-2">Brand</p>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 text-sm text-blue-800 hover:text-sky-600"
            >
              <input
                type="checkbox"
                name="brand"
                checked={filters.brand.includes(brand)}
                value={brand}
                onChange={handleFilterChange}
                className="accent-sky-500 w-4 h-4"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-blue-800 font-semibold mb-2">Price Range</p>
        <input
          type="range"
          name="priceRange"
          value={priceRange[1]}
          onChange={handlePriceChange}
          min={0}
          max={100}
          className="w-full h-2 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-blue-700 mt-1">
          <span>₹0</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
