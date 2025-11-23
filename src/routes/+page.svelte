<script>
    let tokensValidos = [];
    let entradaNovoToken = "";

    // Matriz de Transição e Estados
    // Cada item é um objeto: { id: 0, movimentos: { 'a': 1, ... } }
    let listaEstados = [];
    let estadosFinais = new Set();
    let alfabeto = "abcdefghijklmnopqrstuvwxyz".split("");

    // Estado da Simulação
    let estadoAtual = 0;
    let entradaAtual = "";
    let historico = [];
    let statusReconhecimento = "neutro";

    // Constroi a Matriz (DFA) baseada nos tokens adicionados
    function construirAutomato() {
        // Inicializa o estado 0
        listaEstados = [{id: 0, movimentos: {}}];
        estadosFinais = new Set();
        let contadorEstados = 0;

        tokensValidos.forEach(palavra => {
            let atual = 0;
            for (let caractere of palavra) {
                // Se não existe transição, cria novo estado
                if (!listaEstados[atual].movimentos[caractere]) {
                    contadorEstados++;
                    listaEstados.push({id: contadorEstados, movimentos: {}});
                    listaEstados[atual].movimentos[caractere] = contadorEstados;
                }
                atual = listaEstados[atual].movimentos[caractere];
            }
            estadosFinais.add(atual);
        });

        listaEstados = listaEstados;
        resetarSimulacao();
    }

    // Adiciona Token à lista
    function adicionarToken() {
        if (entradaNovoToken && !tokensValidos.includes(entradaNovoToken)) {
            //aceita somente letras minusculas
            const higienizado = entradaNovoToken.toLowerCase().replace(/[^a-z]/g, '');
            if(higienizado.length > 0) {
                tokensValidos = [...tokensValidos, higienizado];
                construirAutomato();
            }
        }
        entradaNovoToken = "";
    }

    function removerToken(token) {
        tokensValidos = tokensValidos.filter(t => t !== token);
        construirAutomato();
    }

    // Processa entrada símbolo a símbolo
    function manipularEntrada(evento) {
        const caractere = evento.data;
        const valorCompleto = evento.target.value;

        // Se o usuário apagou tudo, reseta
        if (valorCompleto === "") {
            resetarSimulacao();
            return;
        }

        if (caractere === " " || valorCompleto.endsWith(" ")) {
            verificarTokenFinal();
            return;
        }

        // Pega o último caractere digitado para processar a transição
        const ultimoCaractere = valorCompleto.slice(-1).toLowerCase();

        // Verifica se é letra válida do alfabeto
        if (!alfabeto.includes(ultimoCaractere)) {
            return;
        }

        // Lógica da Matriz: M[estado_atual, simbolo] = novo_estado
        const proximoEstado = listaEstados[estadoAtual]?.movimentos[ultimoCaractere];

        if (proximoEstado !== undefined) {
            estadoAtual = proximoEstado;
            statusReconhecimento = "neutro";
        } else {
            // Se não há transição definida, fica em vermelho
            statusReconhecimento = "erro";
        }
    }

   //Verificar aceitação ao dar espaço
    function verificarTokenFinal() {
        const foiAceito = estadosFinais.has(estadoAtual) && statusReconhecimento !== "erro";

        // Adiciona ao histórico
        historico = [{
            palavra: entradaAtual.trim(),
            aceito: foiAceito,
            estadoFinal: estadoAtual
        }, ...historico];

        // Limpa entrada para o próximo token
        entradaAtual = "";
        resetarSimulacao();
    }

    function resetarSimulacao() {
        estadoAtual = 0;
        statusReconhecimento = "neutro";
    }

    construirAutomato();
</script>

<main class="container">
    <h1>Analisador Léxico das Girls</h1>
</main>

<style>
</style>