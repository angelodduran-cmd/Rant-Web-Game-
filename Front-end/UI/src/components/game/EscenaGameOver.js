import Phaser from "phaser";

export default class EscenaGameOver extends Phaser.Scene {
    constructor() {
        super("EscenaGameOver");
    }

    init(datos) {
        this.puntosFinales = datos.puntos || 0;
    }

    create() {
        const centroX = this.cameras.main.centerX;
        const centroY = this.cameras.main.centerY;

        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x1c1917, 0.85).setOrigin(0);

        this.add.text(centroX, centroY - 80, "GAME OVER", {
            fontFamily: "Arial Black",
            fontSize: "56px",
            fill: "#ef4444"
        }).setOrigin(0.5).setShadow(0, 4, "#7f1d1d", 4, true, true);

        this.add.text(centroX, centroY + 10, `PUNTUACIÓN FINAL: ${this.puntosFinales} PTS`, {
            fontFamily: "Arial Black",
            fontSize: "24px",
            fill: "#fbbf24"
        }).setOrigin(0.5);

        let botonReiniciar = this.add.text(centroX, centroY + 100, "PRESIONA ENTER O CLIC PARA REINTENTAR", {
            fontFamily: "Arial",
            fontSize: "18px",
            fontWeight: "bold",
            fill: "#1c1917",
            backgroundColor: "#fbbf24",
            padding: { x: 16, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        botonReiniciar.on("pointerover", () => botonReiniciar.setBackgroundColor("#f59e0b"));
        botonReiniciar.on("pointerout", () => botonReiniciar.setBackgroundColor("#fbbf24"));

        const reiniciarPartida = () => {
            this.scene.start("EscenaJuego");
        };

        botonReiniciar.on("pointerdown", reiniciarPartida);
        this.input.keyboard.once("keydown-ENTER", reiniciarPartida);
        this.input.keyboard.once("keydown-SPACE", reiniciarPartida);
    }
}
