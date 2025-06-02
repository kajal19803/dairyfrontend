import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Cow Dung Cakes (गोबर के उपले)',
    image: '/images/cow-dung.jpg',
    description:
      'प्राकृतिक और जैविक रूप से तैयार किए गए गोबर के उपले, धार्मिक कार्यों, हवन, और प्राकृतिक खाद के रूप में उपयोगी।',
    price: '₹40 / 10 उपले',
  },
  {
    id: 2,
    name: 'Chhach (छाछ)',
    image: '/images/chhach.jpg',
    description:
      'गर्मियों के लिए ताजगी से भरपूर छाछ, देशी गाय के दूध से तैयार की गई। यह पाचन को बेहतर बनाती है और शरीर को ठंडक देती है।',
    price: '₹30 / लीटर',
  },
  {
    id: 3,
    name: 'Desi Ghee (घी)',
    image: '/images/ghee.jpg',
    description:
      'शुद्ध देशी गाय के दूध से बना घी, पारंपरिक बिलौना विधि से तैयार किया गया। इसमें उच्च गुणवत्ता और आयुर्वेदिक लाभ होते हैं।',
    price: '₹900 / लीटर',
  },
];

const Home = () => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();

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
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    } else {
      // Agar quantity 1 hai, toh 0 karne se hata dena hai — toh cart me se remove karna padega.
      // Aap chahe toh removeFromCart bhi context me add kar sakte ho, ya yahan handle kar sakte ho.
      // Filhal hum yahi rakhenge, quantity 1 se neeche nahi jaayegi.
    }
  };

  return (
    <div className="pt-32 pb-32 p-4">
      {cartItems.length > 0 && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => navigate('/cart')}
            className="bg-yellow-800 text-white px-4 py-2 rounded shadow hover:bg-yellow-700 transition"
          >
            Go to Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-6 text-yellow-900">
        हमारे ऑर्गेनिक प्रोडक्ट्स
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const quantity = getQuantity(product.id);
          return (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 border transform hover:scale-105"
            >
              <img
                src={product.image}
                alt={`Image of ${product.name}`}
                loading="lazy"
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-blue-700 mb-2">{product.name}</h2>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;





