import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

const Game = () => {
  // Referencia al contenedor HTML donde Phaser inyectará el lienzo (Canvas)
  const gameContainerRef = useRef(null);
  // Referencia para almacenar la instancia del juego y poder destruirla al desmontar
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameContainerRef.current) return;

    // Configuración mínima de Phaser adaptada para maquetación responsive
    const config = {
      type: Phaser.AUTO,
      // Usamos el ancho y alto del contenedor padre en React
      width: gameContainerRef.current.clientWidth,
      height: gameContainerRef.current.clientHeight,
      parent: gameContainerRef.current,
      backgroundColor: "#1e1b4b", // Fondo índigo oscuro (estilo retro/arcade)
      physics: {
        default: "arcade",
        arcade: { debug: false },
      },
      scale: {
        // Ajusta el lienzo automáticamente si el contenedor cambia de tamaño
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: {
        create: function () {
          // Texto central simulando el lienzo del juego
          this.add
            .text(
              this.cameras.main.centerX,
              this.cameras.main.centerY - 20,
              "🎮 ESPACIO DEL JUEGO (PHASER)",
              { font: "bold 24px Arial", fill: "#fcd34d" },
            )
            .setOrigin(0.5);

          this.add
            .text(
              this.cameras.main.centerX,
              this.cameras.main.centerY + 20,
              "Vista aérea: Gato y Ratón",
              { font: "16px Arial", fill: "#94a3b8" },
            )
            .setOrigin(0.5);

          // Crear un "Ratón" de prueba (un cuadrado blanco) para verificar físicas
          const mouseMock = this.add.rectangle(100, 100, 32, 32, 0xffffff);
          this.physics.add.existing(mouseMock);

          // Movimiento de prueba simple para ver que el lienzo está vivo
          if (mouseMock.body) {
            mouseMock.body.setVelocity(100, 50);
            mouseMock.body.setCollideWorldBounds(true);
            mouseMock.body.setBounce(1, 1);
          }
        },
      },
    };

    // Inicializamos la instancia de Phaser
    gameRef.current = new Phaser.Game(config);

    // Función para manejar el redimensionamiento si la ventana cambia de tamaño
    const handleResize = () => {
      if (gameRef.current && gameContainerRef.current) {
        gameRef.current.scale.resize(
          gameContainerRef.current.clientWidth,
          gameContainerRef.current.clientHeight,
        );
      }
    };

    window.addEventListener("resize", handleResize);

    // Limpieza crucial: destruye la instancia de Phaser cuando el usuario navega a otra pantalla
    return () => {
      window.removeEventListener("resize", handleResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return (
    /* 
      Este contenedor define el tamaño del juego en tu Landing Page.
      - En móviles (w-full h-[400px]): Ocupa todo el ancho y 400px de alto.
      - En pantallas grandes (lg:h-[550px] lg:max-w-4xl): Se expande de forma elegante.
      - Mantiene una estética arcade con bordes redondeados y sombra de Tailwind v4.
    */
    <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4">
      <div
        ref={gameContainerRef}
        className="w-full h-87.5 sm:h-112.5 md:h-125 lg:h-137.5 rounded-2xl overflow-hidden border-4 border-amber-900 shadow-2xl bg-slate-950 transition-all duration-300"
      />
    </div>
  );
};

export default Game;
