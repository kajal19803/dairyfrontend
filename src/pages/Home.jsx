// Home.jsx
import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const bgImages = ['/images/bg1.jpg', '/images/bg2.jpg', '/images/bg3.jpg'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const Home = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bgImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = () => {
    navigate('/products');
  };

  return (
    <motion.div className="pt-20 pb-32" initial="hidden" animate="show" variants={containerVariants}>
      {/* Background Slideshow */}
      <div className="w-screen relative h-[500px] sm:h-[600px] overflow-hidden mb-10">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1 }}
          className="absolute w-screen h-screen inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImages[currentImageIndex]})` }}
        />
        <div className="absolute w-screen h-screen inset-0 bg-black/40 backdrop-blur-sm z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <motion.h1 className="text-4xl sm:text-5xl font-bold mb-4" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            Welcome to Uma Dairy
          </motion.h1>
          <motion.p className="text-lg text-gray-200 max-w-xl mx-auto" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            शुद्धता, परंपरा और भरोसे का संगम। देसी उत्पादों की दुनिया में आपका स्वागत है।
          </motion.p>
          <motion.button
            onClick={handleNavigate}
            className="mt-8 px-6 py-3 bg-yellow-800 text-white rounded hover:bg-yellow-700 transition flex items-center gap-2"
            whileHover={{ scale: 1.08 }}
          >
            <span>Explore Products</span> 
          </motion.button>
        </div>
      </div>

      {/* Cart Button */}
      {cartItems.length > 0 && (
        <motion.div className="fixed top-4 right-4 z-50" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <motion.button
            onClick={() => navigate('/cart')}
            className="bg-yellow-800 text-white px-4 py-2 rounded shadow hover:bg-yellow-700 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
          </motion.button>
        </motion.div>
      )}

      {/* About Section */}
      <motion.div className="mt-24 px-4 text-center" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <h2 className="text-2xl font-bold text-yellow-900 mb-4">हमारे बारे में</h2>
        <p className="max-w-2xl mx-auto text-gray-700">
          Uma Dairy एक प्रयास है ग्रामीण भारत के पारंपरिक और शुद्ध उत्पादों को हर घर तक पहुँचाने का। हमारे उत्पाद देशी गायों के दूध और प्राकृतिक संसाधनों से बनाए जाते हैं, जो आपके स्वास्थ्य और परंपरा दोनों का ध्यान रखते हैं।
        </p>
      </motion.div>

      {/* New English Section */}
      <motion.div className="mt-16 px-4 text-center" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <h2 className="text-2xl font-bold text-green-900 mb-4">About Our Local Business</h2>
        <p className="max-w-3xl mx-auto text-gray-700">
          Uma Dairy is a small-scale local business, where all products are made fresh at home by our family using traditional techniques. We strictly avoid any kind of adulteration or artificial additives. From pure cow ghee to natural buttermilk and handmade cow dung cakes – everything is crafted with care, hygiene, and authenticity. Support local, eat healthy, and experience purity like never before.
        </p>
      </motion.div>

      {/* Testimonials */}
      <motion.div className="mt-20 px-4 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <h2 className="text-2xl font-bold text-yellow-900 mb-4">हमारे ग्राहक क्या कहते हैं</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {['घी बहुत स्वादिष्ट है।', 'छाछ पीकर ठंडक मिलती है।', 'गोबर के उपले पूजा के लिए बढ़िया हैं।'].map((review, i) => (
            <motion.div key={i} className="bg-white shadow-md p-4 rounded-lg border hover:shadow-lg" whileHover={{ scale: 1.05 }}>
              <p className="italic text-gray-600">“{review}”</p>
              <div className="text-yellow-500 mt-2">⭐️⭐️⭐️⭐️⭐️</div>
              <div className="text-sm text-yellow-800 mt-1">— संतुष्ट ग्राहक</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Footer with Button */}
      <motion.div className="mt-28 text-center px-4 py-12 bg-yellow-100 rounded-xl shadow-inner" initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <h2 className="text-xl font-bold text-yellow-900 mb-4">आप भी हमारे उत्पाद आज़माएं!</h2>
        <motion.button
          onClick={handleNavigate}
          className="px-6 py-3 bg-green-700 text-white rounded hover:bg-green-800 transition flex items-center gap-2 mx-auto"
          whileHover={{ scale: 1.1 }}
        >
          View Products <span className="text-xl">🛒</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Home;
