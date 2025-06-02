import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // import cart context

const Navbar = () => {
  const { cartItems } = useCart(); // get cart items

  return (
    <>
      <nav className="w-full bg-white border-green-200 dark:bg-green-600">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <a
            href="https://flowbite.com"
            className="flex items-center space-x-4 rtl:space-x-reverse"
          >
            <img
              src="https://worldvectorlogo.com/logos/dairy-farm.svg"
              alt="Dairy Farm Logo"
              className="h-12"
            />

            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Uma dairy
            </span>
          </a>
          <div className="flex items-center space-x-8 rtl:space-x-reverse">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-100 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-gray-600 text-gray px-4 py-2 rounded-r-md hover:bg-white-100">
              Search
            </button>

            <Link
              to="/login"
              className="text-sm text-yellow-600 dark:text-yellow-500 hover:underline"
            >
              Login/Register
            </Link>

            {/* Cart icon with count */}
            <Link to="/cart" className="relative text-yellow-600 dark:text-yellow-500 hover:text-yellow-700">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"  // changed color for testing
                fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 5M7 13h10m-1 7a1 1 0 11-2 0 1 1 0 012 0zm-8 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
      <nav className="w-full bg-red-50 dark:bg-red-600">
        <div className="max-w-screen-xl px-4 py-3 mx-auto">
          <div className="flex items-center">
            <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-900 dark:text-white hover:underline"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-900 dark:text-white hover:underline">
                  Company
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-900 dark:text-white hover:underline">
                  Team
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-900 dark:text-white hover:underline">
                  Features
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
