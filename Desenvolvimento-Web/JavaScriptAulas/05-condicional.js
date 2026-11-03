// media >= 7 => Aprovado
// media >= 5 => Recuperação
// media < 5 => Reprovado

const media = 6.0;
let resultado;

if(media >= 7.0){
    resultado = "Aprovado"
} else if(media >= 5.0) {
    resultado = "Recuperação"
} else {
    resultado = "Reprovado"
}