import Phaser from "phaser";

export default class Personaje extends Phaser.GameObjects.Sprite {
    constructor(escena, fila, columna, textura, tamano) {
        super(escena, 150 + columna * tamano, 150 + fila * tamano, textura);
        
        if (this.constructor === Personaje) {
            throw new TypeError("No puedes instanciar la clase abstracta 'Personaje' directamente.");
        }

        this.escena = escena;
        this.fila = fila;
        this.columna = columna;
        this.tamano = tamano;

        this.escena.add.existing(this);
        this.escena.physics.add.existing(this);
    }

    actualizarLogica() {
        throw new Error("El método 'actualizarLogica()' debe ser implementado por la subclase.");
    }

    sincronizarPosicion() {
        this.x = 150 + this.columna * this.tamano;
        this.y = 150 + this.fila * this.tamano;
    }
}
