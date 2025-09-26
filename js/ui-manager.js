class UIManager {
    constructor() {
        this.currentView = null;
        this.views = {
            intro: `
                <div class="intro-screen" onclick="uiManager.showMainMenu()">
                    <div class="intro-content">
                        <h1 class="intro-title">Game Gerakan Dasar Workout</h1>
                        <div class="intro-media">
                            <img src="assets/animations/Intro.jpg" alt="Intro Animation" class="intro-gif">
                        </div>
                        <div class="intro-hint">
                            <p>Klik di mana saja untuk melanjutkan</p>
                        </div>
                    </div>
                </div>
            `,
            mainMenu: `
                <div class="main-menu">
                    <h1>Bersiap untuk memulai!</h1>
                    
                    <!-- Kartu Skor Keseluruhan -->
                    <div class="overall-score-card">
                        <div class="score-header">
                            <i class="fas fa-trophy"></i>
                            <h3>Skor Keseluruhan</h3>
                        </div>
                        <div class="score-content">
                            <div class="score-main">
                                <span class="score-number" id="overallScoreNumber">0</span>
                                <span class="score-label">/ 100</span>
                            </div>
                            <div class="score-details">
                                <div class="score-stat">
                                    <i class="fas fa-check-circle"></i>
                                    <span id="completedLevels">0</span> / <span id="totalLevels">5</span> Level
                                </div>
                                <div class="score-stat">
                                    <i class="fas fa-star"></i>
                                    <span id="totalScore">0</span> Total Poin
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="menu-button" onclick="uiManager.showLevelSelection()">Pilih Level</button>
                    <button class="menu-button" onclick="uiManager.showTutorial()">Tutorial</button>
                    <button class="menu-button" onclick="uiManager.showSettings()">Pengaturan</button>
                </div>
            `,
            levelSelection: `
                <div class="level-selection">
                    <div class="back-button" onclick="uiManager.backToMainMenu()">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                    <h2>Pilih Level</h2>
                    <div class="levels-grid" id="levelsGrid"></div>
                    <div class="reset-section">
                        <button class="menu-button" id="resetProgressBtn">Reset Progres</button>
                    </div>
                </div>
            `,
            gameLevel: `
                <div class="game-level">
                    <div class="header-bar">
                        <div class="level-info">
                            <span id="levelTitle"></span>
                        </div>
                        <div class="timer" id="timer">0:00</div>
                        
                        <div class="xp-counter" id="xpCounter">0 XP</div>
                        <button class="surrender-btn" onclick="uiManager.surrenderLevel()" title="Menyerah">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="game-container">
                        <div class="camera-container">
                            <video id="video" style="position: absolute; width: 100%; height: 100%; object-fit: cover;"></video>
                            <canvas id="canvas" style="position: absolute; width: 100%; height: 100%;"></canvas>
                            <div id="countdown" class="countdown" style="display: none;">Bersiap !</div>
                        </div>
                        <div class="reference-container">
                            <img id="referenceAnimation" alt="Exercise Reference">
                            <div id="feedback" class="feedback-text">Bersiap!</div>
                        </div>
                    </div>
                </div>

                <!-- Modal Mulai Level -->
                <div class="modal fade" id="startModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
                    <div class="modal-dialog modal-lg modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Instruksi Level</h5>
                            </div>
                            <div class="modal-body">
                                <div class="instruction-container">
                                    <div class="instruction-image-container">
                                        <img id="instructionImage" alt="Exercise Instruction" class="instruction-image">
                                    </div>
                                    <div class="instruction-text">
                                        <p id="levelInstructions"></p>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" onclick="uiManager.backToLevelSelection()">
                                    <i class="fas fa-arrow-left"></i> Kembali
                                </button>
                                <button type="button" class="btn btn-primary" onclick="uiManager.startLevel()">
                                    <i class="fas fa-play"></i> Mulai Level
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Hasil -->
                <div class="modal fade" id="resultsModal" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content results-modal">
                            <div class="modal-header results-header">
                                <div class="results-icon-container">
                                    <i class="results-icon" id="resultsIcon"></i>
                                </div>
                                <h3 class="modal-title results-title" id="resultsTitle"></h3>
                            </div>
                            <div class="modal-body results-body">
                                <div class="results-stats">
                                    <div class="stat-card score-card">
                                        <div class="stat-icon">
                                            <i class="fas fa-target"></i>
                                        </div>
                                        <div class="stat-content">
                                            <div class="stat-label">Skor Anda</div>
                                            <div class="stat-value" id="resultsScoreValue">0%</div>
                                            <div class="stat-description" id="resultsScoreDesc">Target: 70%</div>
                                        </div>
                                    </div>
                                    
                                    <div class="stat-card xp-card">
                                        <div class="stat-icon">
                                            <i class="fas fa-star"></i>
                                        </div>
                                        <div class="stat-content">
                                            <div class="stat-label">XP Diperoleh</div>
                                            <div class="stat-value" id="resultsXPValue">+0 XP</div>
                                            <div class="stat-description" id="resultsXPDesc">Pengalaman</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="results-message-container">
                                    <div class="results-message" id="resultsMessage"></div>
                                </div>
                                
                                <div class="progress-bar-container" id="progressBarContainer" style="display: none;">
                                    <div class="progress-label">Progress Level</div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" id="progressFill"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer results-footer">
                                <button type="button" class="btn btn-secondary results-btn" onclick="uiManager.closeResultsAndShowLevelSelection()">
                                    <i class="fas fa-list"></i> Pilih Level
                                </button>
                                <button type="button" class="btn btn-primary results-btn" id="retryBtn" onclick="uiManager.retryLevel()">
                                    <i class="fas fa-redo"></i> Coba Lagi
                                </button>
                                <button type="button" class="btn btn-success results-btn" id="nextLevelBtn" onclick="uiManager.nextLevel()">
                                    <i class="fas fa-arrow-right"></i> Level Berikutnya
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            settings: `
                <div class="settings">
                    <div class="back-button" onclick="uiManager.backToMainMenu()">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                    <h2>Pengaturan</h2>
                    <div class="settings-container">
                        <div class="setting-item">
                            <div class="setting-icon">
                                <i class="fas fa-palette"></i>
                            </div>
                            <div class="setting-content">
                                <label>Tema</label>
                                <select id="themeSelect" onchange="uiManager.updateTheme(this.value)">
                                    <option value="light">Terang</option>
                                    <option value="dark">Gelap</option>
                                </select>
                            </div>
                        </div>
                        <div class="setting-item">
                            <div class="setting-icon">
                                <i class="fas fa-music"></i>
                            </div>
                            <div class="setting-content">
                                <label>Musik Latar</label>
                                <input type="checkbox" id="bgMusicToggle" onchange="uiManager.updateAudioSettings()">
                            </div>
                        </div>
                        <div class="setting-item">
                            <div class="setting-icon">
                                <i class="fas fa-volume-up"></i>
                            </div>
                            <div class="setting-content">
                                <label>Efek Suara</label>
                                <input type="checkbox" id="sfxToggle" onchange="uiManager.updateAudioSettings()">
                            </div>
                        </div>
                        <div class="setting-item">
                            <div class="setting-icon">
                                <i class="fas fa-sliders-h"></i>
                            </div>
                            <div class="setting-content">
                                <label>Volume</label>
                                <input type="range" id="volumeSlider" min="0" max="1" step="0.1" 
                                    onchange="uiManager.updateAudioSettings()">
                            </div>
                        </div>
                    </div>
                    <div class="reset-section">
                        <button class="menu-button" id="resetSettingsBtn">Reset Pengaturan</button>
                    </div>
                </div>
            `,
            tutorial: `
                <div class="tutorial">
                    <div class="back-button" onclick="uiManager.backToMainMenu()">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                    <h1 class="tutorial-title">CARA BERMAIN</h1>
                    
                    <div class="tutorial-content">
                        <div class="tutorial-prolog">
                            <p>Game ini merupakan game gerakan dasar workout dengan mekanisme gameplay menggunakan kamera yang akan mendeteksi gerakan kamu, untuk lebih jelasnya kamu bisa baca tutorial gameplay berikut ini</p>
                        </div>

                        <div class="tutorial-steps">
                            <div class="tutorial-step">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h3>Pilih level yang ingin dimainkan pada menu pilih level</h3>
                                    <div class="step-image">
                                        <img src="assets/Tutorial/Tutor1.jpg" alt="Tutorial 1 - Pilih Level" class="tutorial-img">
                                    </div>
                                </div>
                            </div>

                            <div class="tutorial-step">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h3>Saat memulai level, masing-masing level akan memiliki instruksi gerakan sesuai dengan level yang dimainkan</h3>
                                    <div class="step-image">
                                        <img src="assets/Tutorial/Tutor2.jpg" alt="Tutorial 2 - Instruksi Level" class="tutorial-img">
                                    </div>
                                </div>
                            </div>

                            <div class="tutorial-step">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h3>Terdapat beberapa elemen game yang bisa kamu perhatikan saat game dimulai</h3>
                                    <div class="step-images-grid">
                                        <img src="assets/Tutorial/Tutor3.jpg" alt="Tutorial 3 - Elemen Game 1" class="tutorial-img">
                                        <img src="assets/Tutorial/Tutor4.jpg" alt="Tutorial 4 - Elemen Game 2" class="tutorial-img">
                                    </div>
                                </div>
                            </div>

                            <div class="tutorial-step">
                                <div class="step-number">4</div>
                                <div class="step-content">
                                    <h3>Terdapat perbedaan yang disarankan untuk peletakan kamera di beberapa level</h3>
                                    <div class="step-image">
                                        <img src="assets/Tutorial/Tutor5.jpg" alt="Tutorial 5 - Posisi Kamera" class="tutorial-img">
                                    </div>
                                </div>
                            </div>

                            <div class="tutorial-step">
                                <div class="step-number">5</div>
                                <div class="step-content">
                                    <h3>Pada window kamera kamu akan melihat Landmark overlay yang menandakan titik-titik tubuh yang terdeteksi, kamu bisa jadikan contoh berikut sebagai gambaran tangkapan kamera untuk tubuh kamu di setiap masing-masing gerakan</h3>
                                    
                                    <div class="exercise-carousel">
                                        <div class="carousel-container">
                                            <button class="carousel-btn prev-btn" onclick="uiManager.prevExercise()">
                                                <i class="fas fa-chevron-left"></i>
                                            </button>
                                            
                                            <div class="carousel-content">
                                                <div class="exercise-slide active" data-exercise="jumpingjack">
                                                    <h4>Jumping Jack</h4>
                                                    <img src="assets/Tutorial/TutorJumpingJack.gif" alt="Tutorial Jumping Jack" class="exercise-gif">
                                                </div>
                                                <div class="exercise-slide" data-exercise="squat">
                                                    <h4>Squat</h4>
                                                    <img src="assets/Tutorial/TutorSquat.gif" alt="Tutorial Squat" class="exercise-gif">
                                                </div>
                                                <div class="exercise-slide" data-exercise="lunges">
                                                    <h4>Lunges</h4>
                                                    <img src="assets/Tutorial/TutorLunges.gif" alt="Tutorial Lunges" class="exercise-gif">
                                                </div>
                                                <div class="exercise-slide" data-exercise="pushup">
                                                    <h4>Push Up</h4>
                                                    <img src="assets/Tutorial/TutorPushUp.gif" alt="Tutorial Push Up" class="exercise-gif">
                                                </div>
                                                <div class="exercise-slide" data-exercise="plank">
                                                    <h4>Plank</h4>
                                                    <img src="assets/Tutorial/TutorPlank.gif" alt="Tutorial Plank" class="exercise-gif">
                                                </div>
                                            </div>
                                            
                                            <button class="carousel-btn next-btn" onclick="uiManager.nextExercise()">
                                                <i class="fas fa-chevron-right"></i>
                                            </button>
                                        </div>
                                        
                                        <div class="carousel-indicators">
                                            <span class="indicator active" onclick="uiManager.goToExercise(0)"></span>
                                            <span class="indicator" onclick="uiManager.goToExercise(1)"></span>
                                            <span class="indicator" onclick="uiManager.goToExercise(2)"></span>
                                            <span class="indicator" onclick="uiManager.goToExercise(3)"></span>
                                            <span class="indicator" onclick="uiManager.goToExercise(4)"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="tutorial-step">
                                <div class="step-number">6</div>
                                <div class="step-content">
                                    <h3>Setelah menyelesaikan level, jika kamu berhasil maka kamu bisa lanjut ke level berikutnya, jika gagal kamu dapat mengulang kembali level tersebut</h3>
                                    <div class="step-image">
                                        <img src="assets/Tutorial/Tutor6.jpg" alt="Tutorial 6 - Hasil Level" class="tutorial-img">
                                    </div>
                                </div>
                            </div>

                            <div class="tutorial-step">
                                <div class="step-number">7</div>
                                <div class="step-content">
                                    <h3>Jika kamu menggunakan HP, disarankan untuk memutar layar ke posisi horizontal, atau buka pengaturan setting browser dan pilih situs desktop (biasanya ada dititik tiga kanan atas browser)</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Back to Top Button -->
                    <button class="back-to-top-btn" id="backToTopBtn" onclick="uiManager.scrollToTop()" title="Kembali ke Atas">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                </div>
            `
        };
    }

    initialize() {
        // Load Font Awesome for icons
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(fontAwesome);

        // Inisialisasi pengaturan dari penyimpanan
        const progress = storageManager.getProgress();
        document.documentElement.setAttribute('data-theme', progress.settings.theme);
        
        // Inisialisasi pengaturan audio manager
        audioManager.updateSettings(progress.settings.audio);
        
        this.showIntro(); // Tampilkan layar intro terlebih dahulu
    }

    setView(viewName) {
        // Bersihkan modal yang sudah ada
        const existingModals = document.querySelectorAll('.modal');
        existingModals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.dispose();
            }
        });

        // Bersihkan DOM
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = this.views[viewName];
        this.currentView = viewName;

        // Putar backsound yang sesuai berdasarkan tampilan
        if (viewName === 'gameLevel') {
            audioManager.playBacksound('level');
        } else {
            audioManager.playBacksound('menu');
        }

        // Tambahkan suara klik ke semua tombol
        this.addClickSoundToButtons();

        if (viewName === 'levelSelection') {
            this.renderLevelGrid();
        } else if (viewName === 'settings') {
            this.initializeSettings();
        } else if (viewName === 'tutorial') {
            this.currentExerciseIndex = 0; // Initialize carousel index
        }

        // Pastikan container modal konfirmasi ada
        this.ensureConfirmModal();
    }

    addClickSoundToButtons() {
        // Tambahkan suara klik ke semua tombol dan elemen yang dapat diklik
        const buttons = document.querySelectorAll('button, .menu-button, .level-button, .back-button, .icon-circle, .setting-icon, .back-to-top-btn, .carousel-btn, .indicator');
        buttons.forEach(button => {
            if (!button.hasAttribute('data-click-sound-added')) {
                button.addEventListener('click', () => {
                    audioManager.playKlik();
                });
                button.setAttribute('data-click-sound-added', 'true');
            }
        });

        // Tambahkan suara klik ke layar intro
        const introScreen = document.querySelector('.intro-screen');
        if (introScreen && !introScreen.hasAttribute('data-click-sound-added')) {
            introScreen.addEventListener('click', () => {
                audioManager.playKlik();
            });
            introScreen.setAttribute('data-click-sound-added', 'true');
        }
    }

    showIntro() {
        this.setView('intro');
    }

    showMainMenu() {
        if (this.currentView === 'gameLevel') {
            gameManager.cleanup();
            
            // Sembunyikan tombol menyerah saat meninggalkan level game
            const surrenderBtn = document.querySelector('.surrender-btn');
            if (surrenderBtn) {
                surrenderBtn.style.display = 'none';
            }
        }
        this.setView('mainMenu');
        this.updateOverallScore();
    }

    updateOverallScore() {
        const overallScore = storageManager.getOverallScore();
        
        // Perbarui nomor skor utama
        const scoreNumberElement = document.getElementById('overallScoreNumber');
        if (scoreNumberElement) {
            scoreNumberElement.textContent = overallScore.average;
        }
        
        // Perbarui level yang telah selesai
        const completedLevelsElement = document.getElementById('completedLevels');
        if (completedLevelsElement) {
            completedLevelsElement.textContent = overallScore.completedLevels;
        }
        
        // Perbarui total level
        const totalLevelsElement = document.getElementById('totalLevels');
        if (totalLevelsElement) {
            totalLevelsElement.textContent = overallScore.totalLevels;
        }
        
        // Perbarui total skor
        const totalScoreElement = document.getElementById('totalScore');
        if (totalScoreElement) {
            totalScoreElement.textContent = overallScore.total;
        }
    }

    showLevelSelection() {
        if (this.currentView === 'gameLevel') {
            gameManager.cleanup();
            
            // Sembunyikan tombol menyerah saat meninggalkan level game
            const surrenderBtn = document.querySelector('.surrender-btn');
            if (surrenderBtn) {
                surrenderBtn.style.display = 'none';
            }
        }
        this.setView('levelSelection');
    }

    showSettings() {
        this.setView('settings');
    }

    showTutorial() {
        this.setView('tutorial');
        this.currentExerciseIndex = 0; // Initialize carousel
    }

    backToMainMenu() {
        this.showMainMenu();
        this.updateOverallScore();
    }

    renderLevelGrid() {
        const levelsGrid = document.getElementById('levelsGrid');
        levelsGrid.innerHTML = ''; // Bersihkan konten yang ada
        const progress = storageManager.getProgress();

        CONFIG.LEVELS.forEach(level => {
            const isUnlocked = progress.unlockedLevels.includes(level.id);
            const score = storageManager.getLevelScore(level.id);
            
            const levelButton = document.createElement('div');
            levelButton.className = `level-button ${isUnlocked ? '' : 'locked'}`;
            levelButton.innerHTML = `
                <div class="level-button-content">
                    <span class="level-number">Level ${level.id}</span>
                    ${isUnlocked ? `
                        <div class="level-details">
                            <span class="exercise-name">${level.name.split(' ')[0]}</span>
                            ${score > 0 ? `<span class="high-score">Skor: ${score}%</span>` : ''}
                        </div>
                    ` : ''}
                    ${isUnlocked ? '' : '<i class="fas fa-lock"></i>'}
                </div>
            `;

            if (isUnlocked) {
                levelButton.onclick = () => {
                    audioManager.playKlik();
                    this.startGameLevel(level.id);
                };
            }

            levelsGrid.appendChild(levelButton);
        });

        // Tambahkan event listener untuk tombol reset progress
        const resetBtn = document.getElementById('resetProgressBtn');
        if (resetBtn) {
            resetBtn.onclick = () => {
                audioManager.playKlik();
                this.showConfirm('Reset Progres', 'Apakah Anda yakin ingin mereset semua progres? Anda akan memulai dari level 1 kembali.', () => {
                    storageManager.resetProgress();
                    this.renderLevelGrid(); // Refresh level grid setelah reset
                });
            };
        }
    }

    async startGameLevel(levelId) {
        this.setView('gameLevel');
        await gameManager.initializeLevel(levelId);
        
        // Tampilkan modal mulai dengan instruksi dan gambar
        const startModal = new bootstrap.Modal(document.getElementById('startModal'));
        const level = CONFIG.LEVELS.find(l => l.id === levelId);
        
        // Atur teks instruksi
        // Format the instruction text with score requirement
        const instructionText = `${level.instruction}\n\n🔹 Skor Minimum: ${level.requiredScore}% untuk menyelesaikan level\n🔹 XP yang didapat: ${level.xpReward} XP`;
        document.getElementById('levelInstructions').innerHTML = instructionText.replace(/\n/g, '<br>');
        document.getElementById('instructionImage').src = level.gifUrl;
        const instructionImage = document.getElementById('instructionImage');
        let imagePath;
        
        switch(level.exercise) {
            case 'jumpingjack':
                imagePath = 'assets/animations/Grid_JumpingJack.png';
                break;
            case 'squat':
                imagePath = 'assets/animations/Grid_Squat.png';
                break;
            case 'lunge':
                imagePath = 'assets/animations/Grid_Lunges.png';
                break;
            case 'pushup':
                imagePath = 'assets/animations/Grid_PushUp.png';
                break;
            case 'plank':
                imagePath = 'assets/animations/Grid_Plank.png';
                break;
            default:
                imagePath = 'assets/animations/Grid.png'; // fallback
        }
        
        instructionImage.src = imagePath;
        instructionImage.onerror = function() {
            // Jika gambar tidak ada, sembunyikan container gambar
            this.style.display = 'none';
        };
        instructionImage.onload = function() {
            // Tampilkan container gambar ketika gambar berhasil dimuat
            this.style.display = 'block';
        };
        
        // Putar suara notifikasi
        audioManager.playNotif();
        
        startModal.show();
    }

    startLevel() {
        const startModal = bootstrap.Modal.getInstance(document.getElementById('startModal'));
        startModal.hide();
        
        // Tampilkan tombol menyerah ketika level dimulai
        const surrenderBtn = document.querySelector('.surrender-btn');
        if (surrenderBtn) {
            surrenderBtn.style.display = 'flex';
        }
        
        gameManager.startLevel();
    }

    backToLevelSelection() {
        const startModal = bootstrap.Modal.getInstance(document.getElementById('startModal'));
        startModal.hide();
        // Hentikan kamera sebelum kembali ke pemilihan level
        poseDetector.stopCamera();
        // Hentikan musik level dan putar backsound menu secara eksplisit
        audioManager.stopLevelMusic();
        audioManager.playBacksound('menu');
        this.showLevelSelection();
    }

    retryLevel() {
        const resultsModal = bootstrap.Modal.getInstance(document.getElementById('resultsModal'));
        if (resultsModal) {
            resultsModal.hide();
        }
        // Hentikan kamera sebelum mencoba lagi
        poseDetector.stopCamera();
        // Tambahkan delay untuk memastikan modal benar-benar tertutup
        setTimeout(() => {
            this.startGameLevel(gameManager.currentLevel.id);
        }, 300);
    }

    nextLevel() {
        const resultsModal = bootstrap.Modal.getInstance(document.getElementById('resultsModal'));
        if (resultsModal) {
            resultsModal.hide();
        }
        // Hentikan kamera sebelum pergi ke level berikutnya
        poseDetector.stopCamera();
        // Tambahkan delay untuk memastikan modal benar-benar tertutup
        setTimeout(() => {
            const nextLevelId = gameManager.currentLevel.id + 1;
            if (nextLevelId <= CONFIG.LEVELS.length) {
                this.startGameLevel(nextLevelId);
            } else {
                this.showLevelSelection();
            }
        }, 300);
    }

    closeResultsAndShowLevelSelection() {
        const resultsModal = bootstrap.Modal.getInstance(document.getElementById('resultsModal'));
        if (resultsModal) {
            resultsModal.hide();
        }
        // Hentikan kamera sebelum kembali ke pemilihan level
        poseDetector.stopCamera();
        this.showLevelSelection();
        this.updateOverallScore();
    }

    surrenderLevel() {
        this.showConfirm('Konfirmasi Menyerah', 'Apakah Anda yakin ingin menyerah? Level ini akan dihitung sebagai gagal.', () => {
            audioManager.playGagal();
            gameManager.isGameRunning = false;
            clearInterval(gameManager.gameTimer);
            clearInterval(gameManager.exerciseTracker);
            poseDetector.stopDetection();
            poseDetector.stopCamera();
            const surrenderBtn = document.querySelector('.surrender-btn');
            if (surrenderBtn) {
                surrenderBtn.style.display = 'none';
            }
            gameManager.showResults(true);
        });
    }

    initializeSettings() {
        const progress = storageManager.getProgress();
        const settings = progress.settings;

        document.getElementById('themeSelect').value = settings.theme;
        document.getElementById('bgMusicToggle').checked = settings.audio.bgMusic;
        document.getElementById('sfxToggle').checked = settings.audio.sfx;
        document.getElementById('volumeSlider').value = settings.audio.volume;

        // Tambahkan event listener untuk tombol reset settings
        const resetBtn = document.getElementById('resetSettingsBtn');
        if (resetBtn) {
            resetBtn.onclick = () => {
                audioManager.playKlik();
                this.showConfirm('Reset Pengaturan', 'Apakah Anda yakin ingin mereset semua pengaturan ke default?', () => {
                    const defaultSettings = storageManager.resetSettings();
                    // Update tema
                    document.documentElement.setAttribute('data-theme', defaultSettings.theme);
                    // Update audio manager
                    audioManager.updateSettings(defaultSettings.audio);
                    this.initializeSettings(); // Refresh settings setelah reset
                });
            };
        }
    }

    updateTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        storageManager.updateSettings({ theme });
    }

    updateAudioSettings() {
        const settings = {
            audio: {
                bgMusic: document.getElementById('bgMusicToggle').checked,
                sfx: document.getElementById('sfxToggle').checked,
                volume: parseFloat(document.getElementById('volumeSlider').value)
            }
        };
        storageManager.updateSettings(settings);
        
        // Perbarui pengaturan audio manager
        audioManager.updateSettings(settings.audio);
    }

    // Utilitas: Pastikan modal konfirmasi yang dapat digunakan kembali ada di DOM
    ensureConfirmModal() {
        if (document.getElementById('confirmModal')) return;
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="modal fade" id="confirmModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="confirmTitle"></h5>
                        </div>
                        <div class="modal-body" id="confirmMessage"></div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="confirmCancelBtn">Batal</button>
                            <button type="button" class="btn btn-danger" id="confirmOkBtn">Ya</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container);
    }

    // Utilitas: Tampilkan modal konfirmasi dengan callback saat dikonfirmasi
    showConfirm(title, message, onConfirm) {
        this.ensureConfirmModal();
        const modalEl = document.getElementById('confirmModal');
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        const cancelBtn = document.getElementById('confirmCancelBtn');
        const okBtn = document.getElementById('confirmOkBtn');

        const bsModal = new bootstrap.Modal(modalEl);

        const cleanup = () => {
            okBtn.replaceWith(okBtn.cloneNode(true));
            cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        };

        // Bind ulang setelah clone untuk listener yang segar
        setTimeout(() => {
            const newOk = document.getElementById('confirmOkBtn');
            const newCancel = document.getElementById('confirmCancelBtn');
            newOk.addEventListener('click', () => {
                bsModal.hide();
                onConfirm && onConfirm();
            }, { once: true });
            newCancel.addEventListener('click', () => bsModal.hide(), { once: true });
        }, 0);

        bsModal.show();
    }

    // Carousel functionality for tutorial exercises
    nextExercise() {
        const slides = document.querySelectorAll('.exercise-slide');
        const indicators = document.querySelectorAll('.carousel-indicators .indicator');
        
        if (slides.length === 0) return;
        
        // Remove active class from current slide and indicator
        slides[this.currentExerciseIndex].classList.remove('active');
        indicators[this.currentExerciseIndex].classList.remove('active');
        
        // Move to next slide
        this.currentExerciseIndex = (this.currentExerciseIndex + 1) % slides.length;
        
        // Add active class to new slide and indicator
        slides[this.currentExerciseIndex].classList.add('active');
        indicators[this.currentExerciseIndex].classList.add('active');
    }

    prevExercise() {
        const slides = document.querySelectorAll('.exercise-slide');
        const indicators = document.querySelectorAll('.carousel-indicators .indicator');
        
        if (slides.length === 0) return;
        
        // Remove active class from current slide and indicator
        slides[this.currentExerciseIndex].classList.remove('active');
        indicators[this.currentExerciseIndex].classList.remove('active');
        
        // Move to previous slide
        this.currentExerciseIndex = (this.currentExerciseIndex - 1 + slides.length) % slides.length;
        
        // Add active class to new slide and indicator
        slides[this.currentExerciseIndex].classList.add('active');
        indicators[this.currentExerciseIndex].classList.add('active');
    }

    goToExercise(index) {
        const slides = document.querySelectorAll('.exercise-slide');
        const indicators = document.querySelectorAll('.carousel-indicators .indicator');
        
        if (slides.length === 0 || index < 0 || index >= slides.length) return;
        
        // Remove active class from current slide and indicator
        slides[this.currentExerciseIndex].classList.remove('active');
        indicators[this.currentExerciseIndex].classList.remove('active');
        
        // Move to specified slide
        this.currentExerciseIndex = index;
        
        // Add active class to new slide and indicator
        slides[this.currentExerciseIndex].classList.add('active');
        indicators[this.currentExerciseIndex].classList.add('active');
    }

    // Scroll to top functionality for tutorial page
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Buat instance global
const uiManager = new UIManager(); 