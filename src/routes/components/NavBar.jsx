import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const links = [
  { name: "Inicio", to: "/" },
  { name: "Alquileres", to: "/alquileres" },
  { name: "Ventas", to: "/ventas" },
  { name: "Admin", to: "/admin" },
  { name: "Contacto", to: "/contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 50) {
        setShowNavbar(false); // scroll hacia abajo
      } else {
        setShowNavbar(true); // scroll hacia arriba
      }
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-[#F3ECE7] text-[#4E342E] shadow-md transition-all duration-300 ease-in-out ${
        showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      <div className="mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Inmobiliaria Custo
        </h1>

        {/* Botón hamburguesa (solo mobile) */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menú escritorio */}
        <ul className="hidden md:flex space-x-6">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `font-semibold text-sm uppercase tracking-wide px-4 py-2 border-b-2 transition-all duration-150 ${
                    isActive
                      ? "border-[#8D6E63] text-[#4E342E]"
                      : "border-transparent text-[#5D4037] hover:border-[#BCAAA4]"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Menú mobile animado */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <ul className="px-6 pt-2 pb-4 space-y-3 bg-[#F3ECE7] shadow-inner">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block w-full font-semibold text-sm uppercase tracking-wide py-2 border-b transition-all duration-150 ${
                    isActive
                      ? "border-[#8D6E63] text-[#4E342E]"
                      : "border-transparent text-[#5D4037] hover:border-[#BCAAA4]"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
