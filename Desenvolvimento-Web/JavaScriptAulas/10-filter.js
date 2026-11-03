const filmes = [
    {
        titulo: "Mad Max",
        diretor: "George Miller",
        produtor: "Warner Bros"
    },
    {
        titulo: "Shrek",
        diretor: "Andrew Adamson",
        produtor: "Dreamworks"
    },
    {
        titulo: "Gremlins",
        diretor: "Joe Dante",
        produtor: "Warner Bros"
    },
    {
        titulo: "Hobbit",
        diretor: "Peter Jackson",
        produtor: "Warner Bros"
    },
]

let filmes1 = filmes.filter(
    (f) => f.diretor === "Peter Jackson"
)

filmes1.forEach(
    filme => {
        console.log(`Título: ${filme.titulo}`)
    }
)

// let filmes2 = filmes.filter(
//     (f2) => f2.produtor === "Warner Bros"
// )

// filmes2.forEach(
//     filme => {
//         console.log(`Título ${filme.titulo}`)
//     }
// )