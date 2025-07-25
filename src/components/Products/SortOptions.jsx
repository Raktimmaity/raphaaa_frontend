import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy);
    setSearchParams(searchParams);
  }
  return (
    <div className='ml-6 mb-4 flex items-center justify-end'>
      <select onChange={handleSortChange} value={searchParams.get("sortBy") || ""} name="" id="sort" className='border p-2 rounded-md focus:outline-none bg-white'>
        <option value="">Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  )
}

export default SortOptions
