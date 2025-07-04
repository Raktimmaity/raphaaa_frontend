import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

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
  const [expandedSections, setExpandedSections] = useState({
     category: true, 
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = [
    "Red", "Blue", "Black", "Green", "Yellow",
    "Gray", "White", "Pink", "Beige", "Navy"
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = [
    "Cotton", "Wool", "Denim", "Polyester", "Silk",
    "Linen", "Viscose", "Fleece"
  ];
  const brands = [
    "Urban Threads", "Modern Fit", "Street Style",
    "Beach Breeze", "fashionista", "ChicStyle"
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

  const Section = ({ label, sectionKey, children }) => (
    <div className="border-t border-gray-200 pt-4">
      <div
        onClick={() => toggleSection(sectionKey)}
        className="flex justify-between items-center cursor-pointer mb-2"
      >
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        {expandedSections[sectionKey] ? (
          <FaChevronUp className="text-gray-500 text-xs" />
        ) : (
          <FaChevronDown className="text-gray-500 text-xs" />
        )}
      </div>
      {expandedSections[sectionKey] && children}
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow border border-gray-200 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Filters
        </h3>
        <p className="text-xs text-gray-400">1000+ Products</p>
      </div>

      <Section label="Category" sectionKey="category">
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 text-sm text-gray-700 hover:text-sky-600"
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
      </Section>

      <Section label="Gender" sectionKey="gender">
        <div className="space-y-2">
          {genders.map((gender) => (
            <label
              key={gender}
              className="flex items-center gap-3 text-sm text-gray-700 hover:text-sky-600"
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
      </Section>

      <Section label="Color" sectionKey="color">
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
      </Section>

      <Section label="Size" sectionKey="size">
        <div className="grid grid-cols-3 gap-3">
          {sizes.map((size) => (
            <label
              key={size}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-sky-600"
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
      </Section>

      <Section label="Fabric" sectionKey="material">
        <div className="space-y-2">
          {materials.map((material) => (
            <label
              key={material}
              className="flex items-center gap-3 text-sm text-gray-700 hover:text-sky-600"
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
      </Section>

      <Section label="Brand" sectionKey="brand">
        <div className="space-y-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 text-sm text-gray-700 hover:text-sky-600"
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
      </Section>

      <Section label="Price Range" sectionKey="price">
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
      </Section>
    </div>
  );
};

export default FilterSidebar;
