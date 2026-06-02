export function BotaoReiniciar({setQuadrados, setEstado, setStatus, setLocal}) {
 
 function reiniciarJogo() {
    setQuadrados(Array(9).fill(null));
    setEstado(false);
    setStatus(null);
    setLocal([]);
  }

  return <><div><button onClick={reiniciarJogo}>Reiniciar</button></div></>
}