# FantasyAnime

Um site de streaming de animes estático, pronto para deploy no GitHub Pages.

## Estrutura
- `index.html`: Página inicial com lista de animes
- `anime.html`: Detalhes do anime e episódios
- `watch.html`: Player de vídeo unificado
- `animes.json`: Banco de dados dos animes, episódios e vídeos
- `assets/`: CSS e JS
- `covers/`: Capas dos animes
- `videos/`: Vídeos cortados dos episódios (organize conforme o JSON)

## Como adicionar um anime
1. Adicione a capa em `covers/`.
2. Adicione os vídeos cortados em `videos/nome-do-anime/episodio/` (ex: `videos/your-name/1/1.mp4`).
3. Edite `animes.json` seguindo o modelo.

## Deploy no GitHub Pages
1. Faça push do projeto para um repositório no GitHub.
2. Vá em Settings > Pages e selecione a branch `main` e a pasta raiz (`/`).
3. O site estará disponível em `https://seuusuario.github.io/seurepositorio/`.

## Observações
- O site é 100% estático, compatível com o plano gratuito do GitHub Pages.
- Os vídeos devem ser pequenos para não exceder limites do GitHub.
- O player une automaticamente os pedaços de vídeo de cada episódio.
