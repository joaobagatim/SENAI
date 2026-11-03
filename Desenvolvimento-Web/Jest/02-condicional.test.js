const resultado = require('./02-condicional')

test(
    'test para aprovado', () => {
        expect(resultado(8)).toBe("Aprovado")
    }
)

test(
    'test para recuperação', () => {
        expect(resultado(5)).toBe("Recuperação")
    }
)

test(
    'test para reprovado', () => {
        expect(resultado(3)).toBe("Reprovado")
    }
)