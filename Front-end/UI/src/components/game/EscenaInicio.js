import Phaser from "phaser";

export default class EscenaInicio extends Phaser.Scene {
    constructor() {
        super("EscenaInicio");
    }

    preload() {
        
    }

    create() {
        const centroX = this.cameras.main.centerX;
        const centroY = this.cameras.main.centerY;

        this.add.text(centroX, centroY - 80, "RANT", {
            fontFamily: "Arial Black",
            fontSize: "64px",
            fill: "#fcd34d"
        }).setOrigin(0.5).setShadow(0, 4, "#78350f", 4, true, true);

        this.add.text(centroX, centroY - 10, "¡Evita a los gatos y pinta el tablero!", {
            fontFamily: "Arial",
            fontSize: "18px",
            fill: "#fef3c7"
        }).setOrigin(0.5);

        let botonStart = this.add.text(centroX, centroY + 80, "PRESIONA ENTER O CLIC PARA JUGAR", {
            fontFamily: "Arial",
            fontSize: "22px",
            fontWeight: "bold",
            fill: "#1c1917",
            backgroundColor: "#fbbf24",
            padding: { x: 20, y: 12 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        botonStart.on("pointerover", () => botonStart.setBackgroundColor("#f59e0b"));
        botonStart.on("pointerout", () => botonStart.setBackgroundColor("#fbbf24"));
        
        const iniciarJuego = () => {
            this.scene.start("EscenaJuego");
        };

        botonStart.on("pointerdown", iniciarJuego);
        this.input.keyboard.once("keydown-ENTER", iniciarJuego);
        this.input.keyboard.once("keydown-SPACE", iniciarJuego);
    }
}
