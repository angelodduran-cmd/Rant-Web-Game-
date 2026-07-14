import Phaser from "phaser";

export default class EscenaJuego extends Phaser.Scene {
    constructor() {
        super("EscenaJuego");
    }

    init() {
        this.FILAS = 6;
        this.COLUMNAS = 6;
        this.TAMANO = 70;
        this.matrizTablero = Array.from({ length: this.FILAS }, () => Array(this.COLUMNAS).fill(0));
    }

    preload() {
        
    }

    create() {
        this.grupoCuadrícula = this.add.group();

        for (let r = 0; r < this.FILAS; r++) {
            for (let c = 0; c < this.COLUMNAS; c++) {
                let rectangulo = this.add.rectangle(
                    150 + c * this.TAMANO, 
                    150 + r * this.TAMANO, 
                    this.TAMANO - 5, 
                    this.TAMANO - 5, 
                    0x4a4a4a
                );
                rectangulo.setData('coordenadas', { r, c });
                this.grupoCuadrícula.add(rectangulo);
            }
        }
    }

    update() {
        
    }
}
