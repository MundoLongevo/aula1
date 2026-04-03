const game = {
    currentPhase: 0,
    score: 0,
    badges: [],
    answers: {},
    commitments: [],

    start() {
        this.showScreen('phase1');
        this.loadPhase1();
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    },

    // FASE 1: Quiz Diagnóstico
    loadPhase1() {
        const questions = [
            {
                scenario: "Seu diretor envia um e-mail às 22h: 'Esse relatório está fraco. Revisar até amanhã 8h.'",
                options: [
                    "Responder imediatamente justificando o trabalho",
                    "Pausar, respirar e responder amanhã com clareza",
                    "Ignorar e esperar o diretor cobrar"
                ],
                correct: 1,
                character: "Alarme (Amígdala)"
            },
            {
                scenario: "Em uma reunião, um colega critica sua ideia publicamente.",
                options: [
                    "Contra-atacar na hora defendendo sua posição",
                    "Ficar calado e guardar ressentimento",
                    "Agradecer o feedback e pedir detalhes para entender melhor"
                ],
                correct: 2,
                character: "Radar (Hipotálamo)"
            },
            {
                scenario: "Você recebe um elogio do CEO por um projeto bem-sucedido.",
                options: [
                    "Achar que foi sorte e rapidamente esquecer",
                    "Saborear o momento por 20 segundos e registrar mentalmente",
                    "Dizer que a equipe que fez tudo"
                ],
                correct: 1,
                character: "Bibliotecário (Hipocampo)"
            }
        ];

        const container = document.getElementById('quiz-container');
        container.innerHTML = '';

        questions.forEach((q, index) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.innerHTML = `
                <h3>Situação ${index + 1}</h3>
                <p>${q.scenario}</p>
                <div class="quiz-options">
                    ${q.options.map((opt, i) => `
                        <div class="quiz-option" onclick="game.selectAnswer(${index}, ${i}, this)">
                            ${opt}
                        </div>
                    `).join('')}
                </div>
                <div class="feedback" id="feedback-${index}"></div>
            `;
            container.appendChild(qDiv);
        });

        this.phase1Data = questions;
    },

    selectAnswer(qIndex, optIndex, element) {
        const q = this.phase1Data[qIndex];
        const feedback = document.getElementById(`feedback-${qIndex}`);
        
        document.querySelectorAll(`#quiz-container .quiz-question:nth-child(${qIndex + 1}) .quiz-option`)
            .forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');

        if (optIndex === q.correct) {
            this.score += 50;
            feedback.className = 'feedback success';
            feedback.innerHTML = `✅ <strong>Excelente!</strong> Você ativou o ${q.character} de forma consciente. +50 PN`;
        } else {
            feedback.className = 'feedback error';
            feedback.innerHTML = `⚠️ <strong>Atenção!</strong> Isso pode ativar o ${q.character} no modo reativo. Tente a pausa estratégica.`;
        }
        feedback.style.display = 'block';

        this.answers[`q${qIndex}`] = optIndex;

        setTimeout(() => {
            if (qIndex === 2) {
                setTimeout(() => this.showScreen('phase2'), 1500);
            }
        }, 2000);
    },

    // FASE 2: Timer de Pausa
    startPause() {
        let seconds = 5;
        const display = document.getElementById('pause-timer');
        const btn = document.getElementById('btn-pause');
        
        const interval = setInterval(() => {
            seconds--;
            display.textContent = seconds;
            
            if (seconds <= 0) {
                clearInterval(interval);
                btn.disabled = false;
                display.textContent = '✓';
            }
        }, 1000);
    },

    completePause() {
        this.score += 50;
        this.badges.push('Engenheiro da Amígdala');
        alert('🎉 Pausa completada! Córtex pré-frontal recuperado. +50 PN\nBadge desbloqueado: Engenheiro da Amígdala');
        this.showScreen('phase3');
        this.loadPhase3();
    },

    // FASE 3: Caso AT&T vs Boeing
    loadPhase3() {
        const container = document.getElementById('negotiation-scenario');
        container.innerHTML = `
            <div class="scenario-box">
                <h3>Contexto:</h3>
                <p>A Boeing exige garantias contratuais rígidas. A AT&T responde com defensividade. 
                Amígdalas em polvorosa. O impasse está formado.</p>
                <p><strong>Sua missão:</strong> Como negociador da AT&T, o que você diz?</p>
            </div>
            <div class="quiz-options">
                <div class="quiz-option" onclick="game.selectNegotiation(0, this)">
                    "Mas nossa empresa sempre cumpriu prazos. Vocês precisam confiar em nós!"
                </div>
                <div class="quiz-option" onclick="game.selectNegotiation(1, this)">
                    "Você tem razão. Quando vidas estão em jogo, a engenharia exige segurança absoluta. 
                    E nós podemos estruturar isso assim..."
                </div>
            </div>
            <div class="feedback" id="feedback-neg"></div>
        `;
    },

    selectNegotiation(choice, element) {
        const feedback = document.getElementById('feedback-neg');
        
        if (choice === 1) {
            this.score += 75;
            this.badges.push('Arquiteto de Pontes');
            feedback.className = 'feedback success';
            feedback.innerHTML = `✅ <strong>Magistral!</strong> Você usou "Sim... e" em vez de "Mas". 
            Amígdala da Boeing regulada. Modo luta/fuga → resolução de problemas. +75 PN<br>
            Badge desbloqueado: Arquiteto de Pontes`;
            setTimeout(() => {
                this.showScreen('phase4');
                this.loadPhase4();
            }, 3000);
        } else {
            feedback.className = 'feedback error';
            feedback.innerHTML = `⚠️ O "Mas" ativa defensividade. Tente validar primeiro com "Você tem razão..."`;
        }
        feedback.style.display = 'block';
    },

    // FASE 4: Jogo do Contrário (Matching)
    loadPhase4() {
        const sabotages = [
            { id: 1, text: "Reviver erros em loop", reverse: "Saborear vitórias por 20s" },
            { id: 2, text: "Reagir instantaneamente", reverse: "Pausa de 5 segundos" },
            { id: 3, text: "Focar só no negativo", reverse: "Radar de oportunidades" },
            { id: 4, text: "Interromper o outro", reverse: "Escuta ativa + validação" }
        ];

        const container = document.getElementById('matching-game');
        container.innerHTML = '<h3>Arraste cada sabotagem para sua inversão correta:</h3>';

        sabotages.forEach(s => {
            container.innerHTML += `
                <div class="matching-item" draggable="true" data-id="${s.id}">
                    ❌ ${s.text}
                </div>
                <div class="matching-item" draggable="true" data-reverse="${s.id}">
                    ✅ ${s.reverse}
                </div>
            `;
        });

        this.setupDragAndDrop(sabotages);
    },

    setupDragAndDrop(sabotages) {
        let dragged = null;

        document.querySelectorAll('.matching-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                dragged = item;
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                const target = item;
                
                if (dragged && dragged !== target) {
                    const id1 = dragged.getAttribute('data-id');
                    const id2 = target.getAttribute('data-reverse');
                    
                    if (id1 && id2 && id1 === id2) {
                        dragged.classList.add('correct');
                        target.classList.add('correct');
                        this.score += 25;
                        
                        if (document.querySelectorAll('.correct').length === 8) {
                            this.badges.push('Quebra de Insanidade');
                            setTimeout(() => {
                                alert('🎉 Todas as inversões corretas! +100 PN\nBadge: Quebra de Insanidade');
                                this.showScreen('phase5');
                                this.loadPhase5();
                            }, 1000);
                        }
                    }
                }
            });
        });
    },

    // FASE 5: Compromisso
    loadPhase5() {
        const commitments = [
            "Pausa Estratégica: Esperar 5s antes de reagir",
            "Recalibragem de Radar: Perguntar 3x/dia 'O que estou deixando de ver de bom?'",
            "Validação Radical: Dizer 'Você tem razão nesse aspecto' antes de discordar",
            "Saboreamento: Dedicar 20s para celebrar uma vitória diária",
            "Escuta Ativa: Ouvir sem interromper por 2 minutos completos"
        ];

        const container = document.getElementById('commitment-form');
        container.innerHTML = `
            <h3>Escolha 3 ações para os próximos 3 dias:</h3>
            ${commitments.map((c, i) => `
                <div class="commitment-item">
                    <input type="checkbox" id="commit-${i}" onchange="game.toggleCommitment(${i}, '${c}')">
                    <label for="commit-${i}">${c}</label>
                </div>
            `).join('')}
            <button onclick="game.finish()" class="btn-primary" id="btn-finish" disabled>
                Finalizar e Ver Resultados
            </button>
        `;
    },

    toggleCommitment(index, text) {
        const checkbox = document.getElementById(`commit-${index}`);
        if (checkbox.checked) {
            this.commitments.push(text);
        } else {
            this.commitments = this.commitments.filter(c => c !== text);
        }
        
        document.getElementById('btn-finish').disabled = this.commitments.length < 3;
    },

    finish() {
        this.showScreen('end-screen');
        document.getElementById('final-score').innerHTML = `
            <h3>Sua Pontuação Final</h3>
            <div style="font-size: 3em; color: #667eea; font-weight: bold;">${this.score} PN</div>
            <p>Pontos de Neuroplasticidade</p>
        `;

        document.getElementById('badges-earned').innerHTML = `
            <h3>Badges Conquistados:</h3>
            ${this.badges.map(b => `<span class="badge">${b}</span>`).join('')}
        `;
    },

    downloadPDF() {
        const content = `
NEUROLÍDER - PLANO DE AUTOGESTÃO
================================

Pontuação Final: ${this.score} PN

Badges Conquistados:
${this.badges.join('\n')}

Meu Compromisso de 3 Dias:
${this.commitments.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Lembre-se:
- Pausa de 5 segundos antes de reagir
- Saboreie vitórias por 20 segundos
- Valide o outro antes de discordar
- Foque no "Ainda Não" em vez do fracasso

"Seu cérebro não é seu amigo. Ele é seu hábito. 
Mude o hábito e você assumirá o comando."
        `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meu-plano-neurolider.txt';
        a.click();
    }
};

// Inicialização
window.onload = () => {
    // Animação de entrada
    document.querySelector('#start-screen h1').style.animation = 'fadeIn 1s';
};