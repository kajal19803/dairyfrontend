import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="w-full bg-green-800 text-white p-4 text-center">
    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
      © 2025{' '}
      <a href="https://flowbite.com/" className="hover:underline" target="_blank" rel="noopener noreferrer">
        Uma dairy
      </a>
      . All Rights Reserved.
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
      <li>
        <Link to="/about" className="hover:underline me-4 md:me-6">
          About
        </Link>
      </li>
      <li>
        {/* Agar future me Privacy Policy page banega to isse replace karna */}
        <a href="/privacy-policy" className="hover:underline me-4 md:me-6">
          Privacy Policy
        </a>
      </li>
      <li>
        {/* Agar future me Licensing page banega to isse replace karna */}
        <a href="/licensing" className="hover:underline me-4 md:me-6">
          Licensing
        </a>
      </li>
      <li>
        {/* Contact page link, aise hi rehne do ya React Router ka Link karo */}
        <Link to="/contact" className="hover:underline">
          Contact
        </Link>
      </li>
    </ul>
  </footer>
);

export default Footer;
