const game = {
    score: 0,
    badges: [],
    answers: {},
    commitments: [],
    phase1Data: [],
    matchesFound: 0,
    totalPairs: 4,
    selectedSabotage: null,

    start() {
        console.log("🎮 NeuroLíder iniciado");
        this.showScreen('phase1');
        this.loadPhase1();
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add('active');
            // Gatilhos automáticos
            if (screenId === 'phase2') setTimeout(() => this.startPause(), 600);
            if (screenId === 'phase3') this.loadPhase3();
            if (screenId === 'phase4') this.loadPhase4();
            if (screenId === 'phase5') this.loadPhase5();
        }
    },

    loadPhase1() {
        this.phase1Data = [
            { scenario: "Seu diretor envia um e-mail às 22h: 'Esse relatório está fraco. Revisar até amanhã 8h.'", options: ["Responder imediatamente justificando", "Pausar, respirar e responder amanhã", "Ignorar e esperar cobrança"], correct: 1, character: "Alarme (Amígdala)" },
            { scenario: "Em uma reunião, um colega critica sua ideia publicamente.", options: ["Contra-atacar na hora", "Ficar calado e guardar ressentimento", "Agradecer e pedir detalhes para entender melhor"], correct: 2, character: "Radar (Hipotálamo)" },
            { scenario: "Você recebe um elogio do CEO por um projeto bem-sucedido.", options: ["Achar que foi sorte e esquecer", "Saborear por 20s e registrar mentalmente", "Dizer que a equipe fez tudo"], correct: 1, character: "Bibliotecário (Hipocampo)" }
        ];

        const container = document.getElementById('quiz-container');
        container.innerHTML = '';
        this.phase1Data.forEach((q, i) => {
            container.innerHTML += `
                <div class="quiz-question">
                    <h3>Situação ${i + 1}</h3>
                    <p>${q.scenario}</p>
                    <div class="quiz-options">
                        ${q.options.map((opt, j) => `<div class="quiz-option" onclick="game.selectAnswer(${i}, ${j}, this)">${opt}</div>`).join('')}
                    </div>
                    <div class="feedback" id="feedback-${i}"></div>
                </div>`;
        });
    },

    selectAnswer(qIndex, optIndex, element) {
        const q = this.phase1Data[qIndex];
        const feedback = document.getElementById(`feedback-${qIndex}`);
        const parent = element.parentElement;

        parent.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
            opt.style.pointerEvents = 'none';
        });
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

        if (qIndex === 2) setTimeout(() => this.showScreen('phase2'), 2000);
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
            <div class="quiz-options" id="neg-options">
                <div class="quiz-option" onclick="game.selectNegotiation(0, this)">"Mas nossa empresa sempre cumpriu prazos!"</div>
                <div class="quiz-option" onclick="game.selectNegotiation(1, this)">"Você tem razão. Quando vidas estão em jogo, a segurança é absoluta. E podemos estruturar isso assim..."</div>
            </div>
            <div class="feedback" id="feedback-neg"></div>
        `;
    },

    selectNegotiation(choice, element) {
        const feedback = document.getElementById('feedback-neg');
        const container = document.getElementById('neg-options');
        
        // Reset visual
        container.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');

        if (choice === 1) {
            this.score += 75;
            this.badges.push('🌉 Arquiteto de Pontes');
            feedback.className = 'feedback success';
            feedback.innerHTML = `✅ <strong>Magistral!</strong> Substituiu o "Mas" por "Sim... e". Amígdala regulada. +75 PN<br>Badge: Arquiteto de Pontes`;
            feedback.style.display = 'block';
            // Bloqueia novos cliques e avança
            container.querySelectorAll('.quiz-option').forEach(opt => opt.style.pointerEvents = 'none');
            setTimeout(() => this.showScreen('phase4'), 2500);
        } else {
            feedback.className = 'feedback error';
            feedback.innerHTML = `⚠️ O "Mas" ativa defensividade. <strong>Clique na outra opção</strong> para validar a contraparte e avançar.`;
            feedback.style.display = 'block';
            // Mantém habilitado para tentar novamente
        }
    },

    loadPhase4() {
        const pairs = [
            { id: 1, sabotage: "Reviver erros em loop", inverse: "Saborear vitórias por 20s" },
            { id: 2, sabotage: "Reagir instantaneamente", inverse: "Pausa de 5 segundos" },
            { id: 3, sabotage: "Focar só no negativo", inverse: "Radar de oportunidades" },
            { id: 4, sabotage: "Interromper o outro", inverse: "Escuta ativa + validação" }
        ];

        this.matchesFound = 0;
        this.selectedSabotage = null;

        const container = document.getElementById('matching-game');
        container.innerHTML = `
            <h3>🖱️ Clique em um sabotador (❌) e depois na sua inversão correta (✅):</h3>
            <div class="matching-grid">
                <div class="match-column">
                    <h4>Sabotadores</h4>
                    ${pairs.map(p => `<div class="match-item" data-type="sabotage" data-id="${p.id}">❌ ${p.sabotage}</div>`).join('')}
                </div>
                <div class="match-column">
                    <h4>Inversões</h4>
                    ${pairs.map(p => `<div class="match-item" data-type="inverse" data-id="${p.id}">✅ ${p.inverse}</div>`).join('')}
                </div>
            </div>
            <div class="feedback" id="feedback-match"></div>`;

        document.querySelectorAll('.match-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleMatchClick(e.currentTarget));
        });
    },

    handleMatchClick(element) {
        if (element.classList.contains('correct')) return;

        const type = element.dataset.type;
        const id = element.dataset.id;
        const feedback = document.getElementById('feedback-match');

        if (type === 'sabotage') {
            document.querySelectorAll('.match-item[data-type="sabotage"]').forEach(i => i.classList.remove('selected'));
            element.classList.add('selected');
            this.selectedSabotage = { element, id };
        } else if (type === 'inverse' && this.selectedSabotage) {
            if (this.selectedSabotage.id === id) {
                this.selectedSabotage.element.classList.add('correct');
                this.selectedSabotage.element.classList.remove('selected');
                element.classList.add('correct');
                this.matchesFound++;
                this.score += 25;
                feedback.className = 'feedback success';
                feedback.innerHTML = `✅ Par encontrado! +25 PN`;
                feedback.style.display = 'block';

                if (this.matchesFound === this.totalPairs) {
                    this.badges.push('🔁 Quebra de Insanidade');
                    setTimeout(() => {
                        alert('🎉 Todas as inversões corretas! +100 PN\nBadge: Quebra de Insanidade');
                        this.showScreen('phase5');
                    }, 1200);
                }
            } else {
                feedback.className = 'feedback error';
                feedback.innerHTML = `⚠️ Combinação incorreta. Tente novamente.`;
                feedback.style.display = 'block';
                element.style.animation = 'shake 0.4s ease-in-out';
                setTimeout(() => element.style.animation = '', 400);
            }
            this.selectedSabotage = null;
        }
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
                    <input type="checkbox" id="commit-${i}" onchange="game.toggleCommitment(${i}, '${c.replace(/'/g, "\\'")}')">
                    <label for="commit-${i}">${c}</label>
                </div>`).join('') + 
            `<button onclick="game.finish()" class="btn-primary" id="btn-finish" disabled>Finalizar e Ver Resultados</button>`;
    },

    toggleCommitment(index, text) {
        const checkbox = document.getElementById(`commit-${index}`);
        if (checkbox.checked) {
            if (!this.commitments.includes(text)) this.commitments.push(text);
        } else {
            this.commitments = this.commitments.filter(c => c !== text);
        }
        document.getElementById('btn-finish').disabled = this.commitments.length < 3;
    },

    finish() {
        this.showScreen('end-screen');
        document.getElementById('final-score').innerHTML = `<h3>Pontuação Final</h3><div style="font-size:3.5em;color:#4f46e5;font-weight:800;margin:10px 0;">${this.score} PN</div><p>Pontos de Neuroplasticidade</p>`;
        document.getElementById('badges-earned').innerHTML = `<h3>Badges Conquistados:</h3>` + this.badges.map(b => `<span class="badge">${b}</span>`).join('');
    },

    downloadPDF() {
        const content = `NEUROLÍDER - PLANO DE AUTOGESTÃO\n================================\nPontuação: ${this.score} PN\nBadges: ${this.badges.join(', ')}\n\nCompromisso de 3 Dias:\n${this.commitments.map((c,i)=>`${i+1}. ${c}`).join('\n')}\n\n"A neuroplasticidade é a prova definitiva de que você não é refém da sua genética. Mude o hábito e você assumirá o comando."`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'meu-plano-neurolider.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};