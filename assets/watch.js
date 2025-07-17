function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        idAnime: params.get('idAnime'),
        idEp: params.get('idEp')
    };
}
async function carregarEpisodio() {
    const { idAnime, idEp } = getParams();
    const epInfo = document.getElementById('epInfo');
    try {
        const res = await fetch('animes.json');
        const animes = await res.json();
        const anime = animes.find(a => String(a.id) === String(idAnime));
        if (!anime) {
            epInfo.innerHTML = '<p>Anime não encontrado.</p>';
            return;
        }
        const ep = anime.episodios.find(e => String(e.numero) === String(idEp));
        if (!ep) {
            epInfo.innerHTML = '<p>Episódio não encontrado.</p>';
            return;
        }
        epInfo.innerHTML = `<h2>${anime.nome} - Episódio ${ep.numero}</h2><p>${ep.titulo || ''}</p>`;
        iniciarPlayer(ep.videos);
    } catch (e) {
        epInfo.innerHTML = '<p>Erro ao carregar episódio.</p>';
    }
}
window.addEventListener('DOMContentLoaded', carregarEpisodio);

// --- Player Unificado (adaptado do fornecido) ---
function iniciarPlayer(videos) {
    // O restante do código do player fornecido pelo usuário vai aqui,
    // mas a variável "videos" já está correta para o episódio.
    // Por questão de espaço, o código será inserido na próxima etapa.
    // Por enquanto, só inicializa o player se houver vídeos.
    if (!videos || !videos.length) {
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').textContent = 'Nenhum vídeo para este episódio!';
        return;
    }
    // TODO: Inserir o código do player aqui.
} 