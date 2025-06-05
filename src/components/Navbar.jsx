import { useState, useEffect } from "react";
import { ShoppingCart, MoreHorizontal, X, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // Calculate total cart quantity
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check login status on mount
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
    setMenuOpen(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setShowSearch(false);
      if (menuOpen) setMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative z-50">
      {/* Left: Logo */}
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Uma Dairy
          </Link>
        </div>
      </div>

      {/* Center: Desktop Search Bar */}
      <div className="hidden md:flex flex-1 px-6">
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-1 rounded-md w-full bg-gray-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </div>

      {/* Right: Cart, Search (mobile), Login/Profile/Logout, Menu toggle */}
      <div className="flex items-center space-x-4">
        {/* Mobile Search Icon */}
        <div className="md:hidden">
          <button onClick={() => setShowSearch(!showSearch)} aria-label="Toggle search">
            <Search className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Cart Icon */}
        <div className="relative">
          <Link to="/cart" onClick={() => setMenuOpen(false)} aria-label="Cart">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
          </Link>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>

        {/* Desktop Auth Links */}
        <div className="hidden md:flex items-center space-x-4 font-medium text-gray-700">
          {!isLoggedIn && (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}
          {isLoggedIn && (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle (3 dots or X) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="ml-4 relative"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <MoreHorizontal className="w-6 h-6" />}
        </button>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-md rounded-md z-50 flex flex-col text-gray-700">
            <Link
              to="/"
              className="px-4 py-2 hover:bg-gray-100 border-b"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/features"
              className="px-4 py-2 hover:bg-gray-100 border-b"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/team"
              className="px-4 py-2 hover:bg-gray-100 border-b"
              onClick={() => setMenuOpen(false)}
            >
              Team
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 hover:bg-gray-100 border-b"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </Link>

            {!isLoggedIn && (
              <Link
                to="/login"
                className="px-4 py-2 hover:bg-gray-100 border-b"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}

            {isLoggedIn && (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 hover:bg-gray-100 border-b"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2 text-left hover:bg-gray-100 text-red-600 font-semibold"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Search Input */}
      {showSearch && (
        <div className="absolute top-full left-0 w-full bg-white p-4 shadow-md md:hidden">
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-2 w-full rounded-md bg-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            autoFocus
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;



