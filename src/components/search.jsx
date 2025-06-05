import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import products from '../data/products';

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { cartItems, addToCart, updateQuantity } = useCart();

  const getQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [query]);

  return (
    <div className="h-screen w-screen p-6">
      <h2 className="text-2xl font-semibold mb-4">Search Results for "{query}"</h2>

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const quantity = getQuantity(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-32 h-32 object-cover mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-2">₹{product.price}</p>

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
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-3 py-1 bg-yellow-800 text-white rounded hover:bg-yellow-700 transition"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-3 py-1 bg-yellow-800 text-white rounded hover:bg-yellow-700 transition"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Search;
