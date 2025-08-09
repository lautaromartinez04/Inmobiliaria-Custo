import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './routes/components/NavBar';
import { Home } from './routes/Home';

export const App = () => {
  return (
    <>
      <NavBar />

      {/* Contenedor general con padding para no quedar debajo del navbar */}
      <main className="pt-[64px]">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Agregá más rutas aquí si las necesitás */}
        </Routes>
      </main>
    </>
  );
};
