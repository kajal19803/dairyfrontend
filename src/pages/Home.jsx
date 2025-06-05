import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const bgImages = [
  '/images/bg1.jpg',
  '/images/bg2.jpg',
  '/images/bg3.jpg',
];

const products = [
  {
    id: 1,
    name: 'Cow Dung Cakes (गोबर के उपले)',
    image: '/images/cow-dung.jpg',
    description: 'प्राकृतिक और जैविक रूप से तैयार किए गए गोबर के उपले...',
    price: '₹40 / 10 उपले',
  },
  {
    id: 2,
    name: 'Chhach (छाछ)',
    image: '/images/chhach.jpg',
    description: 'गर्मियों के लिए ताजगी से भरपूर छाछ...',
    price: '₹30 / लीटर',
  },
  {
    id: 3,
    name: 'Desi Ghee (घी)',
    image: '/images/ghee.jpg',
    description: 'शुद्ध देशी गाय के दूध से बना घी...',
    price: '₹900 / लीटर',
  },
];

const Home = () => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bgImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const handleIncrement = (productId) => {
    const currentQty = getQuantity(productId);
    updateQuantity(productId, currentQty + 1);
  };

  const handleDecrement = (productId) => {
    const currentQty = getQuantity(productId);
    if (currentQty > 1) updateQuantity(productId, currentQty - 1);
  };

  return (
    <motion.div
      className="pt-20 pb-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Slideshow */}
      <div className="relative h-[500px] sm:h-[600px] overflow-hidden mb-10">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute  w-screen h-screen inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImages[currentImageIndex]})` }}
        />
        <div className="absolute w-screen h-screen inset-0 bg-white/20 backdrop-blur-sm z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-yellow-900 px-4">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Welcome to Uma Dairy
          </motion.h1>
          <motion.p
            className="text-lg text-gray-700 max-w-xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            शुद्धता, परंपरा और भरोसे का संगम। देसी उत्पादों की दुनिया में आपका स्वागत है।
          </motion.p>
          <motion.button
            onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
            className="mt-8 px-6 py-3 bg-yellow-800 text-white rounded hover:bg-yellow-700 transition"
            whileHover={{ scale: 1.05 }}
          >
            Explore Products ↓
          </motion.button>
        </div>
      </div>

      {/* Cart Button */}
      {cartItems.length > 0 && (
        <div className="fixed top-4 right-4 z-50">
          <motion.button
            onClick={() => navigate('/cart')}
            className="bg-yellow-800 text-white px-4 py-2 rounded shadow hover:bg-yellow-700 transition"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            Go to Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
          </motion.button>
        </div>
      )}

      {/* Products */}
      <h2 className="text-3xl font-bold text-center mt-16 mb-6 text-yellow-900">
        हमारे ऑर्गेनिक प्रोडक्ट्स
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {products.map((product) => {
          const quantity = getQuantity(product.id);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: product.id * 0.1 }}
              className="  bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 border transform hover:scale-105"
            >
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-xl"
                whileHover={{ scale: 1.05, rotate: 1 }}
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-blue-700 mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-2">{product.description}</p>
                <p className="text-lg font-semibold text-green-800">{product.price}</p>

                {quantity === 0 ? (
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-3 px-4 py-2 bg-yellow-800 text-white rounded hover:bg-yellow-700 transition"
                  >
                    Add to cart
                  </button>
                ) : (
                  <div className="mt-3 flex items-center space-x-3">
                    <button
                      onClick={() => handleDecrement(product.id)}
                      className="px-3 py-1 bg-yellow-800 text-white rounded hover:bg-yellow-700 transition"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">{quantity}</span>
                    <button
                      onClick={() => handleIncrement(product.id)}
                      className="px-3 py-1 bg-yellow-800 text-white rounded hover:bg-yellow-700 transition"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* About */}
      <div className="mt-24 px-4 text-center">
        <h2 className="text-2xl font-bold text-yellow-900 mb-4">हमारे बारे में</h2>
        <p className="max-w-2xl mx-auto text-gray-700">
          Uma Dairy एक प्रयास है ग्रामीण भारत के पारंपरिक और शुद्ध उत्पादों को हर घर तक पहुँचाने का। हमारे उत्पाद देशी गायों के दूध और प्राकृतिक संसाधनों से बनाए जाते हैं, जो आपके स्वास्थ्य और परंपरा दोनों का ध्यान रखते हैं।
        </p>
      </div>

      {/* Testimonials */}
      <div className="mt-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-yellow-900 mb-4">हमारे ग्राहक क्या कहते हैं</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {['घी बहुत स्वादिष्ट है।', 'छाछ पीकर ठंडक मिलती है।', 'गोबर के उपले पूजा के लिए बढ़िया हैं।'].map((review, i) => (
            <motion.div
              key={i}
              className="bg-white shadow-md p-4 rounded-lg border"
              whileHover={{ scale: 1.03 }}
            >
              <p className="italic text-gray-600">“{review}”</p>
              <div className="text-sm text-yellow-800 mt-2">— संतुष्ट ग्राहक</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Footer */}
      <div className="mt-28 text-center px-4 py-12 bg-yellow-100">
        <h2 className="text-xl font-bold text-yellow-900 mb-4">आप भी हमारे उत्पाद आज़माएं!</h2>
        <button
          onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })} 
         // or simply do nothing on click if you want
          className="px-6 py-3 bg-yellow-800 text-white rounded hover:bg-yellow-700 transition"
        >
          view products
        </button>
      </div>
    </motion.div>
  );
};

export default Home;
