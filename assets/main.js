let animesOriginais = [];

async function carregarAnimes() {
    const grid = document.getElementById('animesGrid');
    try {
        const res = await fetch('animes.json');
        const animes = await res.json();
        animesOriginais = animes;
        preencherFiltroAno(animes);
        renderizarAnimes(animes);
    } catch (e) {
        grid.innerHTML = '<p>Erro ao carregar animes.</p>';
    }
}

function preencherFiltroAno(animes) {
    const select = document.getElementById('filterAno');
    const anos = Array.from(new Set(animes.map(a => a.ano))).filter(Boolean).sort((a, b) => b - a);
    select.innerHTML = '<option value="">Ano</option>' + anos.map(ano => `<option value="${ano}">${ano}</option>`).join('');
}

function renderizarAnimes(animes) {
    const grid = document.getElementById('animesGrid');
    grid.innerHTML = '';
    if (!animes || !animes.length) {
        grid.innerHTML = '<p>Nenhum anime encontrado.</p>';
        return;
    }
    animes.forEach(anime => {
        if (!anime.nome || !anime.capa || !anime.episodios) return;
        const tipo = anime.episodios.length === 1 ? 'Filme' : 'Série';
        const card = document.createElement('div');
        card.className = 'anime-card';
        card.innerHTML = `
            <a href="anime.html?id=${anime.id}">
                <img src="${anime.capa}" alt="Capa de ${anime.nome}">
                <h3>${anime.nome}</h3>
                <div class="anime-meta">
                    <span>${anime.ano || ''}</span> · <span>${tipo}</span>
                </div>
            </a>
        `;
        grid.appendChild(card);
    });
}

function filtrarAnimes() {
    const texto = document.getElementById('searchInput').value.toLowerCase();
    const tipo = document.getElementById('filterTipo').value;
    const ano = document.getElementById('filterAno').value;
    let filtrados = animesOriginais.filter(anime => {
        const nomeMatch = anime.nome && anime.nome.toLowerCase().includes(texto);
        const tipoMatch = !tipo || (tipo === 'filme' && anime.episodios.length === 1) || (tipo === 'serie' && anime.episodios.length > 1);
        const anoMatch = !ano || String(anime.ano) === String(ano);
        return nomeMatch && tipoMatch && anoMatch;
    });
    renderizarAnimes(filtrados);
}

document.addEventListener('DOMContentLoaded', () => {
    carregarAnimes();
    document.getElementById('searchInput').addEventListener('input', filtrarAnimes);
    document.getElementById('filterTipo').addEventListener('change', filtrarAnimes);
    document.getElementById('filterAno').addEventListener('change', filtrarAnimes);
}); 