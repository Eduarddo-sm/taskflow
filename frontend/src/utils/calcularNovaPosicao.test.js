import {test, expect} from "vitest";
import { calcularNovaPosicao } from "./calcularNovaPosicao";

test("Calcular posição ao subir uma tarefa", ()=> {
    //Arrange
    const posicaoOriginal = 4;
    const posicaoReferencia = 2;
    const mesmaColuna = true;

    //Act
    const resultado = calcularNovaPosicao(posicaoOriginal, posicaoReferencia, mesmaColuna);

    //Assert
    expect(resultado).toBe(2);
})


test("Calcular posição ao descer uma tarefa", ()=> {

//Arrange (Arranjo)
const posicaoOriginal = 2;
const posicaoReferencia = 4;
const mesmaColuna = true;

//Act (Executar)
const resultado = calcularNovaPosicao(posicaoOriginal, posicaoReferencia, mesmaColuna);


//Assert(Verificar)
expect(resultado).toBe(3);
});


test("Deve mover entre colunas", ()=>{

//Arrange
const posicaoOriginal = 2;
const posicaoReferencia = 4;
const mesmaColuna = false;

//Act
const resultado = calcularNovaPosicao(posicaoOriginal, posicaoReferencia, mesmaColuna);

//Assert
expect(resultado).toBe(4);

})


//Teste derivados


test("Teste de reposicionamento do 1 para o 2", ()=>{

//Arrange
const posicaoOriginal = 1;
const posicaoReferencia = 2;
const mesmaColuna = true;

//Act
const resultado = calcularNovaPosicao(posicaoOriginal, posicaoReferencia, mesmaColuna);

//Assert
expect(resultado).toBe(1);
})