import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="w-full bg-green-800 dark:bg-gray-900 text-white dark:text-gray-300 px-6 py-4">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
      <span className="text-sm text-gray-100 dark:text-gray-400">
        © 2025{' '}
        <a
          href="https://flowbite.com/"
          className="hover:underline font-semibold text-white dark:text-green-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          Uma Dairy
        </a>
        . All Rights Reserved.
      </span>
      <ul className="flex flex-wrap gap-x-6 text-sm text-gray-200 dark:text-gray-400 font-medium">
        <li>
          <Link to="/about" className="hover:text-white dark:hover:text-white">
            About
          </Link>
        </li>
        <li>
          <Link to="/privacy-policy" className="hover:text-white dark:hover:text-white">
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link to="/licensing" className="hover:text-white dark:hover:text-white">
            Licensing
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-white dark:hover:text-white">
            Contact
          </Link>
        </li>
      </ul>
    </div>
  </footer>
);

export default Footer;

