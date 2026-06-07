document.addEventListener("DOMContentLoaded", () => {

const CONFIG = {
    numeroWhats: "5562983255417"
};

// ======================
// ELEMENTOS
// ======================
const produtos = document.querySelectorAll(".produto");
const botoesWhats = document.querySelectorAll(".btn-whatsapp");

const modal = document.getElementById("modalProduto");
const fecharModal = document.getElementById("fecharModal");

const modalImg = document.getElementById("modalImg");
const modalTitulo = document.getElementById("modalTitulo");
const modalDescricao = document.getElementById("modalDescricao");
const modalDetalhes = document.getElementById("modalDetalhes");
const modalPreco = document.getElementById("modalPreco");

const pesquisa = document.getElementById("pesquisa");
const btnLimpar = document.getElementById("limpar");
const botoesFiltro = document.querySelectorAll(".filtros button");
const mensagemVazia = document.getElementById("mensagem-vazia");

// ======================
// NORMALIZAR TEXTO
// ======================
function normalizar(texto) {
    return (texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

let filtroAtual = "todos";

// ======================
// FILTRO + PESQUISA
// ======================
function atualizarProdutos() {

    const texto = normalizar(pesquisa.value);
    let encontrou = false;

    produtos.forEach(produto => {

        const titulo = normalizar(produto.querySelector("h2")?.innerText);
        const desc = normalizar(produto.querySelector("p")?.innerText);
        const categoria = produto.classList;

        const bateCategoria =
            filtroAtual === "todos" ||
            categoria.contains(filtroAtual);

        const batePesquisa =
            titulo.includes(texto) ||
            desc.includes(texto);

        if (bateCategoria && batePesquisa) {
            produto.style.display = "block";
            encontrou = true;
        } else {
            produto.style.display = "none";
        }
    });

    mensagemVazia.style.display = encontrou ? "none" : "block";
}

botoesFiltro.forEach(botao => {

    botao.addEventListener("click", () => {

        filtroAtual = botao.id;
        pesquisa.value = "";

        // REMOVE ativo de todos os botões
        botoesFiltro.forEach(b => b.classList.remove("ativo"));

        // ADICIONA ativo no clicado
        botao.classList.add("ativo");

        atualizarProdutos();
    });
});
// ======================
// PESQUISA
// ======================
pesquisa.addEventListener("input", () => {

    filtroAtual = "todos";

    // remove destaque dos botões
    botoesFiltro.forEach(b => b.classList.remove("ativo"));

    atualizarProdutos();
});

// ======================
// LIMPAR
// ======================
btnLimpar.addEventListener("click", () => {

    pesquisa.value = "";
    filtroAtual = "todos";

    // remove destaque dos botões
    botoesFiltro.forEach(b => b.classList.remove("ativo"));

    atualizarProdutos();
});

// ======================
// WHATSAPP CLIQUE
// ======================
botoesWhats.forEach(botao => {

    botao.addEventListener("click", (e) => {
        e.stopPropagation();

        const produto = botao.dataset.produto;
        const preco = botao.dataset.preco;

        const chave = "cliques_" + produto;
        let cliques = Number(localStorage.getItem(chave)) || 0;
        cliques++;
        localStorage.setItem(chave, cliques);

        const msg =
`🛒 NOVO PEDIDO
Produto: ${produto}
Preço: R$ ${preco}`;

        window.open(
            `https://wa.me/${CONFIG.numeroWhats}?text=${encodeURIComponent(msg)}`,
            "_blank"
        );
    });
});

// ======================
// MODAL + VISUALIZAÇÃO
// ======================
produtos.forEach(produto => {

    produto.addEventListener("click", (e) => {

        if (e.target.classList.contains("btn-whatsapp")) return;

        const titulo = produto.querySelector("h2").innerText;
        const img = produto.querySelector("img").src;

        const descEl = produto.querySelectorAll("p")[0];
        const precoEl = produto.querySelector(".preco");

        const desc = descEl ? descEl.innerText : "";
        const preco = precoEl ? precoEl.innerText : "";

        const detalhes = produto.getAttribute("data-detalhes") || "";

        // views
        const chave = "visualizacoes_" + titulo;
        let views = Number(localStorage.getItem(chave)) || 0;
        views++;
        localStorage.setItem(chave, views);

        modalImg.src = img;
        modalTitulo.innerText = titulo;
        modalDescricao.innerText = desc;
        modalPreco.innerText = preco;
        modalDetalhes.innerHTML = detalhes.replace(/\n/g, "<br>");

        modal.classList.remove("hidden");
    });
});

// ======================
// FECHAR MODAL
// ======================
fecharModal.addEventListener("click", () => modal.classList.add("hidden"));

modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
});

// ======================
// PAINEL DO DONO
// ======================
const abrirPainel = document.getElementById("abrirPainel");
const painelDono = document.getElementById("painelDono");
const fecharPainel = document.getElementById("fecharPainel");
const resumo = document.getElementById("resumoCards");
const ranking = document.getElementById("rankingProdutos");

abrirPainel.addEventListener("click", () => {

    let dados = [];
    let totalViews = 0;
    let totalClicks = 0;

    for (let i = 0; i < localStorage.length; i++) {

        const key = localStorage.key(i);

        if (key.startsWith("visualizacoes_")) {

            const nome = key.replace("visualizacoes_", "");
            const views = Number(localStorage.getItem(key)) || 0;
            const clicks = Number(localStorage.getItem("cliques_" + nome)) || 0;

            totalViews += views;
            totalClicks += clicks;

            dados.push({ nome, views, clicks });
        }
    }

    dados.sort((a, b) => b.clicks - a.clicks);

    resumo.innerHTML = `
        <div class="card">
            <h3>👁 Views</h3>
            <p>${totalViews}</p>
        </div>

        <div class="card">
            <h3>🛒 Cliques</h3>
            <p>${totalClicks}</p>
        </div>
    `;

    ranking.innerHTML = dados.length
        ? dados.map((p, i) => `
            <div class="produto-rank">
                <strong>${i + 1}º ${p.nome}</strong><br>
                👁 ${p.views} views<br>
                🛒 ${p.clicks} cliques
            </div>
        `).join("")
        : "<p>Nenhum dado ainda</p>";

    painelDono.classList.remove("hidden");
});

// fechar painel
fecharPainel.addEventListener("click", () => {
    painelDono.classList.add("hidden");
});

painelDono.addEventListener("click", e => {
    if (e.target === painelDono) {
        painelDono.classList.add("hidden");
    }
});

});