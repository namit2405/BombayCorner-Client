import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, suggestions, setSuggestions }}>
      {children}
    </SearchContext.Provider>
  );
};