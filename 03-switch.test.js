const diaDaSemana = require('./03-switch')

test(
    'dias da semana', () =>{
        expect(diaDaSemana(1)).toBe("Domingo");
        expect(diaDaSemana(2)).toBe("Segunda");
        expect(diaDaSemana(3)).toBe("Terça");
        expect(diaDaSemana(4)).toBe("Quarta");
        expect(diaDaSemana(5)).toBe("Quinta");
        expect(diaDaSemana(6)).toBe("Sexta");
        expect(diaDaSemana(7)).toBe("Sábado");
    }
)

test(
    'teste para dia inválido', () =>{
        expect(diaDaSemana(9)).toBe("Dia inválido");
        expect(diaDaSemana("abc")).toBe("Dia inválido");
    }
)