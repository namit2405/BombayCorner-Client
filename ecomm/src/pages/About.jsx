import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../styles/About.css";

// Import your images
import Img1 from "../assets/image1.avif";
import Img2 from "../assets/image2.avif";
import Img3 from "../assets/image3.avif";

const About = () => {
  const yearsInBusiness = new Date().getFullYear() - 1958;

  return (
    <section className="about-us">
      <div className="about-carousel">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          className="about-swiper"
        >
          <SwiperSlide>
            <img src={Img1} alt="Shop View" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Img2} alt="Cosmetics Shelf" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Img3} alt="Customer Interaction" />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* About Text */}
      <div className="aboutus-content">
        <h2>About Us</h2>
        <p>
          Welcome to our cosmetics haven in <strong>Attari Bazar, Jalandhar</strong>,
          where tradition meets beauty. We have been proudly serving our customers with the finest
          quality beauty and skincare products since <strong>1958</strong>.
        </p>
        <p>
          With over <strong>67 years</strong> of legacy, our shop has become a name of trust, reputation,
          and customer-first values. From timeless essentials to trending collections,
          we ensure that every product on our shelf is handpicked with care and
          tested for authenticity.
        </p>
        <p>
          Thank you for being a part of our journey. Let’s continue celebrating beauty — together!
        </p>
      </div>
    </section>
  );
};

export default About;
