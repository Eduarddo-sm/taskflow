export function calcularNovaPosicao(
  posicaoOriginal,
  posicaoReferencia,
  mesmaColuna
) {
  let novaPosicao;

  if (mesmaColuna) {
    if (posicaoOriginal > posicaoReferencia) {
      novaPosicao = posicaoReferencia;
    } else {
      novaPosicao = posicaoReferencia - 1;
    }
  } else {
    novaPosicao = posicaoReferencia;
  }

  console.log(novaPosicao);
  return novaPosicao;
}