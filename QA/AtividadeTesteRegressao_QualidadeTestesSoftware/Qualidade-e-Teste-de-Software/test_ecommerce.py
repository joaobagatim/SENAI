import unittest
from ecommerce import calcular_desconto

class TestQualidade(unittest.TestCase):

    # Testes originais
    def test_regra_100_reais(self):
        self.assertEqual(calcular_desconto(100), 105.0)

    def test_cupom_especial(self):
        self.assertEqual(calcular_desconto(50, "QUERO20"), 55.0)

    # Novos testes de regressão

    def test_cenario_frete(self):
        # Compra de R$100 -> 10% desconto = 90 + 15 frete = 105
        self.assertEqual(calcular_desconto(100), 105.0)

    def test_cupom_off50_valido(self):
        # Compra de R$800 -> OFF50 = 400 (sem frete)
        self.assertEqual(calcular_desconto(800, "OFF50"), 400.0)

    def test_cupom_off50_invalido(self):
        # Compra de R$200 -> OFF50 ignorado -> 10% = 180 (sem frete)
        self.assertEqual(calcular_desconto(200, "OFF50"), 180.0)

if __name__ == '__main__':
    unittest.main()