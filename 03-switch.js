const prompt = require('prompt-sync')();

const num = Number(prompt("Digite um número: "))

function diaDaSemana() {
    let resultado;

    switch (num) {
        case 1: resultado = "Domingo";
            break;
        case 2: resultado = "Segunda";
            break;
        case 3: resultado = "Terça";
            break;
        case 4: resultado = "Quarta";
            break;
        case 5: resultado = "Quinta";
            break;
        case 6: resultado = "Sexta";
            break;
        case 7: resultado = "Sábado";
            break;
        default:
            resultado = "Dia inválido"
    }

    return resultado;
}

module.exports = diaDaSemana