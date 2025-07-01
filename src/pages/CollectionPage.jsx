import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import product1 from "../assets/product1.jpg";
import product2 from "../assets/product2.jpg";
import product3 from "../assets/product3.jpg";
import product4 from "../assets/product4.jpg";
import product5 from "../assets/product5.jpg";
import product6 from "../assets/product6.jpg";
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

    // const [products, setProducts] = useState([]);
    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsDidebarOpen] = useState(false);

    useEffect(()=> {
      dispatch(fetchProductsByFilters({collection, ...queryParams}));
    }, [dispatch, collection, searchParams]);

    const toggleSidebar = () => {
        setIsDidebarOpen(!isSidebarOpen);
    }

    const handleClickOutside = (e) => {
        // close sidebar if clicked outside
        if(sidebarRef.current && !sidebarRef.current.contains(e.target)){
            setIsDidebarOpen(false);
        }
    }

    useEffect(()=>{
        // add event listener for clicks
        document.addEventListener("mousedown", handleClickOutside);
        // clean event listener
        // document.removeEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // useEffect(()=> {
    //     setTimeout(() => {
    //         const fetchProducts = [
    //             {
    //                 _id: 1,
    //                 name: "Product 1",
    //                 price: 100,
    //                 // images: [{ url: "https://picsum.photos/500/500?random=3" }],
    //                 images: [{ url: product1 }],
    //               },
    //               {
    //                 _id: 2,
    //                 name: "Product 2",
    //                 price: 100,
    //                 // images: [{ url: "https://picsum.photos/500/500?random=4" }],
    //                 images: [{ url: product2 }],
    //               },
    //               {
    //                 _id: 3,
    //                 name: "Product 3",
    //                 price: 100,
    //                 // images: [{ url: "https://picsum.photos/500/500?random=5" }],
    //                 images: [{ url: product3 }],
    //               },
    //               {
    //                 _id: 4,
    //                 name: "Product 4",
    //                 price: 100,
    //                 // images: [{ url: "https://picsum.photos/500/500?random=6" }],
    //                 images: [{ url: product4 }],
    //               },
    //               {
    //                 _id: 5,
    //                 name: "Product 5",
    //                 price: 100,
    //                 // images: [{ url: "https://picsum.photos/500/500?random=7" }],
    //                 images: [{ url: product5 }],
    //               },
    //               {
    //                 _id: 6,
    //                 name: "Product 6",
    //                 price: 100,
    //                 // images: [{ url: "https://picsum.photos/500/500?random=8" }],
    //                 images: [{ url: product6 }],
    //               },
    //               {
    //                 _id: 7,
    //                 name: "Product 7",
    //                 price: 100,
    //                 // images: [{ url: "https://picsum.photos/500/500?random=9" }],
    //                 images: [{ url: product1 }],
    //               },
    //               {
    //                 _id: 8,
    //                 name: "Product 8",
    //                 price: 100,
    //                 // images: [{ url: "https://picsum.photos/500/500?random=10" }],
    //                 images: [{ url: product2 }],
    //               },
    //         ];
    //         setProducts(fetchProducts);
    //     }, 1000);
    // }, []);

  return (
    <div className='flex flex-col lg:flex-row'>
      {/* mobile filter button */}
      <button onClick={toggleSidebar} className="lg:hidden border p-2 flex justify-center items-center">
        <FaFilter className='mr-2'/> Filters
      </button>

      {/* filter sidebar */}
      <div ref={sidebarRef} className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 rounded-2xl`}>
        <FilterSidebar/>
      </div>
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All collections</h2>
        {/* sort options */}
        <SortOptions/>
        {/* product grid */}
        <ProductGrid products={products} loading={loading} error={error}/>
      </div>
    </div>
  )
}

export default CollectionPage
