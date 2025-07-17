function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

let animeGlobal = null;
let episodioAtual = null;

async function carregarAnime() {
    const id = getIdFromUrl();
    const infoDiv = document.getElementById('animeInfo');
    const epList = document.getElementById('episodiosList');
    const descDiv = document.getElementById('animeDescricao');
    try {
        const res = await fetch('animes.json');
        const animes = await res.json();
        const anime = animes.find(a => String(a.id) === String(id));
        if (!anime) {
            infoDiv.innerHTML = '<p>Anime não encontrado.</p>';
            return;
        }
        animeGlobal = anime;
        const tipo = anime.episodios.length === 1 ? 'Filme' : 'Série';
        const numEps = anime.episodios.length;
        infoDiv.innerHTML = `
            <div style="display:flex;align-items:center;gap:32px;">
                <img src="${anime.capa}" alt="Capa de ${anime.nome}" style="width:140px;height:200px;object-fit:cover;border-radius:10px;border:2px solid #4caf50;box-shadow:0 2px 10px #0003;">
                <div class="info">
                    <h2>${anime.nome} <span style='font-size:0.7em;color:#b2ffb2;font-weight:400;'>(${anime.ano || ''})</span></h2>
                    <p><b>Tipo:</b> ${tipo} &nbsp; <b>Episódios:</b> ${numEps}</p>
                </div>
            </div>
        `;
        descDiv.innerHTML = `<p style='margin-top:18px;font-size:1.1em;color:#ccc;'>${anime.descricao || ''}</p>`;
        epList.innerHTML = '';
        anime.episodios.forEach(ep => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" data-ep="${ep.numero}">Episódio ${ep.numero} - ${ep.titulo || ''}</a>`;
            li.querySelector('a').addEventListener('click', function(e) {
                e.preventDefault();
                tocarEpisodio(ep.numero);
            });
            epList.appendChild(li);
        });
        tocarEpisodio(anime.episodios[0].numero);
    } catch (e) {
        infoDiv.innerHTML = '<p>Erro ao carregar anime.</p>';
    }
}

function tocarEpisodio(numEp) {
    if (!animeGlobal) return;
    const ep = animeGlobal.episodios.find(e => String(e.numero) === String(numEp));
    if (!ep) return;
    episodioAtual = ep;
    document.querySelectorAll('#episodiosList a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('data-ep') == numEp) a.classList.add('active');
    });
    iniciarPlayer(ep.videos);
}

// --- Player Unificado (igual ao watch.js, mas adaptado para esta página) ---
// Copie aqui a função iniciarPlayer do watch.js
// ...
window.addEventListener('DOMContentLoaded', carregarAnime); 