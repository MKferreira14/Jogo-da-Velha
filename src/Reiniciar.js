export function BotaoReiniciar({ setQuadrados, setStatus, setLocal }) {

  function reiniciarJogo() {
    setQuadrados(Array(9).fill(null));
    setStatus(null);
    setLocal([]);
  }

  return (
    <div>
      <button onClick={reiniciarJogo}>
        Reiniciar
      </button>
    </div>
  );
}