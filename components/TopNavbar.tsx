"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faBook, faGamepad, faStore, faUsers, faUsersCog } from "@fortawesome/free-solid-svg-icons";

const TopNavbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement | null>(null);

  const handleToggleNavbar = () => {
    setShowNavbar((prev) => !prev);
  };

  const links = [
    { name: "Study", href: "/study", icon: faBook },
    { name: "Play", href: "/play", icon: faGamepad },
    { name: "Store", href: "/store", icon: faStore },
    { name: "Users", href: "/users", icon: faUsers },
    { name: "Team", href: "/team", icon: faUsersCog },
  ];

  return (
    <div className="z-50">
      {showNavbar ? (
        <nav
          ref={navRef}
          className="fixed top-2 left-1/2 transform -translate-x-1/2 bg-beige-300 text-gray-800 p-2 rounded-full flex items-center justify-center space-x-4 shadow-md transition-transform duration-300 fade-in"
        >
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.name}
              className={`px-4 py-2 rounded-full transition-colors duration-200 text-gray-800 hover-effect ${
                pathname === link.href || hoveredLink === link.href ? "bg-beige-600" : ""
              }`}
              onMouseEnter={() => setHoveredLink(link.href)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <FontAwesomeIcon icon={link.icon} className="mr-2" />
              {link.name}
            </Link>
          ))}
          <button
            onClick={handleToggleNavbar}
            className="ml-4 px-4 py-2 rounded-full"
          >
            <FontAwesomeIcon icon={faChevronUp} />
          </button>
        </nav>
      ) : (
        <button
          onClick={handleToggleNavbar}
          className="fixed left-1/2 transform -translate-x-1/2 bg-beige-300 text-gray-800 py-1 px-2 rounded-sm shadow-md transition-transform duration-300 fade-in"
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      )}
    </div>
  );
};

export default TopNavbar;
