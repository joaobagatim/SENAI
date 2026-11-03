const numeros = [10, 20, 30, 40, 50]

const soma = numeros.reduce(
    (ac, num) => ac + num, 0
)

console.log("A soma é " + soma)

// =================================

const multi = numeros.reduce(
    (ac, num) => ac * num, 1
)

console.log("A multiplicação é " + multi)

// =================================

const notas = [7, 8, 6 ,5]

const media = notas.reduce(
    (ac, nota, index, array) => {
        // ac: acumulador; nota: variavel de iteração; index: indice da lista; array: nome da lista
        ac += nota;
        if(index === array.length -1) {
            return ac / array.length
        }
        return ac;
    }
)

console.log(media)

// =================================

const palavras = ["Olá", "mundo", "JavaScript"]

const frase = palavras.reduce (
    (ac, p) => `${ac} ${p}`
)

console.log(frase)

// =================================

const pessoas = [
    { nome: 'Ana', grupo: 'A'},
    { nome: 'Carlos', grupo: 'B'},
    { nome: 'José', grupo: 'B'},   
    { nome: 'Tatiane', grupo: 'A'},
]

const agrupado = pessoas.reduce(
    (ac, pessoa) => {
        if(!ac[pessoa.grupo]){
            ac[pessoa.grupo] = []
        }
        ac[pessoa.grupo].push(pessoa.nome)
        return ac
    }, {}
)

console.log(agrupado)

// =================================

const letras = ["a", "b", "a", "c", "b", "a"]

const contagem = letras.reduce(
    (ac, x) => {
        ac[x] = (ac[x] || 0) + 1;
        return ac
    }, {}
)

console.log(contagem)