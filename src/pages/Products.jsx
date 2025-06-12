import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const { cartItems } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        const initialIndexes = {};
        data.forEach(p => {
          initialIndexes[p._id] = 0;
        });
        setCurrentImageIndex(initialIndexes);
      })
      .catch(err => console.error('Failed to fetch products:', err));

    if (token) {
      fetch(`${BACKEND_BASE_URL}/api/auth/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          const ids = data.wishlist.map(p => p._id);
          setWishlistIds(ids);
        })
        .catch(err => console.error('Failed to fetch wishlist:', err));
    }
  }, []);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const productId = products[hoveredIndex]?._id;
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => {
          const newIndex = {
            ...prev,
            [productId]: (prev[productId] + 1) % products[hoveredIndex].images.length
          };
          return newIndex;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [hoveredIndex, products]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const toggleWishlist = async (e, productId) => {
    e.stopPropagation();
    if (!token) {
      navigate('/login');
      return;
    }

    const isInWishlist = wishlistIds.includes(productId);
    const url = `${BACKEND_BASE_URL}/api/auth/wishlist/${isInWishlist ? 'remove' : 'add'}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      const data = await res.json();
      if (res.ok) {
        setWishlistIds(data.wishlist.map(id => id.toString()));
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 && <p className="col-span-full text-center">No products available</p>}

        {products.map((product, index) => {
          const isWishlisted = wishlistIds.includes(product._id);
          const imageIndex = currentImageIndex[product._id] || 0;

          return (
            <div
              key={product._id}
              className="group bg-white shadow-md rounded-lg p-4 relative cursor-pointer hover:shadow-lg transition"
              onClick={() => handleProductClick(product._id)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Sliding image container */}
              <div className="relative h-40 w-full overflow-hidden rounded-md mb-4">
                <div
                  className="absolute top-0 left-0 h-full flex transition-transform duration-500"
                  style={{
                    transform: `translateX(-${imageIndex * 100}%)`,
                    width: `${product.images.length * 100}%`
                  }}
                >
                  {product.images.map((img, idx) => (
                    <div key={idx} className="h-full w-full flex-shrink-0">
                      <img
                        src={`${BACKEND_BASE_URL}${img}`}
                        alt={`Product ${idx}`}
                        className="h-full w-60 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile view: icon beside name */}
              <div className="flex justify-between items-center md:hidden">
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <div onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => toggleWishlist(e, product._id)}
                    className="text-red-500 text-xl"
                  >
                    {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
              </div>

              {/* Info block for desktop */}
              <div className="hidden md:block group-hover:hidden">
                <p className="text-sm text-gray-700">{product.name}</p>
                <p className="text-gray-600 text-sm">{product.category}</p>
                <p className="text-gray-600 text-sm">{product.unit}</p>
                <p className="text-gray-700 mb-2">
                  <span className="text-green-700 font-bold">₹{product.price}</span>
                  <span className="line-through text-sm text-gray-500 ml-2">₹{product.mrp}</span>
                  <span className="ml-2 text-sm text-red-600">({product.discount}% OFF)</span>
                </p>
              </div>

              {/* Desktop hover: minimal heart + Add to Wishlist */}
              <div
                onClick={(e) => toggleWishlist(e, product._id)}
                className="hidden md:flex group-hover:flex group-hover:opacity-100 opacity-0 transition-opacity duration-200 items-center justify-center gap-1 mt-2 text-red-500 font-medium text-sm cursor-pointer"
              >
                <span className="text-base">{isWishlisted ? <FaHeart /> : <FaRegHeart />}</span>
                <span>Add to Wishlist</span>
              </div>

              {/* Mobile full details */}
              <div className="md:hidden">
                <p className="text-gray-600 text-sm">{product.category}</p>
                <p className="text-gray-700 mb-2">
                  <span className="text-green-700 font-bold">₹{product.price}</span>
                  <span className="line-through text-sm text-gray-500 ml-2">₹{product.mrp}</span>
                  <span className="ml-2 text-sm text-red-600">({product.discount}% OFF)</span>
                </p>
                <p className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;


