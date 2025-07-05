import React, { useEffect, useRef } from "react";
import api from "../axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/SearchBar.css";
import { useSearch } from "../SearchContext";

const SearchBar = () => {
  const { searchQuery, setSearchQuery, suggestions, setSuggestions } = useSearch();
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    setSearchQuery(search);
  }, [location.search, setSearchQuery]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim() === "") {
        setSuggestions([]);
        return;
      }
      try {
        const res = await api.get(
          `/products/search-suggestions/?q=${searchQuery}`
        );
        setSuggestions(res.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, setSuggestions]);

  const updateURLWithQuery = (newQuery) => {
    if (newQuery.trim() === "") {
      navigate(`/products`);
    } else {
      navigate(`/products?search=${encodeURIComponent(newQuery.trim())}`);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    updateURLWithQuery(searchQuery);
    setSuggestions([]);
  };

  const handleClear = () => {
    setSearchQuery("");
    updateURLWithQuery("");
    setSuggestions([]);
  };

  const handleSuggestionClick = (value) => {
    setSearchQuery(value);
    updateURLWithQuery(value);
    setSuggestions([]);
  };

  return (
    <div className="searchbar-wrapper ms-auto" style={{ position: "relative" }}>
      <div className="inputBox_container" style={{ display: "flex", alignItems: "center" }}>
        <input
          className="inputBox"
          type="text"
          placeholder="Search For Products"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        {searchQuery && (
          <i
            className="fa-solid fa-xmark fa-2x clear-icon"
            onClick={handleClear}
            aria-label="Clear search"
            style={{ cursor: "pointer", backgroundColor: "#3c4043", color: "white", padding: "0.1rem" }}
          />
        )}
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul
          className="suggestions-list"
          ref={suggestionsRef}
          style={{
            width: "100%",
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 999,
          }}
        >
          {suggestions.map((item, index) => (
            <li key={index} onClick={() => handleSuggestionClick(item.value)} className="suggestion-item">
              {item.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;