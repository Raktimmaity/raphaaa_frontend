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
    gender: true,
    color: true,
    size: true,
    material: true,
    brand: true,
    price: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = ["Red", "Blue", "Black", "Green", "Yellow", "Gray", "White", "Pink", "Beige", "Navy"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Wool", "Denim", "Polyester", "Silk", "Linen", "Viscose", "Fleece"];
  const brands = ["Urban Threads", "Modern Fit", "Street Style", "Beach Breeze", "fashionista", "ChicStyle"];
  const genders = ["Men", "Women", "Kids"];

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
      const value = newFilters[key];
      if (Array.isArray(value) && value.length > 0) {
        params.append(key, value.join(","));
      } else if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        !(key === "maxPrice" && Number(value) === 100) &&
        !(key === "minPrice" && Number(value) === 0)
      ) {
        params.append(key, value);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    // (logic unchanged)
    setFilters(filters);
    updateURLParams(newFilters);
  };

  const pillClass = (isActive) =>
    `px-3 py-1.5 rounded-full border text-sm transition-all duration-200
     ${isActive
      ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white border-transparent shadow-md shadow-sky-200"
      : "bg-white/80 backdrop-blur border-gray-200 text-gray-700 hover:bg-gray-50"
    }`;

  const Section = ({ label, sectionKey, children }) => (
    <div className="border-b border-gray-100/60 pb-4">
      <div
        onClick={() => toggleSection(sectionKey)}
        className="flex justify-between items-center cursor-pointer mb-3 group"
      >
        <p className="text-sm font-semibold tracking-wide text-gray-800 uppercase">
          {label}
        </p>
        {expandedSections[sectionKey] ? (
          <FaChevronUp className="text-gray-400 text-xs transition-transform duration-200 group-hover:text-gray-600" />
        ) : (
          <FaChevronDown className="text-gray-400 text-xs transition-transform duration-200 group-hover:text-gray-600" />
        )}
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out
          ${expandedSections[sectionKey] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        {children}
      </div>
    </div>
  );

  return (
    <div
      className="sticky top-2
                 p-5 md:p-6 bg-white/90 backdrop-blur
                 rounded-2xl shadow-[8px_8px_20px_rgba(9,132,227,0.08),_-6px_-6px_16px_rgba(255,255,255,0.6)]
                 border border-white/60 space-y-6"
    >
      <div className="pb-4 border-b border-gray-100/60">
        <h3 className="text-xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-blue-700">
          Filters
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">Find products that suit you</p>
      </div>

      <Section label="Category" sectionKey="category">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleFilterChange({ target: { name: "category", value: category, type: "radio" } })}
              className={pillClass(filters.category === category)}
            >
              {category}
            </button>
          ))}
        </div>
      </Section>

      <Section label="Gender" sectionKey="gender">
        <div className="flex flex-wrap gap-2">
          {genders.map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => handleFilterChange({ target: { name: "gender", value: gender, type: "radio" } })}
              className={pillClass(filters.gender === gender)}
            >
              {gender}
            </button>
          ))}
        </div>
      </Section>

      <Section label="Color" sectionKey="color">
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleFilterChange({ target: { name: "color", value: color, type: "radio" } })}
              className={pillClass(filters.color === color)}
            >
              {color}
            </button>
          ))}
        </div>
      </Section>

      <Section label="Size" sectionKey="size">
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <label key={size} className="flex items-center">
              <input
                type="checkbox"
                name="size"
                checked={filters.size.includes(size)}
                value={size}
                onChange={handleFilterChange}
                className="hidden"
              />
              <span className={pillClass(filters.size.includes(size))}>{size}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section label="Fabric" sectionKey="material">
        <div className="grid grid-cols-2 gap-2">
          {materials.map((material) => (
            <label key={material} className="flex items-center gap-2 text-sm text-gray-700 hover:text-sky-600">
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
        <div className="grid grid-cols-1 gap-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm text-gray-700 hover:text-sky-600">
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
        <div className="rounded-xl p-3 bg-gradient-to-b from-white to-sky-50 border border-sky-100">
          <input
            type="range"
            name="priceRange"
            value={priceRange[1]}
            onChange={handlePriceChange}
            min={0}
            max={100}
            className="w-full accent-sky-600 cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>₹0</span>
            <span className="font-semibold text-sky-700">₹{priceRange[1]}</span>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default FilterSidebar;
