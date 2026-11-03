// Crie duas variável que seja um array de objeto que tenha os seguintes pares: chave e valor
// - nome
// - idade
// - altura
// Imprimir a soma das idades das variáveis, fazer a média da idade, verificar se a pessoa irá ser aprovada dentro das condições a seguir: idade >= 15 e altura >= 1.80
// Se for positivo será "goleiro" : "jogador"

const pessoa1 = {
    nome: "João",
    idade: 23,
    altura: 1.81
}

const pessoa2 = {
    nome: "Victor",
    idade: 10,
    altura: 1.77
}

//Soma de idade
const somaIdade = (pessoa1.idade + pessoa2.idade);
console.log(`A soma da idade das pessoas é: ${somaIdade}`);

//Media de idade
const mediaIdade = (somaIdade) / 2;
console.log(`A média da idade é: ${mediaIdade}`);

//Goleiro ou Jogador
const posicao1 = pessoa1.idade>=15 && pessoa1.altura>=1.80;
console.log(`A pessoa ${pessoa1.nome} será: ${posicao1 ? "Goleiro" : "Jogador"}`);

const posicao2 = pessoa2.idade>=15 && pessoa2.altura>=1.80;
console.log(`A pessoa ${pessoa2.nome} será: ${posicao2 ? "Goleiro" : "Jogador"}`);

