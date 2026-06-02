import { useState } from 'react';  
import { BotaoReiniciar } from './Reiniciar';


function Square({valor, func}) {
  return <button className="square" onClick={func}>{valor}</button>
}

export default function Campo() {
  const [quadrados, setQuadrados] = useState(Array(9).fill(null));
  const [estado, setEstado] = useState(false);
  const [status, setStatus] = useState(null);
  const [local, setLocal] = useState([]);
  

  function calcularVencedor(quadradosTemp) {
    if ((quadradosTemp[0]=="X" && quadradosTemp[1]=="X" && quadradosTemp[2]=="X")
      || (quadradosTemp[3]=="X" && quadradosTemp[4]=="X" && quadradosTemp[5]=="X")
      || (quadradosTemp[6]=="X" && quadradosTemp[7]=="X" && quadradosTemp[8]=="X")
      // acrescentado diagonias
      || (quadradosTemp[6]=="X" && quadradosTemp[4]=="X" && quadradosTemp[2]=="X")
      || (quadradosTemp[0]=="X" && quadradosTemp[4]=="X" && quadradosTemp[8]=="X")
      // acrescentando colunas
      || (quadradosTemp[0]=="X" && quadradosTemp[3]=="X" && quadradosTemp[6]=="X")
      || (quadradosTemp[1]=="X" && quadradosTemp[4]=="X" && quadradosTemp[7]=="X")
      || (quadradosTemp[2]=="X" && quadradosTemp[5]=="X" && quadradosTemp[8]=="X")
    ) {
      console.log("Jogador 1 Venceu!");
      return "Jogador 1 venceu!";
    } else if ((quadradosTemp[0]=="O" && quadradosTemp[1]=="O" && quadradosTemp[2]=="O")
      || (quadradosTemp[3]=="O" && quadradosTemp[4]=="O" && quadradosTemp[5]=="O")
      || (quadradosTemp[6]=="O" && quadradosTemp[7]=="O" && quadradosTemp[8]=="O")
      // acrescentado diagonias
      || (quadradosTemp[6]=="O" && quadradosTemp[4]=="O" && quadradosTemp[2]=="O")
      || (quadradosTemp[0]=="O" && quadradosTemp[4]=="O" && quadradosTemp[8]=="O")
      // acrescentando colunas
      || (quadradosTemp[0]=="O" && quadradosTemp[3]=="O" && quadradosTemp[6]=="O")
      || (quadradosTemp[1]=="O" && quadradosTemp[4]=="O" && quadradosTemp[7]=="O")
      || (quadradosTemp[2]=="O" && quadradosTemp[5]=="O" && quadradosTemp[8]=="O")
    ) {
        console.log("Jogador 2 Venceu!");
        return "Jogador 2 venceu!";
    } else if (
      quadradosTemp[0]!=null && 
      quadradosTemp[1]!=null && 
      quadradosTemp[2]!=null && 
      quadradosTemp[3]!=null && 
      quadradosTemp[4]!=null && 
      quadradosTemp[5]!=null && 
      quadradosTemp[6]!=null && 
quadradosTemp[7]!=null && 
quadradosTemp[8]!=null
    ) {
      console.log("Deu empate!");
      return "Deu empate!";
    }
    return null;
  }

  function handleClick(i) {
    const quadradoTemp = quadrados.slice();
  
    if (quadradoTemp[i] != null || status != null) {
      return;
    }

    if (quadradoTemp[i]!=null) {
      return;
    }

    if (estado==false) {
      quadradoTemp[i] = "X";
    } else {
      quadradoTemp[i] = "O";
    }
       
    //definindo quem está jogando
    let jogadorAtual;
    if (estado == false) {
    jogadorAtual = "X";
    } else {
    jogadorAtual = "O";
    }

    setQuadrados(quadradoTemp);
    setEstado(!estado);
    setStatus(calcularVencedor(quadradoTemp));
   
    //fazendo texto da jogada
    const Jogada = `Jogada ${local.length + 1}: ${jogadorAtual} na posição ${i}`;
   
    setLocal([...local, Jogada]);

  }
  return <>
    <div class="board-row">
      <Square valor={quadrados[0]} func={() =>handleClick(0)} />
      <Square valor={quadrados[1]} func={() =>handleClick(1)}/>
      <Square valor={quadrados[2]} func={() =>handleClick(2)}/>
    </div>
    <div class="board-row">
      <Square valor={quadrados[3]} func={() =>handleClick(3)}/>
      <Square valor={quadrados[4]} func={() =>handleClick(4)}/>
      <Square valor={quadrados[5]} func={() =>handleClick(5)}/>
    </div>
    <div class="board-row">
      <Square valor={quadrados[6]} func={() =>handleClick(6)}/>
      <Square valor={quadrados[7]} func={() =>handleClick(7)}/>
      <Square valor={quadrados[8]} func={() =>handleClick(8)}/>  
    </div>
    <div><h1>{status}</h1></div>
    <div className="local-container">
      <h3>Histórico de Jogadas:</h3>
      <ul>
        {local.map((jogada, indice) => (
          <li key={indice}>{jogada}</li>
        ))}
      </ul>
    </div>
    <BotaoReiniciar setQuadrados={setQuadrados} setEstado={setEstado} setStatus={setStatus} setLocal={setLocal}/>
  </>;
}