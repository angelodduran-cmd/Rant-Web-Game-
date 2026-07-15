import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import EscenaInicio from "./game/EscenaInicio";
import EscenaJuego from "./game/EscenaJuego";

const Game = ({ onGameOver }) => {
  const gameContainerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameContainerRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: gameContainerRef.current.clientWidth,
      height: gameContainerRef.current.clientHeight,
      parent: gameContainerRef.current,
      backgroundColor: "#1c1917",
      physics: {
        default: "arcade",
        arcade: { debug: false },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        canvasStyle:
          "position: relative; width: 100%; height: 100%; display: block;",
      },

      scene: [EscenaInicio, EscenaJuego],
    };

    const juegoInstancia = new Phaser.Game(config);
    gameRef.current = juegoInstancia;

    juegoInstancia.events.on("GAME_OVER_EVENT", (puntuacionFinal) => {
      if (onGameOver) {
        onGameOver(puntuacionFinal);
      }
    });

    const handleResize = () => {
      if (gameRef.current && gameContainerRef.current) {
        gameRef.current.scale.resize(
          gameContainerRef.current.clientWidth,
          gameContainerRef.current.clientHeight,
        );
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, [onGameOver]);

  return (
    <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4">
      <div
        ref={gameContainerRef}
        className="w-full h-87.5 sm:h-112.5 md:h-125 lg:h-137.5 rounded-2xl overflow-hidden border-4 border-amber-900 shadow-lg shadow-amber-600 bg-stone-950 transition-all duration-300"
      />
    </div>
  );
};

export default Game;
