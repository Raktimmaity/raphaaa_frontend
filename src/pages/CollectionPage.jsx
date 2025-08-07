import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useParams, useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import { ImCross } from "react-icons/im";
import axios from "axios";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsDidebarOpen] = useState(false);
  const [collabActive, setCollabActive] = useState(null);

  useEffect(() => {
    // Check if a collab is active
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/collabs/active`)
      .then((res) => setCollabActive(res.data.isActive))
      .catch(() => setCollabActive(false));
  }, []);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  const toggleSidebar = () => {
    setIsDidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsDidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearFilters = () => {
    navigate(`/collections/${collection}`);
  };

  // 🚫 Block `/collections/all` when a collab is active
  if (collabActive && collection === "all") {
    return <Navigate to="/404" />;
  }

  return (
    <div className="flex p-2 md:p-6 flex-col lg:flex-row">
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" /> Filters
      </button>

      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 md:w-[300px] overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 rounded-2xl`}
      >
        <FilterSidebar />
      </div>

      <div className="flex-grow px-1 md:px-6 lg:pl-10">
        <h2 className="text-2xl uppercase mb-4">{collection} Collection</h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort By:</span>
            <SortOptions />
          </div>

          {searchParams.toString() && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm transition-all"
            >
              <ImCross className="inline mr-1" /> Clear All Filters
            </button>
          )}
        </div>

        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
