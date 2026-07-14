import Personaje from "./Personaje";

export default class Raton extends Personaje {
    constructor(escena, fila, columna, textura, tamano) {
        super(escena, fila, columna, textura, tamano);
    }

    actualizarLogica() {
    }

    moverA(nuevaFila, nuevaColumna, maxFilas, maxColumnas) {
        if (nuevaFila >= 0 && nuevaFila < maxFilas && nuevaColumna >= 0 && nuevaColumna < maxColumnas) {
            this.fila = nuevaFila;
            this.columna = nuevaColumna;
            this.sincronizarPosicion();
            this.escena.pintarCasilla(this.fila, this.columna);
        }
    }
}
