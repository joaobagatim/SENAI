function resultado(x){
    if(x >= 7){
        return "Aprovado"
    }else if(x >= 4){
        return "Recuperação"
    }else{
        return "Reprovado"
    }
}

module.exports = resultado