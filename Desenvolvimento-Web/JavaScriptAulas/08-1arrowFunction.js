// function soma(a, b){
//     return a + b
// }
// ===== SOMA =====
const soma = (a, b) => a + b

console.log(soma(58, 94))

// ===== NOME =====
const nome = (x) => `Boa noite ${x}`

console.log(nome("João Victor"))

// ===== MEDIA =====
const media = (nota) => {
    if(nota >= 7){
        console.log("Aprovado")
    } else {
        console.log("Reprovado")
    }
}

console.log(media(8))
console.log(media(5))

// ===== MEDIA COMO FUNCTION NORMAL =====
// function media(nota){
//     if(nota >= 7){
//         console.log("Aprovado")
//     } else {
//         console.log("Reprovado")
//     }
// }

// console.log(media(8))
// console.log(media(5))