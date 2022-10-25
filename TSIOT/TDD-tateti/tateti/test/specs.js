
/*
    Pruebas propuestas:

    1) en un juego nuevo el tablero esta vacio y le toca mover al primer jugador
    2) al completar una casilla el jugador 1 el tablero tiene una casilla ocupada y ahora le toca al jugador 2
    3) al completar una casilla el jugador 2 el tablero tiene dos casilla ocupada y ahora le toca al jugador 1
    4) si le toca al jugador 1 y recibo un movimiento del jugador 2 no lo deberia aceptar y viceversa
    5) si tres filas tienen la misma marca de un jugador, gano la partida
    6) si tres columnas tienen la misma marca de un jugador, gano la partida
    7) si alguna diagonal tienen la misma marca de un jugador, gano la partida
    8) si no hay mas lugares vacios en el tablero es un empate
    9) si un jugador marca una casilla ocupada tiene un error y sigue su turno
*/

let chai = require("chai");
let chaihttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaihttp)

describe("Juego del Tateti", function() {
    describe("Se empieza un nuevo juego", async () => {
        let juego = {
            jugadores: ['Juan', 'Pedro']
        }

        it("Prueba", async () => {
            res = await chai.request(server).put("/empezar").send(juego);
            res.should.have.status(200)
            res.body.should.have.property('turno').eql('Juan')
        })

    })
})