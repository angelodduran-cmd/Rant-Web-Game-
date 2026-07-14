import Phaser from "phaser";
import Personaje from "./Personaje";

export default class Gato extends Personaje {
    constructor(escena, fila, columna, textura, tamano, esCazador = false) {
        super(escena, fila, columna, textura, tamano);
        this.pasos = 0;
        this.esCazador = esCazador;
        this.estaDespierto = false;
    }

    actualizarLogica(maxFilas, maxColumnas, filaRaton, columnaRaton) {
        this.pasos++;
        
        if (this.pasos >= 10 && !this.estaDespierto) {
            this.estaDespierto = true;
        }

        if (this.estaDespierto && this.esCazador) {
            if (Math.random() > 0.5) {
                if (filaRaton !== this.fila) {
                    this.fila += (filaRaton > this.fila) ? 1 : -1;
                } else if (columnaRaton !== this.columna) {
                    this.columna += (columnaRaton > this.columna) ? 1 : -1;
                }
            } else {
                this.fila = Phaser.Math.Clamp(this.fila + Phaser.Math.Between(-1, 1), 0, maxFilas - 1);
                this.columna = Phaser.Math.Clamp(this.columna + Phaser.Math.Between(-1, 1), 0, maxColumnas - 1);
            }
        } else {
            this.fila = Phaser.Math.Clamp(this.fila + Phaser.Math.Between(-1, 1), 0, maxFilas - 1);
            this.columna = Phaser.Math.Clamp(this.columna + Phaser.Math.Between(-1, 1), 0, maxColumnas - 1);
        }

        this.sincronizarPosicion();
    }
}
