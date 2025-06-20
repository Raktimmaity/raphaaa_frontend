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
  const colors = ["Red", "Blue", "Black", "Green", "Yellow", "Gray", "White", "Pink", "Beige", "Navy"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Wool", "Denim", "Polyester", "Silk", "Linen", "Viscose", "Fleece"];
  const brands = ["Urban Threads", "Modern Fit", "Street Style", "Beach Breeze", "fashionista", "ChicStyle"];
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
    <div className="p-6 bg-white shadow-lg rounded-lg space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">Filters</h3>

      {/* Category */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Category</p>
        <div className="space-y-1">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-blue-600">
              <input
                type="radio"
                name="category"
                checked={filters.category === category}
                value={category}
                onChange={handleFilterChange}
                className="text-blue-500 focus:ring-2"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Gender</p>
        <div className="space-y-1">
          {genders.map((gender) => (
            <label key={gender} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-blue-600">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === gender}
                value={gender}
                onChange={handleFilterChange}
                className="text-blue-500 focus:ring-2"
              />
              {gender}
            </label>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              name="color"
              value={color}
              onClick={handleFilterChange}
              className={`w-8 h-8 rounded-full border-2 transition duration-150 ${
                filters.color === color ? "ring-2 ring-blue-500" : "border-gray-300"
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Size</p>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <label key={size} className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
              <input
                type="checkbox"
                name="size"
                checked={filters.size.includes(size)}
                value={size}
                onChange={handleFilterChange}
                className="text-blue-500"
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Material</p>
        <div className="space-y-1">
          {materials.map((material) => (
            <label key={material} className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
              <input
                type="checkbox"
                name="material"
                checked={filters.material.includes(material)}
                value={material}
                onChange={handleFilterChange}
                className="text-blue-500"
              />
              {material}
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Brand</p>
        <div className="space-y-1">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
              <input
                type="checkbox"
                name="brand"
                checked={filters.brand.includes(brand)}
                value={brand}
                onChange={handleFilterChange}
                className="text-blue-500"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Price Range</p>
        <input
          type="range"
          name="priceRange"
          value={priceRange[1]}
          onChange={handlePriceChange}
          min={0}
          max={100}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>₹0</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
