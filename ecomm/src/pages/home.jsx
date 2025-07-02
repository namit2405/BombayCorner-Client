import React, { useRef, useState } from 'react';
import Banner from '../elements/Banner';
import Features from '../elements/Features';
import CategoryCard from '../elements/CategoryCard';
import TopProductCard from '../elements/TopProductCard';
import CategoryProductShowcase from '../elements/ProductsByCategories';
import Footer from '../elements/Footer';
const Home = () => {
  const productsRef = useRef(null); // 👈 create ref
  const [selectedCategory, setSelectedCategory] = useState(null); // 👈 for filtering

  const handleCategoryClick = (category) => {
    setSelectedCategory(category); // pass selected category
    productsRef.current?.scrollIntoView({ behavior: 'smooth' }); // scroll to section
  };
  return (
    <div>
      <Banner/>
      <Features/>
      <CategoryCard onCategoryClick={handleCategoryClick} />
      <TopProductCard/>
      <div ref={productsRef}>
        <CategoryProductShowcase selectedCategory={selectedCategory} />
      </div>
    </div>
  );
};

export default Home;
