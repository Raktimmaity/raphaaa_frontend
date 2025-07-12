import React, { useState, useEffect } from "react";
import { HiMiniMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductsByFilters,
  setFilters,
} from "../../redux/slices/productsSlice";
import axios from "axios";

// const API_URL = import. || 'http://localhost:5000';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;

    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductsByFilters({ search: searchTerm }));
    navigate(`/collections/all?search=${searchTerm}`);
    setSearchTerm("");
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product._id}`);
    setSearchTerm("");
    setIsOpen(false);
    setSuggestions([]);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/suggestions?search=${searchTerm}`
        );
        setSuggestions(data || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen ? "absolute top-0 left-0 w-full bg-white h-28 z-50" : "w-auto"
      } ease-in-out`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
          <div className="relative w-1/2">
            <input
              type="text"
              className="bg-gray-100 py-3 px-4 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600 hover:text-white transition-colors duration-300"
            >
              <HiMiniMagnifyingGlass className="h-6 w-6" />
            </button>

            {/* 🔻 Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white shadow-md max-h-64 overflow-y-auto z-50 mt-1 rounded-md">
                {suggestions.map((product) => (
                  <li
                    key={product._id}
                    className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSuggestionClick(product)}
                  >
                    <img
                      src={product.images[0]?.url || "/no-image.png"}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <span className="text-sm text-gray-800">
                      {product.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* close icon */}
          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <HiMiniXMark className="h-6 w-6 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 cursor-pointer" />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMiniMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
