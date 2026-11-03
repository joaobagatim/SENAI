// >= maior e igual
// && => operador de conjunção
// || => operador de disjunção
// ! => operador de negação
// == => comparar se é igual
// === => comparar valor e tipo
// != => negar valor

let temCarteira = true;
let idade = 18;

const resultado = idade>=18 && temCarteira;

console.log(`${resultado ? "Passou" : "Reprovou"}`);