// ===== Exemplo 01 =====
// function soma(){
//     let a = 5 
//     let b = 25

//     console.log(a + b)
// }

// console.log(soma())

// ===== Exemplo 02 =====
// function soma(){
//     let a = 5 
//     let b = 25

//     return a + b
// }

// console.log(soma())

// ===== Exemplo 03 =====
function soma(a, b){
    return a + b
}

console.log(soma(5, 25))
console.log(soma(36, 98))

// Exemplo com template literal
function nome(x){
    return `Boa noite ${x}`
}

console.log(nome("João Victor"))