import { useState } from "react";
import { BotaoReiniciar } from "./Reiniciar";

function Square({ valor, func }) {
  return (
    <button className="square" onClick={func}>
      {valor}
    </button>
  );
}

export default function Campo() {
  const [quadrados, setQuadrados] = useState(Array(9).fill(null));
  const [status, setStatus] = useState(null);
  const [local, setLocal] = useState([]);
  const [jogadorDaVez, setJogadorDaVez] = useState("X");

  function calcularVencedor(tabuleiro) {
    const linhas = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let linha of linhas) {
      const [a, b, c] = linha;

      if (
        tabuleiro[a] &&
        tabuleiro[a] === tabuleiro[b] &&
        tabuleiro[a] === tabuleiro[c]
      ) {
        return tabuleiro[a] === "X"
          ? "Jogador venceu!"
          : "Máquina venceu!";
      }
    }

    if (tabuleiro.every((quadrado) => quadrado !== null)) {
      return "Deu empate!";
    }

    return null;
  }

  function jogadaMaquina(tabuleiroAtual) {
    if (calcularVencedor(tabuleiroAtual)) return;

    const livres = [];

    for (let i = 0; i < tabuleiroAtual.length; i++) {
      if (tabuleiroAtual[i] === null) {
        livres.push(i);
      }
    }

    if (livres.length === 0) return;

    const posicao =
      livres[Math.floor(Math.random() * livres.length)];

    const novoTabuleiro = [...tabuleiroAtual];
    novoTabuleiro[posicao] = "O";

    setQuadrados(novoTabuleiro);

    const resultado = calcularVencedor(novoTabuleiro);
    setStatus(resultado);

    const jogada =
      `Jogada ${local.length + 2}: O na posição ${posicao}`;

    setLocal((prev) => [...prev, jogada]);
  }

  function handleClick(i) {
    if (status !== null) return;

    const novoTabuleiro = [...quadrados];

    if (novoTabuleiro[i] !== null) return;

    novoTabuleiro[i] = "X";

    setQuadrados(novoTabuleiro);
    

    const resultado = calcularVencedor(novoTabuleiro);
    setStatus(resultado);

    if (resultado === null) {
      setJogadorDaVez("O");
    }
    

  

    const jogada =
      `Jogada ${local.length + 1}: X na posição ${i}`;

    setLocal((prev) => [...prev, jogada]);

    if (resultado === null) {
  setJogadorDaVez("X");
}

    if (resultado === null) {
      setTimeout(() => {
        jogadaMaquina(novoTabuleiro);
      }, 500);
    }
  }

  return (
    <>
     <div className="jogador-da-vez">
     <span>Vez do jogador</span>
     <h2>{jogadorDaVez}</h2>
     </div>

      <div className="board-row">
        <Square valor={quadrados[0]} func={() => handleClick(0)} />
        <Square valor={quadrados[1]} func={() => handleClick(1)} />
        <Square valor={quadrados[2]} func={() => handleClick(2)} />
      </div>

      <div className="board-row">
        <Square valor={quadrados[3]} func={() => handleClick(3)} />
        <Square valor={quadrados[4]} func={() => handleClick(4)} />
        <Square valor={quadrados[5]} func={() => handleClick(5)} />
      </div>

      <div className="board-row">
        <Square valor={quadrados[6]} func={() => handleClick(6)} />
        <Square valor={quadrados[7]} func={() => handleClick(7)} />
        <Square valor={quadrados[8]} func={() => handleClick(8)} />
      </div>

      <div>
        <h1>{status}</h1>
      </div>

      <div className="local-container">
        <h3>Histórico de Jogadas</h3>

        <ul>
          {local.map((jogada, indice) => (
            <li key={indice}>{jogada}</li>
          ))}
        </ul>
      </div>

      <BotaoReiniciar
        setQuadrados={setQuadrados}
        setStatus={setStatus}
        setLocal={setLocal}
      />
    </>
  );
}