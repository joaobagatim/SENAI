const botao = document.getElementById("btn");

botao.addEventListener('click', function(){
    alert('Externo!')
})

const mostrar = document.getElementById("mostrar")

mostrar.addEventListener('click', function(){
    document.getElementById('texto').style.display='block'
})

const ocultar = document.getElementById("ocultar")

ocultar.addEventListener('click', function(){
    document.getElementById('texto').style.display='none'
})

const altera = document.getElementById("altera")

altera.addEventListener('click', function(){
    document.getElementById('texto2').innerText = "Texto Alterado"
})

const cor = document.getElementById("cor")

cor.addEventListener('click', function(){
    document.getElementById('texto2').style.color='Blue'
})

// ==== Cor quadrado ====
const azul = document.getElementById("azul")

azul.addEventListener('click', function(){
    document.getElementById('quadrado').style.backgroundColor='Blue'
})

const verde = document.getElementById("verde")

verde.addEventListener('click', function(){
    document.getElementById('quadrado').style.backgroundColor='Green'
})

const amarelo = document.getElementById("amarelo")

amarelo.addEventListener('click', function(){
    document.getElementById('quadrado').style.backgroundColor='Yellow'
})