import React, { useState, useEffect } from 'react';

const images = [
  "https://res.cloudinary.com/dudvgpaxt/image/upload/v1763129383/HD-wallpaper-avatar-fire-and-ash-2025-newest-films-poster_yinmnm.jpg",
  "https://res.cloudinary.com/dudvgpaxt/image/upload/v1763129098/kaantha_ssacpw.avif",
  "https://res.cloudinary.com/dudvgpaxt/image/upload/v1763129231/1321464_tjgrjc.jpg",
  "https://res.cloudinary.com/dudvgpaxt/image/upload/v1763716241/Bha.-Bha.-Ba._Cover-764cf6d0-b3c5-11f0-b4fa-4d356c15f815_ftxahz.jpg",
  "https://res.cloudinary.com/dudvgpaxt/image/upload/v1763716525/AAAAQU4tXq0f6Rlo25wkcOy8mmsuCO9xV5t9MQHvUbIsuTNaFkYbRH0qtnJyjf40j0yHAcJhvKGzLEysN8glvbjEOSEARK07cED-mSMsaGsZmRmN8g2msWF0wFLU_F72Dcc-YGkO8KVs8-ln35qgWcYJvSXU--4_jakzng.jpg"
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[1300px] mx-auto mt-10 overflow-hidden rounded-3xl">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`slide-${index}`}
            className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] object-cover shrink-0"
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
