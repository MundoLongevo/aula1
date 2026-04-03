const game = {
    score: 0,
    badges: [],
    answers: {},
    commitments: [],
    phase1Data: [],

    start() {
        console.log("Jogo iniciado!");
        this.showScreen('phase1');
        this.loadPhase1();
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) target.classList.add('active');
        
        // Gatilhos automáticos por fase
        if (screenId === 'phase2') this.startPause();
        if (screenId === 'phase3') this.loadPhase3();
        if (screenId === 'phase4') this.loadPhase4();
        if (screenId === 'phase5') this.loadPhase5();
    },

    loadPhase1() {
        this.phase1Data = [
            {
                scenario: "Seu diretor envia um e-mail às 22h: 'Esse relatório está fraco. Revisar até amanhã 8h.'",
                options: ["Responder imediatamente justificando", "Pausar, respirar e responder amanhã", "Ignorar e esperar cobrança"],
                correct: 1,
                character: "Alarme (Amígdala)"
            },
            {
                scenario: "Em uma reunião, um colega critica sua ideia publicamente.",
                options: ["Contra-atacar na hora", "Ficar calado e guardar ressentimento", "Agradecer e pedir detalhes para entender melhor"],
                correct: 2,
                character: "Radar (Hipotálamo)"
            },
            {
                scenario: "Você recebe um elogio do CEO por um projeto bem-sucedido.",
                options: ["Achar que foi sorte e esquecer", "Saborear por 20s e registrar mentalmente", "Dizer que a equipe fez tudo"],
                correct: 1,
                character: "Bibliotecário (Hipocampo)"
            }
        ];

        const container = document.getElementById('quiz-container');
        container.innerHTML = '';
        this.phase1Data.forEach((q, i) => {
            container.innerHTML += `
                <div class="quiz-question">
                    <h3>Situação ${i + 1}</h3>
                    <p>${q.scenario}</p>
                    <div class="quiz-options">
                        ${q.options.map((opt, j) => `
                            <div class="quiz-option" onclick="game.selectAnswer(${i}, ${j}, this)">${opt}</div>
                        `).join('')}
                    </div>
                    <div class="feedback" id="feedback-${i}"></div>
                </div>
            `;
        });
    },

    selectAnswer(qIndex, optIndex, element) {
        const q = this.phase1Data[qIndex];
        const feedback = document.getElementById(`feedback-${qIndex}`);
        document.querySelectorAll(`#feedback-${qIndex}`).forEach(f => f.style.display = 'none');
        
        const parent = element.parentElement;
        parent.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');

        if (optIndex === q.correct) {
            this.score += 50;
            feedback.className = 'feedback success';
            feedback.innerHTML = `✅ <strong>Excelente!</strong> Você ativou o ${q.character} de forma consciente. +50 PN`;
        } else {
            feedback.className = 'feedback error';
            feedback.innerHTML = `⚠️ <strong>Atenção!</strong> Isso pode ativar o ${q.character} no modo reativo.`;
        }
        feedback.style.display = 'block';
        this.answers[`q${qIndex}`] = optIndex;

        // Avanço automático após responder a 3ª pergunta
        if (qIndex === 2) {
            setTimeout(() => this.showScreen('phase2'), 2000);
        }
    },

    startPause() {
        let seconds = 5;
        const display = document.getElementById('pause-timer');
        const btn = document.getElementById('btn-pause');
        btn.disabled = true;
        display.textContent = '5';

        const interval = setInterval(() => {
            seconds--;
            display.textContent = seconds > 0 ? seconds : '✓';
            if (seconds <= 0) {
                clearInterval(interval);
                btn.disabled = false;
            }
        }, 1000);
    },

    completePause() {
        this.score += 50;
        this.badges.push('🛡️ Engenheiro da Amígdala');
        alert('🎉 Pausa completada! Córtex pré-frontal recuperado. +50 PN\nBadge: Engenheiro da Amígdala');
        this.showScreen('phase3');
    },

    loadPhase3() {
        document.getElementById('negotiation-scenario').innerHTML = `
            <div class="scenario-box">
                <h3>Contexto:</h3>
                <p>A Boeing exige garantias rígidas. A AT&T responde com defensividade. Impasse total.</p>
                <p><strong>Sua missão:</strong> Como negociador da AT&T, o que você diz?</p>
            </div>
            <div class="quiz-options">
                <div class="quiz-option" onclick="game.selectNegotiation(0, this)">"Mas nossa empresa sempre cumpriu prazos!"</div>
                <div class="quiz-option" onclick="game.selectNegotiation(1, this)">"Você tem razão. Quando vidas estão em jogo, a segurança é absoluta. E podemos estruturar isso assim..."</div>
            </div>
            <div class="feedback" id="feedback-neg"></div>
        `;
    },

    selectNegotiation(choice, element) {
        const feedback = document.getElementById('feedback-neg');
        const parent = element.parentElement;
        parent.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');

        if (choice === 1) {
            this.score += 75;
            this.badges.push('🌉 Arquiteto de Pontes');
            feedback.className = 'feedback success';
            feedback.innerHTML = `✅ <strong>Magistral!</strong> Substituiu o "Mas" por "Sim... e". Amígdala regulada. +75 PN<br>Badge: Arquiteto de Pontes`;
            setTimeout(() => this.showScreen('phase4'), 2500);
        } else {
            feedback.className = 'feedback error';
            feedback.innerHTML = `⚠️ O "Mas" ativa defensividade. Tente validar primeiro.`;
        }
        feedback.style.display = 'block';
    },

    loadPhase4() {
        const sabotages = [
            { id: 1, text: "Reviver erros em loop", reverse: "Saborear vitórias por 20s" },
            { id: 2, text: "Reagir instantaneamente", reverse: "Pausa de 5 segundos" },
            { id: 3, text: "Focar só no negativo", reverse: "Radar de oportunidades" },
            { id: 4, text: "Interromper o outro", reverse: "Escuta ativa + validação" }
        ];

        const container = document.getElementById('matching-game');
        container.innerHTML = '<h3>Arraste a sabotagem (❌) até sua inversão correta (✅):</h3>';
        
        let html = '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">';
        html += '<div><h4>Sabotadores</h4>';
        sabotages.forEach(s => html += `<div class="matching-item" draggable="true" data-id="${s.id}">❌ ${s.text}</div>`);
        html += '</div><div><h4>Inversões</h4>';
        sabotages.forEach(s => html += `<div class="matching-item" draggable="true" data-reverse="${s.id}">✅ ${s.reverse}</div>`);
        html += '</div></div>';
        container.innerHTML = html;
        this.setupDragAndDrop(sabotages.length);
    },

    setupDragAndDrop(expectedMatches) {
        let dragged = null;
        let matches = 0;

        document.querySelectorAll('.matching-item').forEach(item => {
            item.addEventListener('dragstart', (e) => { dragged = item; item.style.opacity = '0.5'; });
            item.addEventListener('dragend', () => { dragged = null; item.style.opacity = '1'; });
            item.addEventListener('dragover', (e) => e.preventDefault());
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                if (!dragged || dragged === item) return;
                
                const id1 = dragged.getAttribute('data-id');
                const id2 = item.getAttribute('data-reverse');
                if (id1 && id2 && id1 === id2) {
                    dragged.classList.add('correct');
                    item.classList.add('correct');
                    dragged.draggable = false;
                    item.draggable = false;
                    this.score += 25;
                    matches++;
                    if (matches === expectedMatches) {
                        this.badges.push('🔁 Quebra de Insanidade');
                        setTimeout(() => {
                            alert('🎉 Todas as inversões corretas! +100 PN\nBadge: Quebra de Insanidade');
                            this.showScreen('phase5');
                        }, 800);
                    }
                }
            });
        });
    },

    loadPhase5() {
        const commitments = [
            "Pausa Estratégica: Esperar 5s antes de reagir",
            "Recalibragem de Radar: Perguntar 3x/dia 'O que estou deixando de ver de bom?'",
            "Validação Radical: Dizer 'Você tem razão nesse aspecto' antes de discordar",
            "Saboreamento: Dedicar 20s para celebrar uma vitória diária",
            "Escuta Ativa: Ouvir sem interromper por 2 minutos completos"
        ];

        const container = document.getElementById('commitment-form');
        container.innerHTML = `<h3>Escolha 3 ações para os próximos 3 dias:</h3>` +
            commitments.map((c, i) => `
                <div class="commitment-item">
                    <input type="checkbox" id="commit-${i}" onchange="game.toggleCommitment(${i}, '${c}')">
                    <label for="commit-${i}">${c}</label>
                </div>
            `).join('') + `<button onclick="game.finish()" class="btn-primary" id="btn-finish" disabled>Finalizar e Ver Resultados</button>`;
    },

    toggleCommitment(index, text) {
        const checkbox = document.getElementById(`commit-${index}`);
        if (checkbox.checked) this.commitments.push(text);
        else this.commitments = this.commitments.filter(c => c !== text);
        document.getElementById('btn-finish').disabled = this.commitments.length < 3;
    },

    finish() {
        this.showScreen('end-screen');
        document.getElementById('final-score').innerHTML = `<h3>Pontuação Final</h3><div style="font-size:3em;color:#667eea;font-weight:bold;">${this.score} PN</div><p>Pontos de Neuroplasticidade</p>`;
        document.getElementById('badges-earned').innerHTML = `<h3>Badges Conquistados:</h3>` + this.badges.map(b => `<span class="badge">${b}</span>`).join('');
    },

    downloadPDF() {
        const content = `NEUROLÍDER - PLANO DE AUTOGESTÃO\n================================\nPontuação: ${this.score} PN\nBadges: ${this.badges.join(', ')}\n\nCompromisso de 3 Dias:\n${this.commitments.map((c,i)=>`${i+1}. ${c}`).join('\n')}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'meu-plano-neurolider.txt';
        a.click();
    }
};