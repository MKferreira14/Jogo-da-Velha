import { useState, useEffect } from "react";
import { BotaoReiniciar } from "./Reiniciar";

function Square({ valor, func, vencedor, pokemon }) {
  return (
    <button className={`square ${vencedor ? "vencedor" : ""}`} onClick={func}>
      {valor && pokemon && (
        <img
          src={pokemon.sprite}
          alt={pokemon.nome}
          className="pokemon-sprite"
        />
      )}
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
  const [buscaX, setBuscaX] = useState("");
  const [buscaO, setBuscaO] = useState("");

  // Pokémon dos jogadores
  const [pokemonX, setPokemonX] = useState(null);
  const [pokemonO, setPokemonO] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Requisito 1: carregar os dois Pokémon automaticamente ao iniciar,
  // usando useEffect com lista de dependências vazia ([])
  useEffect(() => {
    async function carregarPokemons() {
      try {
        setCarregando(true);

        const [respostaX, respostaO] = await Promise.all([
          fetch("https://pokeapi.co/api/v2/pokemon/gengar"),
          fetch("https://pokeapi.co/api/v2/pokemon/charmander"),
        ]);

        const dadosX = await respostaX.json();
        const dadosO = await respostaO.json();

        setPokemonX({
          nome: dadosX.name,
          sprite: dadosX.sprites.front_default,
        });

        setPokemonO({
          nome: dadosO.name,
          sprite: dadosO.sprites.front_default,
        });
      } catch (err) {
        setErro("Não foi possível carregar os Pokémon. Tente novamente.");
      } finally {
        setCarregando(false);
      }
    }

    carregarPokemons();
  }, []);
    
  //Função para a requisição da API pela busca no painel jogador
    async function buscarPokemon(nome, tipoJogador) {
    if (!nome.trim()) return;

    try {
      const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase().trim()}`);
      
      if (!resposta.ok) {
        alert("Pokémon não encontrado! Verifique o nome.");
        return;
      }

      const dados = await resposta.json();
      const novoPokemon = {
        nome: dados.name,
        sprite: dados.sprites.front_default,
      };

      if (tipoJogador === "X") {
        setPokemonX(novoPokemon);
      } else {
        setPokemonO(novoPokemon);
      }
    } catch (err) {
      alert("Erro ao buscar o Pokémon. Tente novamente.");
    }
  }

  // Mapeia o símbolo interno ("X" ou "O") para o objeto do Pokémon correspondente
  function pokemonDoSimbolo(simbolo) {
    if (simbolo === "X") return pokemonX;
    if (simbolo === "O") return pokemonO;
    return null;
  }

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
        if (tabuleiro[a] === "X") {
          setVitoriasx((v) => v + 1);
        } else {
          setVitoriaso((v) => v + 1);
        }
        return {
          resultado:
            tabuleiro[a] === "X"
              ? `${pokemonX?.nome ?? "Jogador"} venceu!`
              : `${pokemonO?.nome ?? "Máquina"} venceu!`,
          linha: linha
        };
      }
    }

    if (tabuleiro.every((quadrado) => quadrado !== null)) {
      setEmpates((e) => e + 1);
      return { resultado: "Deu empate!", linha: [] };
    }

    return null;
  }

  function jogadaMaquina(tabuleiroAtual) {
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

    const infoVencedor = calcularVencedor(novoTabuleiro);
    if (infoVencedor) {
      setStatus(infoVencedor.resultado);
      setLinhaVencedora(infoVencedor.linha);
    } else {
      setJogadorDaVez("X");
    }

    const jogada = `Jogada ${local.length + 2}: ${pokemonO?.nome ?? "O"} na posição ${posicao}`;
    setLocal((prev) => [...prev, jogada]);
  }

  function handleClick(i) {
    if (status !== null || quadrados[i] !== null || carregando) return;

    const novoTabuleiro = [...quadrados];
    novoTabuleiro[i] = "X";
    setQuadrados(novoTabuleiro);

    const jogada = `Jogada ${local.length + 1}: ${pokemonX?.nome ?? "X"} na posição ${i}`;
    setLocal((prev) => [...prev, jogada]);

    const infoVencedor = calcularVencedor(novoTabuleiro);

    if (infoVencedor) {
      setStatus(infoVencedor.resultado);
      setLinhaVencedora(infoVencedor.linha);
    } else {
      setJogadorDaVez("O");
      setTimeout(() => {
        jogadaMaquina(novoTabuleiro);
      }, 500);
    }
  }

  // Renderização condicional enquanto os Pokémon são carregados
  if (carregando) {
    return (
      <div className="carregando">
        <h2>Carregando Pokémon...</h2>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="carregando">
        <h2>{erro}</h2>
      </div>
    );
  }

  return (
    <>
      <div className="jogadores-info">
        <div className={`cartao-jogador ${jogadorDaVez === "X" ? "ativo" : ""}`}>
          <img src={pokemonX?.sprite} alt={pokemonX?.nome} />
          <p>{pokemonX?.nome}</p>
          <span>vitórias: {vitoriasx}</span>
        </div>

        <div className="jogador-da-vez">
          <span>Vez do jogador</span>
          <h2>{jogadorDaVez === "X" ? pokemonX?.nome : pokemonO?.nome}</h2>
        </div>

        <div className={`cartao-jogador ${jogadorDaVez === "O" ? "ativo" : ""}`}>
          <img src={pokemonO?.sprite} alt={pokemonO?.nome} />
          <p>{pokemonO?.nome}</p>
          <span>vitórias: {vitoriaso}</span>
        </div>
      </div>

      <div className="container-principal">

        <div className="painel-jogador">
        <h3>Jogador 1</h3>
        <input type="text" placeholder="Nome do Pokemon" className="input-jogador" value={buscaX}
    onChange={(e) => setBuscaX(e.target.value)}/>
        <button className="botao-busca" onClick={() => buscarPokemon(buscaX, "X")}>Buscar</button>
      </div>

       <div className="tabuleiro-centro">
      <div className="board-row">
        {[0, 1, 2].map((i) => (
          <Square
            key={i}
            valor={quadrados[i]}
            func={() => handleClick(i)}
            vencedor={linhaVencedora.includes(i)}
            pokemon={pokemonDoSimbolo(quadrados[i])}
          />
        ))}
      </div>

      <div className="board-row">
        {[3, 4, 5].map((i) => (
          <Square
            key={i}
            valor={quadrados[i]}
            func={() => handleClick(i)}
            vencedor={linhaVencedora.includes(i)}
            pokemon={pokemonDoSimbolo(quadrados[i])}
          />
        ))}
      </div>

      <div className="board-row">
        {[6, 7, 8].map((i) => (
          <Square
            key={i}
            valor={quadrados[i]}
            func={() => handleClick(i)}
            vencedor={linhaVencedora.includes(i)}
            pokemon={pokemonDoSimbolo(quadrados[i])}
          />
        ))}
      </div>
      </div>

      <div className="painel-jogador">
        <h3>Jogador 2</h3>
        <input type="text" placeholder="Nome do jogador 2" className="input-jogador" value={buscaO}
        onChange={(e) => setBuscaO(e.target.value)}/>
        <button className="botao-busca" onClick={() => buscarPokemon(buscaO, "O")}>Buscar</button>
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
        setJogadorDaVez={setJogadorDaVez}
      />

      <div>
        <p>empates: {empates}</p>
      </div>
    </>
  );
}
