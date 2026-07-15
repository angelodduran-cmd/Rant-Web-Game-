import Phaser from "phaser";

export default class EscenaInicio extends Phaser.Scene {
    constructor() {
        super("EscenaInicio");
    }

    preload() {
        this.load.image("portadaJuego", "/portada.png");
        this.load.image("imgBotonStart", "/boton_start.png");
    }

    create() {
        const centroX = this.cameras.main.centerX;
        const centroY = this.cameras.main.centerY;

        let portada = this.add.image(centroX, centroY, "portadaJuego");
        portada.setOrigin(0.5);
        portada.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        let botonStart = this.add.image(centroX, this.cameras.main.height - 80, "imgBotonStart");
        botonStart.setOrigin(0.5);
        
        botonStart.setDisplaySize(240, 120);
        botonStart.setInteractive({ useHandCursor: true });

        botonStart.on("pointerover", () => {
            botonStart.setDisplaySize(252, 126);
        });
        
        botonStart.on("pointerout", () => {
            botonStart.setDisplaySize(240, 120);
        });

        this.tweens.add({
            targets: botonStart,
            alpha: 0.4,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        const iniciarJuego = () => {
            this.scene.start("EscenaJuego");
        };

        botonStart.on("pointerdown", iniciarJuego);
        this.input.keyboard.once("keydown-ENTER", iniciarJuego);
        this.input.keyboard.once("keydown-SPACE", iniciarJuego);
    }
}
