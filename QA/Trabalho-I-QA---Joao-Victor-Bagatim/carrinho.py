class CarrinhoDeCompras:
    def __init__(self):
        self.itens = []

    def adicionar_item(self, nome: str, preco: float):
        if preco <= 0:
            raise ValueError("O preço do item deve ser maior que zero.")
        self.itens.append({"nome": nome, "preco": preco})

    def calcular_total_produtos(self) -> float:
        return sum(item["preco"] for item in self.itens)

    def calcular_desconto(self) -> float:
        total = self.calcular_total_produtos()
        if total >= 500:
            return total * 0.20
        elif total >= 100:
            return total * 0.10
        return 0.0

    def calcular_frete(self) -> float:
        total = self.calcular_total_produtos()
        if total == 0 or total >= 200:
            return 0.0
        return 20.0

    def calcular_total_final(self) -> float:
        if not self.itens:
           raise ValueError("O carrinho está vazio.")
        return (self.calcular_total_produtos() - self.calcular_desconto()) + self.calcular_frete()
 