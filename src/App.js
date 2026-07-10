import { useState } from "react";
import { BotaoReiniciar } from "./Reiniciar";

function Square({ valor, func, vencedor }) {
  return (
    <button className={`square ${vencedor ? "vencedor" : ""}`} onClick={func}>
      {valor}
    </button>
  );
}

export default function Campo() {
  const [quadrados, setQuadrados] = useState(Array(9).fill(null));
  const [status, setStatus] = useState(null);
  const [local, setLocal] = useState([]);
  const [jogadorDaVez, setJogadorDaVez] = useState("X");
  const [linhaVencedora, setLinhaVencedora] = useState([]);
  const [vitoriasx, setVitoriasx] = useState(0);
  const [vitoriaso, setVitoriaso] = useState(0);
  const [empates, setEmpates] = useState(0);

  // CORREÇÃO: A função agora é pura. Ela apenas calcula e retorna os dados, sem atualizar estados.
  function calcularVencedor(tabuleiro) {
    const linhas = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
      [0, 4, 8], [2, 4, 6]             // Diagonais
    ];

    for (let linha of linhas) {
      const [a, b, c] = linha;
      if (
        tabuleiro[a] &&
        tabuleiro[a] === tabuleiro[b] &&
        tabuleiro[a] === tabuleiro[c]
      ) { 
        if( tabuleiro[a] ==="X"){
          setVitoriasx( vitoriasx+1);
        }
        else{setVitoriaso( vitoriaso+1);}
        return {
          resultado: tabuleiro[a] === "X" ? "Jogador venceu!" : "Máquina venceu!",
          linha: linha
        };
      }
    }

    if (tabuleiro.every((quadrado) => quadrado !== null)) {
      setEmpates(empates+1);
      return { resultado: "Deu empate!", linha: [] };
    }

    return null;
  }

  function jogadaMaquina(tabuleiroAtual) {
    // 🔒 BLOQUEIO MÁQUINA: Se o jogador ganhou na última jogada, a máquina não joga.
    const checagemImediata = calcularVencedor(tabuleiroAtual);
    if (checagemImediata) return;

    const livres = [];
    for (let i = 0; i < tabuleiroAtual.length; i++) {
      if (tabuleiroAtual[i] === null) {
        livres.push(i);
      }
    }

    if (livres.length === 0) return;

    const posicao = livres[Math.floor(Math.random() * livres.length)];
    const novoTabuleiro = [...tabuleiroAtual];
    novoTabuleiro[posicao] = "O";

    setQuadrados(novoTabuleiro);

    // Atualiza o resultado após a jogada da máquina
    const infoVencedor = calcularVencedor(novoTabuleiro);
    if (infoVencedor) {
      setStatus(infoVencedor.resultado);
      setLinhaVencedora(infoVencedor.linha);
    } else {
      setJogadorDaVez("X");
    }

    const jogada = `Jogada ${local.length + 2}: O na posição ${posicao}`;
    setLocal((prev) => [...prev, jogada]);
  }

  function handleClick(i) {
    // 🔒 BLOQUEIO JOGADOR: Se o jogo acabou ou o quadrado está ocupado, impede a jogada
    if (status !== null || quadrados[i] !== null) return;

    const novoTabuleiro = [...quadrados];
    novoTabuleiro[i] = "X";
    setQuadrados(novoTabuleiro);

    const jogada = `Jogada ${local.length + 1}: X na posição ${i}`;
    setLocal((prev) => [...prev, jogada]);

    const infoVencedor = calcularVencedor(novoTabuleiro);

    if (infoVencedor) {
      setStatus(infoVencedor.resultado);
      setLinhaVencedora(infoVencedor.linha);
    } else {
      setJogadorDaVez("O");
      // Só agenda a jogada da máquina se o jogo continuar ativo
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

      <div className="container-principal">

        <div className="painel-jogador">
    <h3>Jogador 1</h3>
    <input type="text" placeholder="Nome do Pokemon" className="input-jogador" />
    <button className="botao-busca">Buscar</button>
       </div>

       <div className="tabuleiro-centro">
      <div className="board-row">
        <Square valor={quadrados[0]} func={() => handleClick(0)} vencedor={linhaVencedora.includes(0)} />
        <Square valor={quadrados[1]} func={() => handleClick(1)} vencedor={linhaVencedora.includes(1)} />
        <Square valor={quadrados[2]} func={() => handleClick(2)} vencedor={linhaVencedora.includes(2)} />
      </div>

      <div className="board-row">
        <Square valor={quadrados[3]} func={() => handleClick(3)} vencedor={linhaVencedora.includes(3)} />
        <Square valor={quadrados[4]} func={() => handleClick(4)} vencedor={linhaVencedora.includes(4)} />
        <Square valor={quadrados[5]} func={() => handleClick(5)} vencedor={linhaVencedora.includes(5)} />
      </div>

      <div className="board-row">
        <Square valor={quadrados[6]} func={() => handleClick(6)} vencedor={linhaVencedora.includes(6)} />
        <Square valor={quadrados[7]} func={() => handleClick(7)} vencedor={linhaVencedora.includes(7)} />
        <Square valor={quadrados[8]} func={() => handleClick(8)} vencedor={linhaVencedora.includes(8)} />
      </div>
      </div>

      <div className="painel-jogador">
      <h3>Jogador 2</h3>
      <input type="text" placeholder="Nome do Jogador 2" className="input-jogador" />
      <button className="botao-busca">Buscar</button>
       </div>
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
        setLinhaVencedora={setLinhaVencedora}
      />
      <div>
        <p>vitorias de x: {vitoriasx}</p>
                <p>vitorias de o: {vitoriaso}</p>
                        <p>empates: {empates}</p>
      </div>
    </>
  );
}