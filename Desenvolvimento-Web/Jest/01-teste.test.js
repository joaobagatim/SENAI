const {soma, texto, multiplicacao} = require('./01-teste')

test(
    'testando a função soma', () => {
        expect(soma(1, 2)).toBe(3)
    }
)


test(
    'testando a função texto', () => {
        expect(texto("João")).toBe("Boa noite João em que posso te ajudar?")
    }
)

test(
    'testando a função multiplicacao', () => {
        expect(multiplicacao(2, 5)).toBe(10)
    }
)