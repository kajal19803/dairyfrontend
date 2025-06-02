import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-64">
      {product.image && (
        <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold">{product.name}</h3>
        {product.description && <p className="text-gray-600 text-sm mt-1">{product.description}</p>}
        {product.price && <p className="text-green-700 font-semibold mt-2">{product.price}</p>}
      </div>
    </div>
  );
};

export default ProductCard;
