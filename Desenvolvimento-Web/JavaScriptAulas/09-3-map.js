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

let filmes1 = filmes.map(
    (filme) => "Filme: " + filme.titulo + "\nDiretor: " + filme.diretor + "\nProdutor: " + filme.produtor 
)

console.log(filmes1)

filmes1.forEach(
    item => {
        console.log(item)
        console.log("")
    }
)