def Calculo():
    try:
        n1 = int(input('''Digite o primeiro número
'''))
        n2 = int(input('''Digite o segundo número
'''))
    except ValueError:
        print("Número inválido")
        Calculo()

    sinal = input('''Para somar, digite +,
para subtrair, digite -,
para multiplicar, digite *,
para dividir, digite /
para porcentagem, digite %
''')
    if sinal == "+":
        resultado = int(n1) + int(n2)
        print("{} ".format(n1) + sinal + " {} = ".format(n2))
        print(str(resultado))
    elif sinal == "-":
        resultado = int(n1) - int(n2)
        print("{} ".format(n1) + sinal + " {} = ".format(n2))
        print(str(resultado))
    elif sinal == "*":
        resultado = int(n1) * int(n2)
        print("{} ".format(n1) + sinal + " {} = ".format(n2))
        print(str(resultado))
    elif sinal == "/":
        resultado = int(n1) / int(n2)
        print("{} ".format(n1) + sinal + " {} = ".format(n2))
        print(str(resultado))
    elif sinal == "%":
        pRes1 = n1 / 100
        pRes2 = n2 / 100
        print("{}".format(n1) + sinal + " e {}".format(n2) + sinal)
        print(str(pRes1) + " e " + str(pRes2))
    else:
        print("Digite um sinal válido")
        Calculo()
    Again()
def Again():
    dnv = input('''Fazer novo cálculo? S/N
''')
    if dnv == "s" or dnv == "S":
        Calculo()
    elif dnv == "n" or dnv == "N":
        print("Tchau")
Calculo()