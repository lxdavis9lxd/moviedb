import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 w-full max-w-full">
      <ul className="flex w-full space-x-4">
        <li className="mr-auto">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
        </li>
        <li className="ml-auto">
          <Link to="/search" className="hover:text-gray-300">
           Search
          </Link>
        </li>
        <li className="ml-8">
          <Link to="" className="hover:text-gray-300">
           Sign In
          </Link>
        </li>
         {/* Add more navigation items as needed */}
      </ul>
    </nav>
  );
}

export default Navbar;