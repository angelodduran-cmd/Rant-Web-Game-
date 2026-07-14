import Phaser from "phaser";
import Raton from "./Raton";
import Gato from "./Gato";

export default class EscenaJuego extends Phaser.Scene {
    constructor() {
        super("EscenaJuego");
    }

    init() {
        this.FILAS = 6;
        this.COLUMNAS = 6;
        this.TAMANO = 70;
        this.matrizTablero = Array.from({ length: this.FILAS }, () => Array(this.COLUMNAS).fill(0));
        this.listaGatos = [];
        this.estaPausado = false;
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

        this.raton = new Raton(this, 0, 0, null, this.TAMANO);
        this.raton.setOrigin(0.5);

        this.teclado = this.input.keyboard.createCursorKeys();

        this.pintarCasilla = (r, c) => {
            this.matrizTablero[r][c] = 1;
            this.grupoCuadrícula.children.iterate(rect => {
                const coords = rect.getData('coordenadas');
                if (coords.r === r && coords.c === c) {
                    rect.setFillStyle(0x00aaff); 
                }
            });
        };

        this.pintarCasilla(0, 0);

        
        const gatoBase = new Gato(this, this.FILAS - 1, this.COLUMNAS - 1, null, this.TAMANO, false);
        gatoBase.setOrigin(0.5);
        this.listaGatos.push(gatoBase);

        
        this.temporizadorGatos = this.time.addEvent({
            delay: 800,
            callback: () => {
                if (!this.estaPausado) {
                    this.listaGatos.forEach(gato => {
                        gato.actualizarLogica(this.FILAS, this.COLUMNAS, this.raton.fila, this.raton.columna);
                    });
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.teclado.up)) {
            this.raton.moverA(this.raton.fila - 1, this.raton.columna, this.FILAS, this.COLUMNAS);
        } else if (Phaser.Input.Keyboard.JustDown(this.teclado.down)) {
            this.raton.moverA(this.raton.fila + 1, this.raton.columna, this.FILAS, this.COLUMNAS);
        } else if (Phaser.Input.Keyboard.JustDown(this.teclado.left)) {
            this.raton.moverA(this.raton.fila, this.raton.columna - 1, this.FILAS, this.COLUMNAS);
        } else if (Phaser.Input.Keyboard.JustDown(this.teclado.right)) {
            this.raton.moverA(this.raton.fila, this.raton.columna + 1, this.FILAS, this.COLUMNAS);
        }

       
        this.listaGatos.forEach(gato => {
            if (this.raton.fila === gato.fila && this.raton.columna === gato.columna) {
                console.log("¡El gato atrapó al ratón!");
            }
        });
    }
}
