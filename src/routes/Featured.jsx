import React, { useState } from 'react';
import Casa from '../media/images/Inicio.webp';

const propiedades = [
    {
        id: 1,
        tipo: 'alquiler',
        titulo: 'Casa en alquiler en el centro',
        descripcion: '3 habitaciones, 2 baños, patio grande.',
        imagen: Casa,
        precio: '$120.000 ARS / mes',
        disponibleDesde: '2025-09-09',
    },
    {
        id: 2,
        tipo: 'alquiler',
        titulo: 'Departamento moderno en alquiler',
        descripcion: '2 ambientes, cocina integrada, balcón.',
        imagen: Casa,
        precio: '$85.000 ARS / mes',
        disponibleDesde: '2025-08-05',
    },
    {
        id: 3,
        tipo: 'alquiler',
        titulo: 'Casa con pileta en alquiler',
        descripcion: 'Amplio jardín y quincho, ideal para familia.',
        imagen: Casa,
        precio: '$150.000 ARS / mes',
        disponibleDesde: '2025-08-19',
    },
    {
        id: 4,
        tipo: 'venta',
        titulo: 'Casa a la venta en zona norte',
        descripcion: '3 habitaciones, cochera doble.',
        imagen: Casa,
        precio: '$120.000 USD',
    },
    {
        id: 5,
        tipo: 'venta',
        titulo: 'Departamento en venta',
        descripcion: '1 dormitorio, cocina y balcón al frente.',
        imagen: Casa,
        precio: '$75.000 USD',
    },
    {
        id: 6,
        tipo: 'venta',
        titulo: 'Casa moderna en barrio privado',
        descripcion: 'Pileta, jardín, parrilla, 2 pisos.',
        imagen: Casa,
        precio: '$190.000 USD',
    },
];

export const Featured = () => {
    const [tipoActivo, setTipoActivo] = useState('alquiler');

    const hoy = new Date();
    const filtradas = propiedades.filter((p) => p.tipo === tipoActivo);

    const formatoFecha = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <section className="bg-[#F5EFE6] py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <h2
                    className="text-2xl md:text-3xl font-semibold text-[#4E342E] mb-6"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                >
                    Propiedades destacadas
                </h2>

                {/* Botones de filtro */}
                <div className="flex gap-4 mb-10">
                    <button
                        onClick={() => setTipoActivo('alquiler')}
                        className={`px-4 py-2 uppercase font-medium border border-[#D7CCC8] text-sm transition-all duration-200
              ${tipoActivo === 'alquiler'
                                ? 'bg-[#4E342E] text-white'
                                : 'bg-white text-[#4E342E] hover:bg-[#E0D6CD]'}`}
                    >
                        Alquiler
                    </button>
                    <button
                        onClick={() => setTipoActivo('venta')}
                        className={`px-4 py-2 uppercase font-medium border border-[#D7CCC8] text-sm transition-all duration-200
              ${tipoActivo === 'venta'
                                ? 'bg-[#4E342E] text-white'
                                : 'bg-white text-[#4E342E] hover:bg-[#E0D6CD]'}`}
                    >
                        Venta
                    </button>
                </div>

                {/* Cards */}
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {filtradas.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white shadow-md border border-[#E0D6CD] p-4 flex flex-col relative"
                        >
                            {/* Imagen + badge */}
                            <div className="relative mb-4">
                                <img
                                    src={item.imagen}
                                    alt={item.titulo}
                                    className="w-full h-48 object-cover"
                                />

                                {/* Badge de disponibilidad */}
                                {item.tipo === 'alquiler' && item.disponibleDesde && (
                                    <div
                                        className={`absolute top-1 right-[-25px] px-3 py-1 text-xs font-bold uppercase text-white shadow-md ${new Date(item.disponibleDesde) <= hoy
                                                ? 'bg-green-700'
                                                : 'bg-yellow-600'
                                            }`}
                                        style={{ borderRadius: '0 0 0 0' }}
                                    >
                                        {new Date(item.disponibleDesde) <= hoy
                                            ? 'Disponible'
                                            : `Disponible desde ${formatoFecha(item.disponibleDesde)}`}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <h3
                                className="text-lg font-semibold text-[#4E342E] mb-1"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                {item.titulo}
                            </h3>
                            <p className="text-sm text-[#5D4037] flex-1">{item.descripcion}</p>
                            <p className="text-base font-medium text-[#4E342E] mt-4">
                                {item.precio}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
