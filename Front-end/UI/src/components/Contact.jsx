import React from "react";

const Contact = () => {
  return (
    <div className="w-full flex flex-col items-center gap-6 text-amber-100/90 selection:bg-amber-300 selection:text-amber-950">
      <h2 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-linear-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-center">
        CONTACTO
      </h2>

      <div className="w-full flex flex-col gap-4 bg-stone-950/40 border-2 border-amber-900/40 p-5 rounded-2xl shadow-inner shadow-black/40">
        <div className="flex flex-col gap-2 items-center text-center">
          <span className="text-xs font-bold tracking-widest text-amber-400/60 uppercase">
            Desarrolladores
          </span>
          <p className="text-xl font-extrabold text-amber-200 tracking-wide hover:text-amber-300 transition duration-150">
            Roxana León
          </p>
          <p className="text-xl font-extrabold text-amber-200 tracking-wide hover:text-amber-300 transition duration-150">
            Angelo Durán
          </p>
          <p className="text-xl font-extrabold text-amber-200 tracking-wide hover:text-amber-300 transition duration-150">
            Keyner Galíndez
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-amber-100/40 font-mono mt-1">
        <span>Rant Web Game © 2026</span>
      </div>
    </div>
  );
};

export default Contact;
