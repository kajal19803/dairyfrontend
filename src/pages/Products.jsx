import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const { cartItems, addToCart, updateQuantity } = useCart();

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  const getQuantity = (productId) => {
    const item = cartItems.find((item) => item._id === productId);
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
    <div className="w-screen min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 && <p className="col-span-full text-center">No products available</p>}

        {products.map(product => {
          const quantity = getQuantity(product._id);

          return (
            <div key={product._id} className="bg-white shadow-md rounded-lg p-4">
              <img
                src={`${BACKEND_BASE_URL}${product.image}`}
                alt={product.name}
                className="h-40 w-full object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-1">{product.category}</p>
              <p className="text-gray-700 mb-2">
                <span className="text-green-700 font-bold">₹{product.price}</span>
                <span className="line-through text-sm text-gray-500 ml-2">₹{product.mrp}</span>
                <span className="ml-2 text-sm text-red-600">({product.discount}% OFF)</span>
              </p>
              <p className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>

              {quantity === 0 ? (
                <button
                  onClick={() => addToCart(product)}
                  className="mt-3 px-4 py-2 bg-yellow-800 text-white rounded hover:bg-yellow-700 transition"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="mt-3 flex items-center space-x-3">
                  <button
                    onClick={() => handleDecrement(product._id)}
                    className="px-3 py-1 bg-yellow-800 text-white rounded hover:bg-yellow-700 transition"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleIncrement(product._id)}
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
    </div>
  );
};

export default Products;
