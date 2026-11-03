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

let filmes1 = filmes.find(
    (filme) => filme.titulo === "Hobbit"
)

if(filmes1){
    console.log(
        `Título: ${filmes1.titulo} \nDiretor: ${filmes1.diretor}`
    )
} else {
    console.log("Filme não encontrado!")
}