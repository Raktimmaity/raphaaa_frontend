import React, { useState } from 'react'
import { HiMiniMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { fetchProductsByFilters, setFilters } from "../../redux/slices/productsSlice";

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSearchToggle = () => {
        setIsOpen(!isOpen);
    }
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() === '') {
            return;
        }
        // Handle search logic here, e.g., redirect to search results page
        // console.log('Searching for:', searchTerm);
        dispatch(setFilters({ search: searchTerm }));
        dispatch(fetchProductsByFilters({ search: searchTerm }));
        navigate(`/collections/all?search=${searchTerm}`);
        setSearchTerm('');
        setIsOpen(false); // Close the search bar after submitting
    }

  return (
    <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen ? 'absolute top-0 left-0 w-full bg-white h-24 z-50' : 'w-auto'} ease-in-out`}>
      {isOpen ?
      (<form onSubmit={handleSearch} className='relative flex items-center justify-center w-full'>
        <div className='relative w-1/2'>
            <input type="text" className='bg-gray-100 py-3 px-4 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700' placeholder='Search...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button type="submit" className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600 hover:text-white transition-colors duration-300'>
                <HiMiniMagnifyingGlass className='h-6 w-6' />
            </button>
        </div>
        {/* close icon */}
        <button type='button' onClick={handleSearchToggle} className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800'>
            <HiMiniXMark className='h-6 w-6 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 cursor-pointer'  />
        </button>
      </form>):(
        <button onClick={handleSearchToggle}>
            <HiMiniMagnifyingGlass className='h-6 w-6 '/>
        </button>
      )}
    </div>
  )
}

export default SearchBar
