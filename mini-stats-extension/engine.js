
// engine.js - Core logic from logica.js adapted for the extension

const sequenciaRoleta = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

const dadosJogadas = {
    '0': '10, 20, 30', '1': '17, 7', '2': '2, 22', '3': '3, 33', '4': '21, 9', '5': '25, 15, 35',
    '6': '20, 17, 7', '7': '7, 17, 20', '8': '30, 0, 20', '9': '9, 19', '10': '0, 20, 30',
    '11': '30, 0, 20', '12': '33, 15', '13': '20, 7', '14': '17, 7', '15': '9, 5, 35',
    '16': '3, 33', '17': '17, 20, 7', '18': '2, 22', '19': '19, 9', '20': '17, 7',
    '21': '2, 22', '22': '2, 22', '23': '0, 10', '24': '35, 15, 25', '25': '20, 22',
    '26': '0, 10, 30', '27': '17, 7, 20', '28': '7, 17, 20', '29': '7, 17, 20',
    '30': '0, 20, 30', '31': '9, 19', '32': '0, 10, 20, 30', '33': '3, 33', '34': '7, 20',
    '35': '3, 33, 15', '36': '20, 30'
};

function calcularDistancia(numeroAnterior, numeroAtual, direcao) {
    const posAnterior = sequenciaRoleta.indexOf(numeroAnterior);
    const posAtual = sequenciaRoleta.indexOf(numeroAtual);
    if (posAnterior === -1 || posAtual === -1) return 36;

    let distancia;
    if (direcao === 'horário') {
        distancia = posAtual >= posAnterior ? posAtual - posAnterior : (37 - posAnterior) + posAtual;
    } else {
        distancia = posAnterior >= posAtual ? posAnterior - posAtual : posAnterior + (37 - posAtual);
    }

    if (distancia <= 12) return 12;
    if (distancia <= 24) return 24;
    return 36;
}

function obterVizinhos(numero, quantidadeVizinhos = 13) {
    const posicao = sequenciaRoleta.indexOf(numero);
    if (posicao === -1) return [];
    const vizinhos = [];
    const metade = Math.floor(quantidadeVizinhos / 2);
    for (let i = -metade; i <= metade; i++) {
        let pos = (posicao + i + 37) % 37;
        vizinhos.push(sequenciaRoleta[pos]);
    }
    return vizinhos;
}

function encontrarNumeroCentralDistancia(distancia, direcao, numeroAnterior) {
    const posAnterior = sequenciaRoleta.indexOf(numeroAnterior);
    if (posAnterior === -1) return numeroAnterior;
    const distanciaMedia = distancia === 36 ? 31 : distancia === 24 ? 18 : 6;
    let posicaoCentral;
    if (direcao === 'horário') {
        posicaoCentral = Math.round((posAnterior + distanciaMedia)) % 37;
    } else {
        posicaoCentral = Math.round((posAnterior - distanciaMedia + 37)) % 37;
    }
    return sequenciaRoleta[posicaoCentral];
}

function detectarSugestao(estados, ordemAtraso, direcao, ultimoNumero) {
    if (estados.length < 5) return null;

    let count = 0;
    // Verifica se houve 5 alternâncias nos últimos 6 estados
    if (estados.length >= 6) {
        for (let i = estados.length - 1; i >= estados.length - 5; i--) {
            if (estados[i] !== estados[i - 1]) count++;
        }
    }

    if (count >= 5) {
        const ultimoEstado = estados[estados.length - 1];
        let distAlvo;
        if (ultimoEstado === 'repeticao') distAlvo = ordemAtraso[0];
        else if (ultimoEstado === 'atrasado') distAlvo = ordemAtraso[2];
        else distAlvo = ordemAtraso[1];

        return {
            distancia: distAlvo,
            direcao: direcao,
            ultimoNumero: ultimoNumero,
            tipo: 'Repetição de ' + ultimoEstado
        };
    }
    return null;
}

function processNumeros(listaNumeros) {
    if (!listaNumeros || listaNumeros.length === 0) return { estados: [], sugestao: null };
    
    const history = [...listaNumeros].reverse();
    let ordemAtraso = [12, 24, 36];
    let estados = [];
    let direcao = 'horário';
    
    for (let i = 1; i < history.length; i++) {
        const numAnterior = parseInt(history[i-1].value);
        const numAtual = parseInt(history[i].value);
        if (isNaN(numAnterior) || isNaN(numAtual)) continue;

        const dist = calcularDistancia(numAnterior, numAtual, direcao);
        let estado;
        if (dist === ordemAtraso[0]) {
            estado = 'repeticao';
        } else if (dist === ordemAtraso[2]) {
            estado = 'atrasado';
            ordemAtraso = [dist, ordemAtraso[0], ordemAtraso[1]];
        } else {
            estado = 'intermediario';
            ordemAtraso = [dist, ordemAtraso[0], ordemAtraso[2]];
        }
        estados.push(estado);
        direcao = (direcao === 'horário') ? 'anti-horário' : 'horário';
    }

    const ultimoNumero = history.length > 0 ? parseInt(history[history.length - 1].value) : null;
    const sugestao = detectarSugestao(estados, ordemAtraso, direcao, ultimoNumero);

    return { 
        estados, 
        ordemAtraso, 
        proximaDirecao: direcao, 
        sugestao 
    };
}
