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
        this.tiempoTranscurrido = 0;
    }

    preload() {
        this.load.image("hojaPersonajes", "/Sprite.png");
        this.load.image("fondoJuego", "/background.png");
        this.load.image("hojaCasillas", "/Casillas.png");
    }

    create() {
        let fondo = this.add.image(0, 0, "fondoJuego");
        fondo.setOrigin(0);
        fondo.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.textoPuntos = this.add.text(25, 20, "PUNTOS: 0", {
            fontFamily: "Arial Black",
            fontSize: "20px",
            fill: "#fbbf24"
        });

        this.textoTiempo = this.add.text(this.cameras.main.width - 175, 20, "TIEMPO: 0s", {
            fontFamily: "Arial Black",
            fontSize: "20px",
            fill: "#fef3c7"
        });

        this.temporizadorSegundos = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.estaPausado && !this.juegoTerminado) {
                    this.tiempoTranscurrido++;
                    this.textoTiempo.setText(`TIEMPO: ${this.tiempoTranscurrido}s`);
                }
            },
            callbackScope: this,
            loop: true
        });

        const texturaCasillas = this.textures.get("hojaCasillas");
        const anchoCasillas = texturaCasillas.getSourceImage().width;
        const altoCasillas = texturaCasillas.getSourceImage().height;
        this.textures.addSpriteSheet("texturaCasillas", texturaCasillas.getSourceImage(), {
            frameWidth: anchoCasillas / 2,
            frameHeight: altoCasillas
        });

        const texturaOriginal = this.textures.get("hojaPersonajes");
        const anchoImagen = texturaOriginal.getSourceImage().width;
        const altoImagen = texturaOriginal.getSourceImage().height;
        this.textures.addSpriteSheet("personajes", texturaOriginal.getSourceImage(), {
            frameWidth: anchoImagen / 4,
            frameHeight: altoImagen / 4
        });

        const anchoMapa = this.COLUMNAS * this.TAMANO;
        const altoMapa = this.FILAS * this.TAMANO;
        
        this.offsetX = (this.cameras.main.width - anchoMapa) / 2 + this.TAMANO / 2;
        this.offsetY = (this.cameras.main.height - altoMapa) / 2 + this.TAMANO / 2;

        this.grupoCuadrícula = this.add.group();
        for (let r = 0; r < this.FILAS; r++) {
            for (let c = 0; c < this.COLUMNAS; c++) {
                let casillaSprite = this.add.sprite(
                    this.offsetX + (c * this.TAMANO) - this.TAMANO / 2, 
                    this.offsetY + (r * this.TAMANO) - this.TAMANO / 2, 
                    "texturaCasillas"
                );
                casillaSprite.setOrigin(0);
                casillaSprite.setFrame(0);
                casillaSprite.setDisplaySize(this.TAMANO - 2, this.TAMANO - 2);
                casillaSprite.setData('coordenadas', { r, c });
                this.grupoCuadrícula.add(casillaSprite);
            }
        }

        this.raton = new Raton(this, 0, 0, "personajes", this.TAMANO);
        this.raton.setFrame(8);
        this.raton.setOrigin(0.5);
        this.raton.setDisplaySize(this.TAMANO - 10, this.TAMANO - 10);
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
                this.textoPuntos.setText(`PUNTOS: ${this.puntuacionActual}`);
                
                this.grupoCuadrícula.getChildren().forEach(casilla => {
                    const coords = casilla.getData('coordenadas');
                    if (coords.r === r && coords.c === c) casilla.setFrame(1);
                });
                if (this.casillasPintadasContador === this.totalCasillasAPintar) this.reiniciarTableroInfinito();
            }
        };
        this.pintarCasilla(0, 0);

        const gatoBase = new Gato(this, this.FILAS - 1, this.COLUMNAS - 1, "personajes", this.TAMANO, false);
        gatoBase.setFrame(0);
        gatoBase.setOrigin(0.5);
        gatoBase.setDisplaySize(this.TAMANO - 10, this.TAMANO - 10);
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
                    this.listaGatos.forEach(gato => {
                        const filaPrevia = gato.fila;
                        const colPrevia = gato.columna;
                        gato.actualizarLogica(this.FILAS, this.COLUMNAS, this.raton.fila, this.raton.columna);
                        const frameBase = gato.esCazador ? 2 : 0;
                        const frameOffsetLateral = gato.esCazador ? 2 : 4;
                        if (gato.fila > filaPrevia) gato.setFrame(frameBase);
                        else if (gato.fila < filaPrevia) gato.setFrame(frameBase + 1);
                        else if (gato.columna > colPrevia) gato.setFrame(frameOffsetLateral);
                        else if (gato.columna < colPrevia) gato.setFrame(frameOffsetLateral + 1);
                    });
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
        const gatoTemporal = new Gato(this, esquinaElegida.r, esquinaElegida.c, "personajes", this.TAMANO, true);
        gatoTemporal.setFrame(2);
        gatoTemporal.estaDespierto = true;
        gatoTemporal.setOrigin(0.5);
        gatoTemporal.setDisplaySize(this.TAMANO - 10, this.TAMANO - 10);
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
        this.grupoCuadrícula.getChildren().forEach(casilla => casilla.setFrame(0));
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
                this.raton.setFrame(8);
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
        if (Phaser.Input.Keyboard.JustDown(this.teclado.up)) {
            this.raton.moverA(this.raton.fila - 1, this.raton.columna, this.FILAS, this.COLUMNAS);
            this.raton.setFrame(9);
        } else if (Phaser.Input.Keyboard.JustDown(this.teclado.down)) {
            this.raton.moverA(this.raton.fila + 1, this.raton.columna, this.FILAS, this.COLUMNAS);
            this.raton.setFrame(8);
        } else if (Phaser.Input.Keyboard.JustDown(this.teclado.left)) {
            this.raton.moverA(this.raton.fila, this.raton.columna - 1, this.FILAS, this.COLUMNAS);
            this.raton.setFrame(13);
} else if (Phaser.Input.Keyboard.JustDown(this.teclado.right)) {this.raton.moverA(this.raton.fila, this.raton.columna + 1, this.FILAS, this.COLUMNAS);this.raton.setFrame(12);}this.listaGatos.forEach(gato => {if (this.raton.fila === gato.fila && this.raton.columna === gato.columna) this.manejarColision();});}}