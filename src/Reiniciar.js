export function BotaoReiniciar({
  setQuadrados,
  setStatus,
  setLocal,
  setLinhaVencedora,
  setJogadorDaVez,
}) {
  function reiniciar() {
    setQuadrados(Array(9).fill(null));
    setStatus(null);
    setLocal([]);
    setLinhaVencedora([]);
    setJogadorDaVez("X");
  }

  return (
    <button className="botao-reiniciar" onClick={reiniciar}>
      Reiniciar partida
    </button>
  );
}
