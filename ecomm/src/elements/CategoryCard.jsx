import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/CategoriesCard.css";

const CategoriesCard = ({ onCategoryClick }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/categories/");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="categories-section">
      <h2 className="categories-title">Categories</h2>
      {categories.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {categories.map((category, index) => (
            <SwiperSlide key={category.id}>
              <motion.div
                onClick={() => onCategoryClick(category.name)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="category-card"
              >
                <div className="category-card-img-wrapper">
                  {category.first_product_image_url ? (
                    <img
                      src={category.first_product_image_url}
                      alt={category.name}
                      className="category-card-img"
                    />
                  ) : (
                    <div className="category-card-noimg">No Image</div>
                  )}
                </div>
                <h3 className="category-card-name">{category.name}</h3>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="categories-empty">No categories available.</p>
      )}
    </section>
  );
};

export default CategoriesCard;
