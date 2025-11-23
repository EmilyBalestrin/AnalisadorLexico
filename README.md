# Analisador Léxico

Este projeto consiste na implementação de um **Analisador Léxico** baseado em **Autômatos Finitos Determinísticos (AFD)**. O software foi desenvolvido como parte da avaliação da disciplina de Linguagens Formais do curso de Ciência da Computação, simulando a identificação de tokens através de uma matriz de transição de estados.

---

## 🌐 Acesso Online (Demo)

Você pode utilizar o analisador diretamente pelo navegador, sem necessidade de instalação:

**[Analisador Léxico](https://emilybalestrin.github.io/AnalisadorLexico/)**

*(Caso prefira rodar localmente, siga as instruções na seção "Como Executar" abaixo).*

---

## 🧠 Funcionamento do Projeto

O analisador funciona como uma máquina de estados que processa a entrada do usuário caractere por caractere.

### Lógica Implementada
1.  **Definição de Tokens:** O usuário cadastra palavras válidas (ex: `casa`, `abacaxi`, `maaça`). O algoritmo converte essa lista dinamicamente em uma **Matriz de Transição** ($M[estado, simbolo]$).
2.  **Reconhecimento:** Ao digitar na área de teste, o autômato transita entre os estados ($q0, q1...$) conforme os símbolos inseridos.
3.  **Validação:** O caractere **Espaço** atua como separador. Ao digitá-lo, o sistema verifica se o estado atual é um **Estado Final**.
    * ✅ **Aceito:** Token reconhecido (adicionado ao histórico como válido).
    * ❌ **Rejeitado:** Token inválido ou não finalizado.

### Requisitos Atendidos
* **Alfabeto:** Suporte exclusivo para letras minúsculas ($a-z$).
* **Interface Visual:** Exibição da matriz de estados e destaque da transição ativa em tempo real.
* **Separador:** Uso de espaço em branco para delimitar e validar tokens.

---

## 🚀 Tecnologias

* **[SvelteKit](https://kit.svelte.dev/) (Vite):** Framework para interface reativa e performance.
* **HTML5 / CSS3:** Estrutura e estilização (Dark Mode).
* **JavaScript:** Lógica de construção do AFD e gerenciamento de estado.

---

## 💻 Como Executar Localmente

Caso queira baixar o código e rodar na sua máquina (necessário [Node.js](https://nodejs.org/)):

1.  **Clone o projeto:**
    ```bash
    git clone git@github.com:EmilyBalestrin/AnalisadorLexico.git
    cd analisador-lexico
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor:**
    ```bash
    npm run dev
    ```

4.  **Acesse:**
    Abra `http://localhost:5173/` no seu navegador.

---

## ✒️ Autores

* **Emily L. Balestrin**
* **Júlia F. Levandoski**

---
*Ciência da Computação — 2025*
