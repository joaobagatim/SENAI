const usuarios = [
    {
        nome: "Lucas",
        idade: 70
    },
    {
        nome: "Leticia",
        idade: 40
    },
    {
        nome: "Gabriel",
        idade: 32
    }
]

const nomesUsuarios = usuarios.map(
    usuario => {
        return `${usuario.nome} tem ${usuario.idade} anos`
    }
)

console.log("Nova lista: ", nomesUsuarios)