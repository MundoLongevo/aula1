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
        console.log("🧠 NeuroLíder: O Desafio da Autogestão iniciado");
        this.showScreen('phase1');
        this.loadPhase1();
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add('active');
            if (screenId === 'phase2') setTimeout(() => this.startPause(), 600);
            if (screenId === 'phase3') this.loadPhase3();
            if (screenId === 'phase4') this.loadPhase4();
            if (screenId === 'phase5') this.loadPhase5();
        }
    },

    loadPhase1() {
        this.phase1Data = [
            { scenario: "Seu diretor envia um e-mail às 22h: 'Esse relatório está fraco. Revisar até amanhã 8h.'", options: ["Responder imediatamente justificando o trabalho", "Pausar 5s, respirar e responder amanhã com clareza", "Ignorar e esperar cobrança"], correct: 1, character: "Alarme (Amígdala)" },
            { scenario: "Em uma reunião, um colega critica sua ideia publicamente.", options: ["Contra-atacar na hora defendendo sua posição", "Ficar calado e guardar ressentimento", "Validar a preocupação e pedir detalhes técnicos"], correct: 2, character: "Radar (Hipotálamo)" },
            { scenario: "Você recebe um elogio do CEO por um projeto bem-sucedido.", options: ["Achar que foi sorte e seguir em frente rapidamente", "Saborear por 20s, internalizar e registrar mentalmente", "Desviar o crédito imediatamente para a equipe"], correct: 1, character: "Bibliotecário (Hipocampo)" },
            { scenario: "Uma campanha falha e a equipe desanima. Como você posiciona o erro?", options: ["'Fracassamos de novo. Talvez não seja nossa área.'", "'O erro é um dado técnico. O que ainda não dominamos?'", "'A culpa foi do mercado imprevisível.'"], correct: 1, character: "Mentalidade 'Ainda Não' (Crescimento)" },
            { scenario: "Negociação travada: a contraparte exige garantias rígidas por desconfiança.", options: ["'Mas nossa empresa sempre cumpriu prazos!'", "'Você tem razão em exigir segurança. E podemos estruturar métricas claras assim...'", "'Se não confiarem, não há negócio.'"], correct: 1, character: "Validação Radical + 'Sim... e'" },
            { scenario: "Um feedback negativo gera insônia e ruminação mental.", options: ["Revisar o e-mail 10x para encontrar onde errei", "Aplicar Teflon/Velcro: filtrar ruído, guardar aprendizado técnico", "Responder no calor da emoção se defendendo"], correct: 1, character: "Filtro Cognitivo Invertido" }
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

        if (qIndex === this.phase1Data.length - 1) {
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
        
        container.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');

        if (choice === 1) {
            this.score += 75;
            this.badges.push('🌉 Arquiteto de Pontes');
            feedback.className = 'feedback success';
            feedback.innerHTML = `✅ <strong>Magistral!</strong> Substituiu o "Mas" por "Sim... e". Amígdala regulada. +75 PN<br>Badge: Arquiteto de Pontes`;
            feedback.style.display = 'block';
            container.querySelectorAll('.quiz-option').forEach(opt => opt.style.pointerEvents = 'none');
            setTimeout(() => this.showScreen('phase4'), 2500);
        } else {
            feedback.className = 'feedback error';
            feedback.innerHTML = `⚠️ O "Mas" ativa defensividade. <strong>Clique na outra opção</strong> para validar a contraparte e avançar.`;
            feedback.style.display = 'block';
        }
    },

    shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
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

        const col1 = this.shuffleArray([...pairs]);
        const col2 = this.shuffleArray([...pairs]);

        const container = document.getElementById('matching-game');
        container.innerHTML = `
            <h3>🖱️ Clique em um sabotador (❌) e depois na sua inversão correta (✅). <br><small>Ordem aleatória. Pense antes de combinar.</small></h3>
            <div class="matching-grid">
                <div class="match-column">
                    <h4>Sabotadores</h4>
                    ${col1.map(p => `<div class="match-item" data-type="sabotage" data-id="${p.id}">❌ ${p.sabotage}</div>`).join('')}
                </div>
                <div class="match-column">
                    <h4>Inversões</h4>
                    ${col2.map(p => `<div class="match-item" data-type="inverse" data-id="${p.id}">✅ ${p.inverse}</div>`).join('')}
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
        const endScreen = document.getElementById('end-screen');

        // ELEMENTO LÚDICO: Certificado Interativo + Animação
        endScreen.innerHTML = `
            <div style="text-align:center; padding: 10px;">
                <div style="font-size: 4.5rem; margin-bottom: 15px; animation: pulse 2s infinite; filter: drop-shadow(0 0 20px rgba(79,70,229,0.5));">🧠</div>
                <h2 style="color:#111827; margin-bottom:10px;">🎉 Jornada Completa!</h2>
                <p style="color:#6b7280; margin-bottom:25px; font-size:1.1rem;">Você deixou de ser passageiro e virou Engenheiro Cerebral.</p>
                
                <div style="background: linear-gradient(135deg, #f0f5ff 0%, #e0e7ff 100%); padding:25px; border-radius:16px; border:2px dashed #4f46e5; margin:0 auto 25px; max-width:550px; position:relative; overflow:hidden;">
                    <div style="position:absolute; top:10px; right:15px; font-size:2rem; opacity:0.2;">📜</div>
                    <h3 style="color:#4f46e5; margin-bottom:15px;">📊 Seu Certificado de Performance Neural</h3>
                    <div style="font-size:3.2rem; font-weight:800; color:#4f46e5; margin:10px 0;">${this.score} PN</div>
                    <div style="margin:15px 0; min-height:40px;">
                        ${this.badges.length > 0 ? this.badges.map(b => `<span class="badge">${b}</span>`).join('') : '<span style="color:#9ca3af;">Continue treinando para desbloquear badges!</span>'}
                    </div>
                    <p style="font-size:0.95rem; color:#4b5563; margin-top:10px; font-style:italic;">
                        "Seu cérebro não é seu amigo. Ele é seu hábito. Mude o hábito e você assumirá o comando."
                    </p>
                </div>

                <button onclick="game.downloadPDF()" class="btn-primary">📄 Baixar Meu Plano (PDF)</button>
                <button onclick="location.reload()" class="btn-secondary">🔄 Reiniciar Jornada</button>
                
                <p style="margin-top:35px; font-size:0.85rem; color:#9ca3af; letter-spacing:0.5px;">
                    Desenvolvido por <strong style="color:#4f46e5;">Prof. Ricardo de Faria Barros</strong> | IBMEC-Brasília
                </p>
            </div>
        `;

        // Injeta animação lúdica se não existir
        if (!document.getElementById('ludic-style')) {
            const style = document.createElement('style');
            style.id = 'ludic-style';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
    },

    downloadPDF() {
        // Cria container temporário para impressão
        const printContainer = document.createElement('div');
        printContainer.id = 'print-container';
        printContainer.innerHTML = `
            <div class="print-certificate">
                <div class="print-header">🧠 NEUROLÍDER: PLANO DE AUTOGESTÃO</div>
                <div class="print-score">Pontuação: ${this.score} PN | Badges: ${this.badges.join(', ') || 'Em construção'}</div>
                <hr class="print-divider">
                <div class="print-title">📅 COMPROMISSO DE 3 DIAS</div>
                <ul class="print-list">
                    ${this.commitments.map(c => `<li>✅ ${c}</li>`).join('')}
                </ul>
                <hr class="print-divider">
                <p class="print-quote">"Seu cérebro não é seu amigo. Ele é seu hábito. Mude o hábito e você assumirá o comando."</p>
                <div class="print-footer">
                    <strong>Prof. Ricardo de Faria Barros</strong><br>
                    Masterclass em Autogestão e Inteligência Emocional | IBMEC-Brasília
                </div>
            </div>
            <style>
                @media print {
                    body * { visibility: hidden; }
                    #print-container, #print-container * { visibility: visible; }
                    #print-container { position: absolute; left: 0; top: 0; width: 100%; padding: 30px; font-family: system-ui, -apple-system, sans-serif; color: #111; }
                    .print-certificate { border: 3px solid #4f46e5; padding: 35px; border-radius: 12px; text-align: center; max-width: 700px; margin: 0 auto; background: #fff; }
                    .print-header { font-size: 24px; font-weight: 800; color: #4f46e5; margin-bottom: 12px; letter-spacing: 0.5px; }
                    .print-score { font-size: 15px; color: #4b5563; margin-bottom: 20px; }
                    .print-divider { border: 1.5px dashed #cbd5e1; margin: 18px 0; }
                    .print-title { font-size: 19px; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
                    .print-list { text-align: left; max-width: 550px; margin: 0 auto; padding-left: 25px; }
                    .print-list li { margin-bottom: 10px; font-size: 15px; line-height: 1.5; }
                    .print-quote { font-style: italic; color: #64748b; margin: 22px 0 0; font-size: 14px; }
                    .print-footer { font-size: 14px; color: #334155; margin-top: 35px; font-weight: 500; }
                }
                @media screen { #print-container { display: none; } }
            </style>
        `;
        document.body.appendChild(printContainer);
        
        // Aciona diálogo nativo do navegador (Salva como PDF com 1 clique)
        window.print();
        
        // Limpeza após impressão
        setTimeout(() => document.body.removeChild(printContainer), 1000);
    }
};