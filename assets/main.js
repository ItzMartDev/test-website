async function carregarAnimes() {
    const grid = document.getElementById('animesGrid');
    try {
        const res = await fetch('animes.json');
        const animes = await res.json();
        grid.innerHTML = '';
        animes.forEach(anime => {
            const card = document.createElement('div');
            card.className = 'anime-card';
            card.innerHTML = `
                <a href="anime.html?id=${anime.id}">
                    <img src="${anime.capa}" alt="Capa de ${anime.nome}">
                    <h3>${anime.nome}</h3>
                </a>
            `;
            grid.appendChild(card);
        });
    } catch (e) {
        grid.innerHTML = '<p>Erro ao carregar animes.</p>';
    }
}
window.addEventListener('DOMContentLoaded', carregarAnimes); 