def calcular_desconto(valor_compra, cupom=""):
    if valor_compra < 0:
        raise ValueError("O valor da compra não pode ser negativo.")

    desconto = 0

    if cupom == "OFF50" and valor_compra > 600:
        desconto = 0.50
    elif cupom == "QUERO20":
        desconto = 0.20
    elif valor_compra >= 100:
        desconto = 0.10

    valor_final = valor_compra * (1 - desconto)

    # Regra de frete
    if valor_final < 150:
        valor_final += 15

    return valor_final