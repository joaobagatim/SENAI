// 1 – Crie uma função que aceite um número como parâmetro de forma que possa retornar no console.log, se este número é par ou ímpar. Utilize a condicional para essa verificação.

function verificarParOuImpar(numero) {
    if (numero % 2 === 0) {
        console.log(`${numero} é par`);
    } else {
        console.log(`${numero} é ímpar`);
    }
}

verificarParOuImpar(7);  // Saída: 7 é ímpar
verificarParOuImpar(12); // Saída: 12 é par
