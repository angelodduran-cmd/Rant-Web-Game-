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
        this.puntuacionActual = 0;
        this.velocidadCicloGatos = 800;
        this.totalCasillasAPintar = this.FILAS * this.COLUMNAS;
        this.casillasPintadasContador = 0;
        this.vidas = 3;
        this.juegoTerminado = false;
        this.inmune = false;
    }

    preload() {}

    create() {
        const anchoMapa = this.COLUMNAS * this.TAMANO;
        const altoMapa = this.FILAS * this.TAMANO;
        
        this.offsetX = (this.cameras.main.width - anchoMapa) / 2 + this.TAMANO / 2;
        this.offsetY = (this.cameras.main.height - altoMapa) / 2 + this.TAMANO / 2;

        this.grupoCuadrícula = this.add.group();
        for (let r = 0; r < this.FILAS; r++) {
            for (let c = 0; c < this.COLUMNAS; c++) {
                let rectangulo = this.add.rectangle(
                    this.offsetX + (c * this.TAMANO) - this.TAMANO / 2, 
                    this.offsetY + (r * this.TAMANO) - this.TAMANO / 2, 
                    this.TAMANO - 5, 
                    this.TAMANO - 5, 
                    0x4a4a4a
                );
                rectangulo.setOrigin(0);
                rectangulo.setData('coordenadas', { r, c });
                this.grupoCuadrícula.add(rectangulo);
            }
        }

        this.raton = new Raton(this, 0, 0, null, this.TAMANO);
        this.raton.setOrigin(0.5);
        this.raton.sincronizarPosicion = () => {
            this.raton.x = this.offsetX + this.raton.columna * this.TAMANO;
            this.raton.y = this.offsetY + this.raton.fila * this.TAMANO;
        };
        this.raton.sincronizarPosicion();

        this.teclado = this.input.keyboard.createCursorKeys();

        this.pintarCasilla = (r, c) => {
            if (this.matrizTablero[r][c] === 0) {
                this.matrizTablero[r][c] = 1;
                this.casillasPintadasContador++;
                this.puntuacionActual += 10;
                this.grupoCuadrícula.getChildren().forEach(rect => {
                    const coords = rect.getData('coordenadas');
                    if (coords.r === r && coords.c === c) rect.setFillStyle(0x00aaff);
                });
                if (this.casillasPintadasContador === this.totalCasillasAPintar) this.reiniciarTableroInfinito();
            }
        };
        this.pintarCasilla(0, 0);

        const gatoBase = new Gato(this, this.FILAS - 1, this.COLUMNAS - 1, null, this.TAMANO, false);
        gatoBase.setOrigin(0.5);
        gatoBase.sincronizarPosicion = () => {
            gatoBase.x = this.offsetX + gatoBase.columna * this.TAMANO;
            gatoBase.y = this.offsetY + gatoBase.fila * this.TAMANO;
        };
        gatoBase.sincronizarPosicion();
        this.listaGatos.push(gatoBase);

        this.actualizarTemporizadorGatos();
        this.time.addEvent({ delay: 30000, callback: this.aparecerGatoTemporal, callbackScope: this, loop: true });
        this.game.events.on("INICIAR_PARTIDA", () => { this.estaPausado = false; });
    }

    actualizarTemporizadorGatos() {
        if (this.temporizadorGatos) this.temporizadorGatos.destroy();
        this.temporizadorGatos = this.time.addEvent({
            delay: this.velocidadCicloGatos,
            callback: () => {
                if (!this.estaPausado && !this.juegoTerminado) {
                    this.listaGatos.forEach(gato => gato.actualizarLogica(this.FILAS, this.COLUMNAS, this.raton.fila, this.raton.columna));
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    aparecerGatoTemporal() {
        if (this.estaPausado || this.juegoTerminado) return;
        const esquinas = [{ r: 0, c: this.COLUMNAS - 1 }, { r: this.FILAS - 1, c: 0 }, { r: this.FILAS - 1, c: this.COLUMNAS - 1 }];
        const esquinaElegida = esquinas[Phaser.Math.Between(0, esquinas.length - 1)];
        const gatoTemporal = new Gato(this, esquinaElegida.r, esquinaElegida.c, null, this.TAMANO, true);
        gatoTemporal.estaDespierto = true;
        gatoTemporal.setOrigin(0.5);
        gatoTemporal.sincronizarPosicion = () => {
            gatoTemporal.x = this.offsetX + gatoTemporal.columna * this.TAMANO;
            gatoTemporal.y = this.offsetY + gatoTemporal.fila * this.TAMANO;
        };
        gatoTemporal.sincronizarPosicion();
        this.listaGatos.push(gatoTemporal);
        this.cameras.main.flash(300, 239, 68, 68);
        this.time.delayedCall(12000, () => {
            this.listaGatos = this.listaGatos.filter(g => g !== gatoTemporal);
            gatoTemporal.destroy();
        });
    }

    reiniciarTableroInfinito() {
        if (this.velocidadCicloGatos > 300) {
            this.velocidadCicloGatos -= 70;
            this.actualizarTemporizadorGatos();
        }
        this.matrizTablero = Array.from({ length: this.FILAS }, () => Array(this.COLUMNAS).fill(0));
        this.casillasPintadasContador = 0;
        this.grupoCuadrícula.getChildren().forEach(rect => rect.setFillStyle(0x4a4a4a));
        this.pintarCasilla(this.raton.fila, this.raton.columna);
        this.cameras.main.flash(500, 252, 211, 77);
    }

    manejarColision() {
        if (this.inmune || this.juegoTerminado) return;
        this.vidas--;
        this.inmune = true;
        this.cameras.main.shake(200, 0.02);
        if (this.vidas > 0) {
            this.raton.setVisible(false);
            this.time.delayedCall(1000, () => {
                this.raton.moverA(0, 0, this.FILAS, this.COLUMNAS);
                this.raton.setVisible(true);
                this.inmune = false;
            });
        } else {
            this.juegoTerminado = true;
            this.game.events.emit("GAME_OVER_EVENT", this.puntuacionActual);
        }
    }

    update() {
        if (this.juegoTerminado || this.estaPausado) return;
        if (Phaser.Input.Keyboard.JustDown(this.teclado.up)) this.raton.moverA(this.raton.fila - 1, this.raton.columna, this.FILAS, this.COLUMNAS);
        else if (Phaser.Input.Keyboard.JustDown(this.teclado.down)) this.raton.moverA(this.raton.fila + 1, this.raton.columna, this.FILAS, this.COLUMNAS);
        else if (Phaser.Input.Keyboard.JustDown(this.teclado.left)) this.raton.moverA(this.raton.fila, this.raton.columna - 1, this.FILAS, this.COLUMNAS);
        else if (Phaser.Input.Keyboard.JustDown(this.teclado.right)) this.raton.moverA(this.raton.fila, this.raton.columna + 1, this.FILAS, this.COLUMNAS);
        this.listaGatos.forEach(gato => {
            if (this.raton.fila === gato.fila && this.raton.columna === gato.columna) this.manejarColision();
        });
    }
}
