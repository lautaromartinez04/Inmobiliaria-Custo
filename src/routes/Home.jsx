import React from 'react';
import fondoCasa from '../media/images/Inicio.webp';
import { Featured } from './Featured';

export const Home = () => {
  return (
    <>
      <div
        className="relative min-h-[calc(100vh-80px)] bg-cover bg-center bg-no-repeat "
        style={{ backgroundImage: `url(${fondoCasa})` }}
      >
        {/* Texto superior izquierdo */}
        <div
          className="absolute top-10 left-6 md:top-16 md:left-20"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          <h2 className="text-3xl sm:text-2xl md:text-6xl text-[#4E342E] font-semibold text-shadow">
            Queremos que tu casa
          </h2>
        </div>

        {/* Texto inferior derecho */}
        <div
          className="absolute top-20 left-6 md:top-36 md:left-20 text-right"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          <h2 className="text-3xl sm:text-2xl md:text-6xl text-[#4E342E] font-semibold text-shadow">
            Sea tu hogar
          </h2>
        </div>
      </div>
      <Featured />

      <section className="bg-white py-16 px-6 text-[#4E342E]">
        <div className="max-w-7xl mx-auto grid gap-16 md:grid-cols-3">
          {/* Quiénes somos */}
          <div className="flex flex-col items-center text-center">
            <img
              src="https://img.freepik.com/vector-premium/icono-agente-inmobiliario-vector-hombre-negocios-casa_123447-14767.jpg"
              alt="Quiénes somos"
              className="w-24 h-24 mb-4 rounded-full shadow-md object-cover"
            />
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Quiénes somos
            </h3>
            <p className="text-sm">
              Somos una empresa dedicada a encontrar el hogar ideal para cada familia, combinando confianza y experiencia.
            </p>
          </div>

          {/* Dónde estamos */}
          <div className="flex flex-col items-center text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
              alt="Dónde estamos"
              className="w-24 h-24 mb-4 rounded-full shadow-md object-cover"
            />
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Dónde estamos
            </h3>
            <p className="text-sm">
              Nos encontramos en el corazón de la ciudad, cerca de todo lo que necesitás. Vení a visitarnos o contactanos online.
            </p>
          </div>

          {/* Objetivos */}
          <div className="flex flex-col items-center text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1973/1973803.png"
              alt="Nuestros objetivos"
              className="w-24 h-24 mb-4 rounded-full shadow-md object-cover"
            />
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Nuestros objetivos
            </h3>
            <p className="text-sm">
              Queremos ayudarte a cumplir el sueño de tu casa propia o el alquiler perfecto. Tu comodidad es nuestra prioridad.
            </p>
          </div>
        </div>
      </section>

    </>
  );
};
