import pytest
from carrinho import CarrinhoDeCompras


def test_compra_sem_desconto():

    carrinho = CarrinhoDeCompras()
    carrinho.adicionar_item("Produto",50)

    assert carrinho.calcular_total_final() == 70


def test_limite_9999():

    carrinho = CarrinhoDeCompras()
    carrinho.adicionar_item("Produto",99.99)

    assert carrinho.calcular_desconto() == 0


def test_limite_100():

    carrinho = CarrinhoDeCompras()
    carrinho.adicionar_item("Produto",100)

    assert carrinho.calcular_desconto() == 10


def test_limite_49999():

    carrinho = CarrinhoDeCompras()
    carrinho.adicionar_item("Produto",499.99)

    assert round(carrinho.calcular_desconto(),2) == 50


def test_limite_500():

    carrinho = CarrinhoDeCompras()
    carrinho.adicionar_item("Produto",500)

    assert carrinho.calcular_desconto() == 100


def test_frete_19999():

    carrinho = CarrinhoDeCompras()
    carrinho.adicionar_item("Produto",199.99)

    assert carrinho.calcular_frete() == 20


def test_frete_200():

    carrinho = CarrinhoDeCompras()
    carrinho.adicionar_item("Produto",200)

    assert carrinho.calcular_frete() == 0


def test_preco_negativo():

    carrinho = CarrinhoDeCompras()

    with pytest.raises(ValueError):
        carrinho.adicionar_item("Produto",-10)


def test_preco_zero():

    carrinho = CarrinhoDeCompras()

    with pytest.raises(ValueError):
        carrinho.adicionar_item("Produto",0)


def test_carrinho_vazio():

    carrinho = CarrinhoDeCompras()

    with pytest.raises(ValueError):
        carrinho.calcular_total_final()