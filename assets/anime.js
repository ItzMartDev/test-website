function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
async function carregarAnime() {
    const id = getIdFromUrl();
    const infoDiv = document.getElementById('animeInfo');
    const epList = document.getElementById('episodiosList');
    try {
        const res = await fetch('animes.json');
        const animes = await res.json();
        const anime = animes.find(a => String(a.id) === String(id));
        if (!anime) {
            infoDiv.innerHTML = '<p>Anime não encontrado.</p>';
            return;
        }
        infoDiv.innerHTML = `
            <img src="${anime.capa}" alt="Capa de ${anime.nome}">
            <div class="info">
                <h2>${anime.nome}</h2>
            </div>
        `;
        epList.innerHTML = '';
        anime.episodios.forEach(ep => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="watch.html?idAnime=${anime.id}&idEp=${ep.numero}">Episódio ${ep.numero} - ${ep.titulo || ''}</a>`;
            epList.appendChild(li);
        });
    } catch (e) {
        infoDiv.innerHTML = '<p>Erro ao carregar anime.</p>';
    }
}
window.addEventListener('DOMContentLoaded', carregarAnime); 