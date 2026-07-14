import React, { useEffect, useState } from "react";
import Logo from "/Logo.png";
import Game from "../components/Game";
import { GetScore, SaveScore } from "../components/API";
import Qbert from "/Qbert.png";
import { url } from "../components/API";
import Contact from "../components/Contact";
import { AnimatePresence } from "motion/react";
import Modal from "../components/Modal";

import { useNavigate } from "react-router-dom";

const Home = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [user, setUser] = useState("Player");
  const [foto, setFoto] = useState("");
  const [contacto, setContacto] = useState(false);

  const navi = useNavigate();

  const loadGameData = async () => {
    try {
      const { data } = await GetScore();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error al conectar con la API de puntuaciones:", error);

      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        localStorage.clear();
        navi("/Login");
      }
    }
  };

  useEffect(() => {
    const usuario = localStorage.getItem("username");
    const token = localStorage.getItem("token-access");

    if (!usuario || !token) {
      navi("/Login");
      return;
    }

    setUser(usuario);
    const photo = localStorage.getItem("image");
    if (photo) setFoto(`${url}${photo}`);

    loadGameData();
  }, [navi]);

  const handleGameOver = async (puntuacionFinal) => {
    try {
      await SaveScore({ score: puntuacionFinal });
      loadGameData();
    } catch (error) {
      console.error("Error al registrar el récord en el servidor:", error);
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/Login");
      }
    }
  };

  return (
    <>
      <div
        className={`min-h-screen bg-linear-to-b from-stone-950 via-amber-950 to-stone-950 font-sans text-amber-100/90 selection:bg-amber-300 selection:text-amber-950 ${contacto ? "blur-2xl pointer-events-none" : ""}`}
      >
        <header
          id="Header"
          className="w-full flex items-center justify-between px-6 py-4 border-b-2 border-amber-900/50 bg-stone-950/80 backdrop-blur-md sticky top-0 z-50"
        >
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="Rant Logo"
              className="w-14 h-14 object-contain bg-amber-950/40 p-1 rounded-xl border border-amber-600/30 shadow-md shadow-amber-600/10"
            />
            <span className="hidden lg:block text-2xl font-black tracking-wider text-transparent bg-clip-text bg-linear-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              RANT
            </span>
          </div>

          <div
            id="Contact and user-information"
            className="flex items-center gap-6"
          >
            <button
              className="text-sm font-semibold tracking-wide text-amber-200/80 hover:text-amber-300 transition duration-200 px-4 py-2 rounded-full border border-amber-700/60 bg-amber-950/50 hover:bg-amber-900/40 active:scale-95"
              onClick={() => setContacto(true)}
            >
              Contact
            </button>

            <div className="flex items-center gap-3 bg-stone-900/60 border border-amber-900/50 pl-4 pr-2 py-1.5 rounded-full shadow-inner">
              <span className="text-sm font-bold text-amber-100/80 tracking-wide">
                {user}
              </span>
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-600 bg-amber-950/60 shadow-sm flex items-center justify-center text-lg">
                {foto ? (
                  <img
                    src={foto}
                    alt={user}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "📷"
                )}
              </div>
            </div>
          </div>
        </header>

        <main
          id="Body"
          className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-12 items-center"
        >
          <section className="w-full flex justify-center drop-shadow-[0_10px_15px_rgba(0,0,0,0.7)]">
            <Game onGameOver={handleGameOver} />
          </section>

          <section
            id="Game's information-block"
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-4"
          >
            <div
              id="Champions list"
              className="flex flex-col gap-5 bg-stone-900/40 border-2 border-amber-900/40 p-6 rounded-2xl shadow-2xl backdrop-blur-sm h-100"
            >
              <h2 className="text-2xl font-extrabold text-amber-300 border-b border-amber-900/40 pb-3 flex items-center gap-2">
                🏆 Clasificaciones Top 10
              </h2>
              <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar flex flex-col gap-2">
                {leaderboard.length > 0 ? (
                  leaderboard.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-stone-950/50 border border-amber-900/30 rounded-xl hover:bg-amber-950/40 transition duration-150 group"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 text-center font-black ${index === 0 ? "text-amber-400 text-lg" : index === 1 ? "text-slate-300" : index === 2 ? "text-amber-600" : "text-amber-100/40"}`}
                        >
                          {index + 1}
                        </span>
                        <span className="font-bold text-amber-100/80 group-hover:text-amber-200">
                          {item.user}
                        </span>
                      </div>
                      <span className="font-mono font-black text-amber-300 bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-800/40">
                        {item.score} pts
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 gap-2 text-amber-100/40 py-10">
                    <span className="text-amber-200/30">
                      No hay puntajes registrados aún
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div
              id="Resena historica Qbert"
              className="flex flex-col gap-5 bg-stone-900/40 border-2 border-amber-900/40 p-6 rounded-2xl shadow-2xl backdrop-blur-sm h-100"
            >
              <h2 className="text-2xl font-extrabold text-amber-300 border-b border-amber-900/40 pb-3 flex items-center gap-2">
                🕹️ Antecedentes: Q*bert
              </h2>
              <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar text-amber-100/70 text-sm leading-relaxed text-justify space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                  <img
                    src={Qbert}
                    alt="Q*bert Arcade"
                    className="w-24 h-24 object-contain bg-amber-950/40 border border-amber-700/30 p-1.5 rounded-xl float-left shadow-md"
                  />
                  <p>
                    Lanzado en 1982 por la compañía Gottlieb, Q*bert es uno de
                    los videojuegos más icónicos y memorables de la era dorada
                    del arcade. Diseñado por Warren Davis y Jeff Lee, el juego
                    revolucionó las salas de juego gracias a su innovadora
                    perspectiva isométrica en tres dimensiones y a un
                    carismático protagonista que cautivó al público.
                  </p>
                </div>
                <p>
                  La mecánica consiste en guiar a una criatura naranja con
                  trompa a través de una pirámide de 28 cubos tridimensionales,
                  con el objetivo de cambiar el color de sus caras superiores al
                  saltar sobre ellos. La tarea se vuelve progresivamente difícil
                  debido a un esquema de control diagonal único y a la aparición
                  de enemigos memorables como la serpiente morada Coily, las
                  criaturas Ugg y WrongWay, o los molestos Slick y Sam, quienes
                  revierten los colores ya pintados.
                </p>
                <p>
                  La mecánica del juego original ha trascendido generaciones,
                  sirviendo de inspiración directa para este nuevo título de
                  vista aérea que estás desarrollando.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <AnimatePresence>
        {contacto && (
          <Modal isOpen={contacto} onClose={() => setContacto(false)}>
            <Contact onClose={() => setContacto(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default Home;
