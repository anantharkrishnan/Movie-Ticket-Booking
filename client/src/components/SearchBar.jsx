import React from "react";

const SearchBar = ({ search, setSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search movies..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border w-50 p-1 h-10 ms-7 mt-1.5  text-white rounded "
    />
  );
};

export default SearchBar;

