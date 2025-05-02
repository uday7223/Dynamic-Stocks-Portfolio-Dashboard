// components/Navbar.js
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className=" bg-gray-900 shadow-md py-4">
      <div className="container m-auto flex justify-between items-center px-4">
        {/* Logo or Title */}
        <div className="text-xl font-semibold text-white">
          <Link href="/">
            Dynamic Portfolio Dashboard
          </Link>
        </div>

        {/* Navbar Links */}
        {/* <div className="space-x-6">
          <Link href="/home">
            <p className="text-gray-600 hover:text-blue-500 transition duration-300">Home</p>
          </Link>
          <Link href="/portfolio">
            <p className="text-gray-600 hover:text-blue-500 transition duration-300">Portfolio</p>
          </Link>
          <Link href="/about">
            <p className="text-gray-600 hover:text-blue-500 transition duration-300">About</p>
          </Link>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
