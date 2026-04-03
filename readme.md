# 🧠 NeuroLíder: O Desafio da Autogestão

Jogo gamificado para pós-graduação em Liderança e Inteligência Emocional, baseado em neurociência e no conceito do "Jogo do Contrário" (Prof. Ricardo de Faria Barros - IBMEC).

## 🎯 Objetivos Pedagógicos

- Desenvolver autogestão emocional através da neuroplasticidade
- Identificar os "sabotadores cerebrais" (Bibliotecário, Alarme, Radar)
- Praticar protocolos de pausa e recalibragem
- Aplicar técnicas de negociação baseadas no caso AT&T vs Boeing
- Criar compromisso de mudança comportamental de 3 dias

## 🚀 Como Usar

### Para Professores:

1. **Clone este repositório** ou faça download dos arquivos
2. **Hospede no GitHub Pages:**
   - Vá em Settings > Pages
   - Selecione a branch "main" e salve
   - Seu jogo estará disponível em `https://seu-usuario.github.io/neurolider`

3. **Compartilhe o link** com seus alunos 48h antes da aula

### Para Alunos:

1. Acesse o link fornecido pelo professor
2. Complete o jogo (20-30 minutos)
3. Baixe seu plano de ação em PDF
4. Traga o PDF para a aula síncrona

## 📊 Estrutura do Jogo

| Fase | Conteúdo | Duração |
|------|----------|---------|
| 1. Diagnóstico do Radar | Quiz sobre VUCA-BANI e viés evolutivo | 5 min |
| 2. Protocolo em Ação | Timer de pausa de 5 segundos | 3 min |
| 3. Negociação | Caso AT&T vs Boeing (ramificado) | 7 min |
| 4. Jogo do Contrário | Matching de sabotagens → alta performance | 10 min |
| 5. Compromisso | Plano de 3 dias personalizável | 5 min |

## 🏆 Sistema de Pontuação

- **Pontos de Neuroplasticidade (PN):** Acumule até 300 pontos
- **Badges:** 
  - 🛡️ Engenheiro da Amígdala
  - 🌉 Arquiteto de Pontes
  - 🔁 Quebra de Insanidade
  - 🧠 Curador de Sucessos

## 📚 Fundamentação Teórica

Baseado em:
- Neuroplasticidade e Eixo HPA (Hipotálamo-Hipófise-Suprarrenal)
- Mentalidade Fixa vs. Crescimento (Carol Dweck)
- Espaço de Ury (William Ury - Harvard Negotiation Project)
- Jogo do Contrário (Prof. Ricardo de Faria Barros - IBMEC-Brasília)

## 🛠️ Tecnologias

- HTML5 + CSS3 (responsivo)
- JavaScript vanilla (sem dependências)
- GitHub Pages (hospedagem gratuita)
- Geração de PDF client-side

## 📈 Coleta de Dados (Opcional)

Para coletar respostas dos alunos, adicione:

```javascript
// No final do jogo, envie para Google Sheets ou Planilha
fetch('YOUR_WEBHOOK_URL', {
    method: 'POST',
    body: JSON.stringify({
        score: game.score,
        badges: game.badges,
        commitments: game.commitments
    })
});