# Termômetro do Semestre · app

**Site: [termometro-psi.vercel.app](https://termometro-psi.vercel.app).** A tela do [Termômetro do Semestre](https://github.com/catarina051/termometro-semestre), feita com vibe coding no v0: reprovação e desistência nas 15 disciplinas mais cursadas do ciclo básico da UFRN (2015 a 2019), a curva por carga do semestre, as combinações de disciplinas que parecem perigosas e os achados com suas limitações. A análise, os dados e a validação ficam no outro repositório; este só mostra os resultados.

## Como foi feito

1. **Escrevi o prompt com regras, não só com o desenho** ([`prompts/01-prompt-enviado.md`](prompts/01-prompt-enviado.md)). As decisões que o prompt carrega são minhas:
   - os dados reais vêm por URL de um JSON do repositório de análise, e não colados no código, para a tela não congelar números;
   - nada de número inventado nem cálculo na tela, só formatação;
   - nenhuma frase que recomende evitar ou escolher disciplinas;
   - o visual é o mesmo do front do GradMent: fundo `#F4F7F1`, verde escuro como cor primária, fonte Inter, cantos bem arredondados e barra lateral flutuante.
2. **O v0 gerou o app numa única geração.** Na geração, o v0 criou 18 arquivos e editou 5 (o commit inicial, `8aa8a0c`, tem 39 arquivos contando os do template), e ele mesmo testou a página no navegador: sem rolagem horizontal a 360 px, abas e cliques funcionando nos temas claro e escuro, segundo o relatório dele. O prompt foi enviado pelo Claude no navegador integrado, a meu pedido. Eu publiquei o site no v0, e o repositório foi criado pelo v0 por um clique do Claude no navegador, também a meu pedido.
3. **Os números da tela foram conferidos contra o JSON,** por um script no console do navegador, depois da publicação. Para as 15 disciplinas, a reprovação e a desistência exibidas batem com o arquivo (arredondadas na casa decimal), e batem também o total de matrículas, o de calouros, a diferença de cada um dos 3 pares sobreviventes e o texto do aviso ético.
4. **O que ficou por conta do Claude Code depois do v0:**
   - A rota [`/api/explicar`](app/api/explicar/): recebe números já calculados e devolve uma explicação em linguagem simples do Gemini. Se o texto trouxer algum número que não estava nos dados enviados, ele é descartado (uma nova tentativa, depois erro). Tem 12 testes (`node --test app/api/explicar/explicar.test.mjs`).
   - A validação de tipos no build (o v0 deixa `ignoreBuildErrors: true`; desliguei depois de conferir que `tsc --noEmit` e `next build` passam).
   - O nome do pacote (o v0 usa `my-project`), este README e o `.env.example`.

## O que o v0 não fez

- **A rota `/api/explicar`.** Pedi que ela não fosse criada, porque já estava escrita; o v0 só chama a rota, e o seu próprio relatório diz que, sem ela, o botão "Explicar" mostra o estado de erro.
- **Testes de interface.** Não existem testes automáticos da tela; a conferência foi manual e por script de console, uma vez.

## Rodar localmente

```bash
pnpm install   # ou npm install
pnpm dev
```

Precisa de internet, porque os dados vêm do GitHub. Para o botão "Explicar" funcionar, crie `.env.local` com `GEMINI_API_KEY` (chave gratuita do Google AI Studio; veja `.env.example`). Sem a chave, a rota responde que o serviço de explicação não está configurado, e o resto da página funciona.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui (base-ui), Recharts. Dados: [`dados/termometro.json`](https://github.com/catarina051/termometro-semestre/blob/main/dados/termometro.json), revalidados a cada hora.

## Estrutura

- `app/`: página, layout e a rota `api/explicar`.
- `components/`: seções (disciplinas, carga, combinações, achados), cartão de destaque, barra lateral e rodapé.
- `lib/`: busca dos dados, tipos e formatação.
- `prompts/`: o prompt enviado ao v0.
