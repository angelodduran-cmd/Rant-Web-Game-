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
          
            if (this.matrizTablero[r][c] === 0) {
                this.matrizTablero[r][c] = 1;
                this.casillasPintadasContador++;
                this.puntuacionActual += 10; 
                
                this.grupoCuadrícula.children.iterate(rect => {
                    const coords = rect.getData('coordenadas');
                    if (coords.r === r && coords.c === c) {
                        rect.setFillStyle(0x00aaff); 
                    }
                });

                
                if (this.casillasPintadasContador === this.totalCasillasAPintar) {
                    this.reiniciarTableroInfinito();
                }
            }
        };

        this.pintarCasilla(0, 0);

       
        const gatoBase = new Gato(this, this.FILAS - 1, this.COLUMNAS - 1, null, this.TAMANO, false);
        gatoBase.setOrigin(0.5);
        this.listaGatos.push(gatoBase);

        this.actualizarTemporizadorGatos();

      
        this.time.addEvent({
            delay: 30000,
            callback: this.aparecerGatoTemporal,
            callbackScope: this,
            loop: true
        });
    }

    actualizarTemporizadorGatos() {
        if (this.temporizadorGatos) this.temporizadorGatos.destroy();
        
        this.temporizadorGatos = this.time.addEvent({
            delay: this.velocidadCicloGatos,
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

   
    aparecerGatoTemporal() {
        if (this.estaPausado) return;

       
        const esquinas = [
            { r: 0, c: this.COLUMNAS - 1 },
            { r: this.FILAS - 1, c: 0 },
            { r: this.FILAS - 1, c: this.COLUMNAS - 1 }
        ];
        const esquinaElegida = esquinas[Phaser.Math.Between(0, esquinas.length - 1)];

        const gatoTemporal = new Gato(this, esquinaElegida.r, esquinaElegida.c, null, this.TAMANO, true);
        gatoTemporal.estaDespierto = true;
        gatoTemporal.setOrigin(0.5);
        
        this.listaGatos.push(gatoTemporal);

       
        this.cameras.main.flash(300, 239, 68, 68); 

        
        this.time.delayedCall(12000, () => {
            this.listaGatos = this.listaGatos.filter(g => g !== gatoTemporal);
            gatoTemporal.destroy(); // Lo elimina limpiamente de Phaser
        });
    }

    
    reiniciarTableroInfinito() {
        
        if (this.velocidadCicloGatos > 300) {
            this.velocidadCicloGatos -= 70; 
            this.actualizarTemporizadorGatos();
        }

        
        this.matrizTablero = Array.from({ length: this.FILAS }, () => Array(this.COLUMNAS).fill(0));
        this.casillasPintadasContador = 0;

        this.grupoCuadrícula.children.iterate(rect => {
            rect.setFillStyle(0x4a4a4a);
        });

       
        this.pintarCasilla(this.raton.fila, this.raton.columna);

        
        this.cameras.main.flash(500, 252, 211, 77);
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
