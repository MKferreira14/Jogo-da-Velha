export function BotaoReiniciar({ setQuadrados, setStatus, setLocal, setLinhaVencedora }) {

  function reiniciarJogo() {
    setQuadrados(Array(9).fill(null));
    setStatus(null);
    setLocal([]);
    setLinhaVencedora([]);
  }

  return (
    <div>
      <button onClick={reiniciarJogo}>
        Reiniciar
      </button>
    </div>
  );
}