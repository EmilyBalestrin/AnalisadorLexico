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

    <section class="card config-section">
        <h2>1. Configurar Autômato (Tokens Válidos)</h2>
        <div class="input-group">
            <input
                    type="text"
                    placeholder="Digite um token (ex: casa, abacaxi, etc.)"
                    bind:value={entradaNovoToken}
                    on:keydown={(e) => e.key === 'Enter' && adicionarToken()}
            />
            <button class="btn-primary" on:click={adicionarToken}>+ Adicionar Token</button>
        </div>
        <div class="tags">
            {#each tokensValidos as token}
        <span class="tag">
          {token}
            <button on:click={() => removerToken(token)}>x</button>
        </span>
            {/each}
        </div>
        <p class="hint">O autômato é reconstruído automaticamente ao adicionar os tokens.</p>
    </section>

    <section class="card test-section">
        <h2>2. Testar Entrada </h2>
        <div class="input-wrapper">
            <input
                    type="text"
                    class:error={statusReconhecimento === 'erro'}
                    class:success={statusReconhecimento === 'sucesso'}
                    placeholder="Digite aqui... (Use ESPAÇO para validar)"
                    bind:value={entradaAtual}
                    on:input={manipularEntrada}
            />
            <div class="status-indicator">
                Estado Atual: <strong>q{estadoAtual}</strong>
                {#if estadosFinais.has(estadoAtual)}
                    <span class="badge success">Final</span>
                {/if}
            </div>
        </div>
    </section>

    <section class="card table-section">
        <h2>Matriz de Transição de Estados</h2>
        <div class="table-responsive">
            <table>
                <thead>
                <tr>
                    <th>Estado</th>
                    {#each alfabeto as char}
                        <th>{char}</th>
                    {/each}
                    <th>Final</th>
                </tr>
                </thead>
                <tbody>
                {#each listaEstados as estado}
                    <tr class:active-row={estadoAtual === estado.id}>
                        <td class="state-col">q{estado.id}</td>
                        {#each alfabeto as char}
                            <td class:active-cell={estadoAtual === estado.id && entradaAtual.endsWith(char)}>
                                {estado.movimentos[char] !== undefined ? `q${estado.movimentos[char]}` : '-'}
                            </td>
                        {/each}
                        <td>
                            {#if estadosFinais.has(estado.id)}✅{/if}
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    </section>

    <section class="history-section">
        <h3>Histórico</h3>
        {#if historico.length === 0}
            <p class="empty-msg">Nenhuma análise ainda.</p>
        {:else}
            <ul>
                {#each historico as item}
                    <li class={item.aceito ? 'ok' : 'nok'}>
                        <strong>{item.palavra}</strong>
                        <span>-> {item.aceito ? 'Reconhecido' : 'Rejeitado'} (Fim em q{item.estadoFinal})</span>
                    </li>
                {/each}
            </ul>
        {/if}
    </section>
</main>

<style>
    :global(body) {
        background-color: #1a1a1a;
        color: #e0e0e0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
    }

    .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
    }

    h1 { text-align: center; color: #fff; margin-bottom: 40px; }
    h2 { margin-top: 0; font-size: 1.2rem; color: #bbb; border-bottom: 1px solid #333; padding-bottom: 10px;}

    .card {
        background-color: #252525;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }

    /* Inputs e Botões */
    .input-group { display: flex; gap: 10px; margin-bottom: 15px; }

    input[type="text"] {
        width: 100%;
        box-sizing: border-box;

        background: #333;
        border: 1px solid #444;
        color: #fff;
        padding: 12px;
        border-radius: 4px;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.2s;
    }

    input[type="text"]:focus { border-color: #4CAF50; }
    input[type="text"].error { border-color: #f44336; color: #ff8a80; }

    .btn-primary {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 0 20px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }
    .btn-primary:hover { background-color: #0056b3; }

    /* Tags de Tokens */
    .tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag {
        background: #333;
        border: 1px solid #555;
        padding: 5px 10px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
    }
    .tag button {
        background: #ff5252;
        border: none;
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 0.7rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Tabela */
    .table-responsive { overflow-x: auto; }
    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
    }
    th, td {
        padding: 10px;
        text-align: center;
        border: 1px solid #444;
    }
    th { background-color: #333; }

    /* Highlight da linha ativa (Estado Atual) */
    .active-row { background-color: rgba(76, 175, 80, 0.2); }
    .active-row .state-col { color: #4CAF50; font-weight: bold; border-left: 4px solid #4CAF50; }
    .active-cell { background-color: #4CAF50; color: white; font-weight: bold; }

    /* Histórico */
    .history-section ul { list-style: none; padding: 0; }
    .history-section li {
        padding: 10px;
        margin-bottom: 5px;
        border-radius: 4px;
        background: #2a2a2a;
        display: flex;
        justify-content: space-between;
    }
    .history-section li.ok { border-left: 4px solid #4CAF50; }
    .history-section li.nok { border-left: 4px solid #f44336; }
    .empty-msg { text-align: center; color: #666; font-style: italic; }

    .hint { font-size: 0.8rem; color: #888; margin-top: 10px;}
    .status-indicator { margin-top: 10px; color: #aaa; }
    .badge { background: #4CAF50; color: #fff; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 5px;}

</style>