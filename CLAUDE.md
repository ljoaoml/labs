# NADF — Instruções para Claude Code

## Regras de PR

- Sempre que criar um PR, bumpar a versão do site em `index.html` (linha do rodapé `Alfa vX.X.X`)
- Isso permite ao usuário confirmar que o deploy entrou online pelo número de versão

## Versionamento

- Formato: `Alfa vX.X.X · Última atualização: Mês Ano`
- Localização: `index.html` — `<div class="footer-bottom-right">`
- Bumpar o patch (último número) para atualizações menores
- Bumpar o minor (segundo número) para funcionalidades novas

## Projeto

- Site estático no GitHub Pages: `ljoaoml.github.io/tester`
- Assistente KTION: lógica híbrida — localização via SHELF_DATA local, perguntas gerais via Cloudflare Worker LLM
- Worker URL: `https://workers-ai-assistant.ljoaomarcosalves.workers.dev`
- Branch de desenvolvimento: criar nova branch por PR, nunca commitar direto no main
