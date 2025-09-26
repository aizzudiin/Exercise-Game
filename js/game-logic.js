class GameManager {
    constructor() {
        this.currentLevel = null;
        this.isGameRunning = false;
        this.countdownTimer = null;
        this.gameTimer = null;
        this.score = 0;
    }

    async initializeLevel(levelId) {
        this.currentLevel = CONFIG.LEVELS.find(l => l.id === levelId);
        if (!this.currentLevel) throw new Error('Invalid level ID');

        // Initialize UI elements
        document.getElementById('levelTitle').textContent = this.currentLevel.name;
        document.getElementById('timer').textContent = this.formatTime(this.currentLevel.duration);
        document.getElementById('xpCounter').textContent = `0/${this.currentLevel.xpReward} XP`;
        
        // Load reference animation
        const referenceImg = document.getElementById('referenceAnimation');
        referenceImg.src = this.currentLevel.gifUrl;

        // Initialize video elements
        const videoElement = document.getElementById('video');
        const canvasElement = document.getElementById('canvas');
        await poseDetector.initialize(videoElement, canvasElement);
        await poseDetector.startCamera();
    }

    startCountdown() {
        return new Promise((resolve) => {
            let countdown = CONFIG.COUNTDOWN_DURATION;
            const countdownElement = document.getElementById('countdown');
            countdownElement.style.display = 'block';

            this.countdownTimer = setInterval(() => {
                countdownElement.textContent = countdown;
                if (countdown <= 0) {
                    clearInterval(this.countdownTimer);
                    countdownElement.style.display = 'none';
                    resolve();
                }
                countdown--;
            }, 1000);
        });
    }

    async startLevel() {
        await this.startCountdown();
        this.isGameRunning = true;
        this.score = 0;
        poseDetector.startDetection();
        this.startGameTimer();
        this.startExerciseTracking();
    }

    stopLevel() {
        this.isGameRunning = false;
        clearInterval(this.gameTimer);
        clearInterval(this.exerciseTracker);
        poseDetector.stopDetection();
        poseDetector.stopCamera(); // Stop camera when level ends
        
        // Hide surrender button when level stops
        const surrenderBtn = document.querySelector('.surrender-btn');
        if (surrenderBtn) {
            surrenderBtn.style.display = 'none';
        }
        
        this.showResults();
    }

    startGameTimer() {
        let timeRemaining = this.currentLevel.duration;
        const timerElement = document.getElementById('timer');

        this.gameTimer = setInterval(() => {
            timeRemaining--;
            timerElement.textContent = this.formatTime(timeRemaining);

            if (timeRemaining <= 0) {
                this.stopLevel();
            }
        }, 1000);
    }

    // updateScore removed: score display no longer used

    startExerciseTracking() {
        this.exerciseTracker = setInterval(() => {
            if (!this.isGameRunning) return;

            let isCorrectPose = false;
            let progress = 0;
            let currentScore = 0;

            switch (this.currentLevel.exercise) {
                case 'squat':
                    isCorrectPose = poseDetector.detectSquat();
                    progress = (poseDetector.getExerciseCount() / this.currentLevel.targetReps) * 100;
                    break;
                case 'pushup':
                    isCorrectPose = poseDetector.detectPushup();
                    progress = (poseDetector.getExerciseCount() / this.currentLevel.targetReps) * 100;
                    break;
                case 'plank':
                    isCorrectPose = poseDetector.detectPlank();
                    progress = (poseDetector.getPlankDuration() / this.currentLevel.targetDuration) * 100;
                    break;
                case 'jumpingjack':
                    isCorrectPose = poseDetector.detectJumpingJack();
                    progress = (poseDetector.getExerciseCount() / this.currentLevel.targetReps) * 100;
                    break;
                case 'lunge':
                    isCorrectPose = poseDetector.detectLunge();
                    progress = (poseDetector.getExerciseCount() / this.currentLevel.targetReps) * 100;
                    break;
            }

            // Update feedback
            this.updateFeedback(isCorrectPose);
            
            // Update progress
            progress = Math.min(progress, 100);
            this.score = Math.round(progress);
            document.getElementById('xpCounter').textContent = 
                `${Math.round((this.score / 100) * this.currentLevel.xpReward)}/${this.currentLevel.xpReward} XP`;
                
            // Check if score reached 100% and complete the level
            if (this.score >= 100) {
                this.stopLevel();
            }
        }, 100);
    }

    updateFeedback(isCorrectPose) {
        const feedbackElement = document.getElementById('feedback');
        if (isCorrectPose) {
            feedbackElement.textContent = 'Mantap! Pertahankan gerakannya!';
            feedbackElement.className = 'feedback-text success';
        } else {
            feedbackElement.textContent = 'Perbaiki posisi tubuh';
            feedbackElement.className = 'feedback-text warning';
        }
    }

    showResults(surrendered = false) {
        const isSuccess = this.score >= this.currentLevel.requiredScore;
        const earnedXP = surrendered ? 0 : Math.round((this.score / 100) * this.currentLevel.xpReward);
        
        // Stop camera and detection immediately when showing results
        poseDetector.stopDetection();
        poseDetector.stopCamera();
        
        // Update progress in storage (only if not surrendered)
        if (!surrendered) {
            storageManager.updateLevelProgress(this.currentLevel.id, this.score);
        }

        // Stop level music and resume backsound when level results appear
        audioManager.onLevelComplete();

        // Play appropriate sound based on result
        if (surrendered) {
            audioManager.playGagal();
        } else if (isSuccess) {
            audioManager.playBerhasil();
        } else {
            audioManager.playGagal();
        }

        // Clean up any existing modal instances first
        const existingModal = bootstrap.Modal.getInstance(document.getElementById('resultsModal'));
        if (existingModal) {
            existingModal.dispose();
        }

        // Show results modal
        const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));
        
        // Update header styling and icon based on result
        const resultsHeader = document.querySelector('.results-header');
        const resultsIcon = document.getElementById('resultsIcon');
        const resultsTitle = document.getElementById('resultsTitle');
        const resultsMessage = document.getElementById('resultsMessage');
        
        if (surrendered) {
            resultsHeader.className = 'modal-header results-header failure';
            resultsIcon.className = 'results-icon fas fa-times-circle';
            resultsTitle.textContent = 'Level Gagal';
            resultsMessage.textContent = this.getMotivationMessage(false);
        } else if (isSuccess) {
            resultsHeader.className = 'modal-header results-header success';
            resultsIcon.className = 'results-icon fas fa-trophy';
            resultsTitle.textContent = 'Level Selesai!';
            resultsMessage.textContent = this.getAppreciationMessage();
        } else {
            resultsHeader.className = 'modal-header results-header failure';
            resultsIcon.className = 'results-icon fas fa-exclamation-triangle';
            resultsTitle.textContent = 'Coba Lagi!';
            resultsMessage.textContent = this.getMotivationMessage(false);
        }
        
        // Update score and XP values
        document.getElementById('resultsScoreValue').textContent = `${this.score}%`;
        document.getElementById('resultsScoreDesc').textContent = `Target: ${this.currentLevel.requiredScore}%`;
        
        if (surrendered) {
            document.getElementById('resultsXPValue').textContent = '+0 XP';
            document.getElementById('resultsXPDesc').textContent = 'Menyerah';
        } else {
            document.getElementById('resultsXPValue').textContent = `+${earnedXP} XP`;
            document.getElementById('resultsXPDesc').textContent = isSuccess ? 'Berhasil!' : 'Coba Lagi';
        }
        
        // Update buttons
        document.getElementById('nextLevelBtn').style.display = (isSuccess && !surrendered) ? 'block' : 'none';
        document.getElementById('retryBtn').style.display = 'block';
        
        // Add a delay to ensure DOM is ready
        setTimeout(() => {
            resultsModal.show();
        }, 200);
    }

    cleanup() {
        this.isGameRunning = false;
        clearInterval(this.countdownTimer);
        clearInterval(this.gameTimer);
        clearInterval(this.exerciseTracker);
        poseDetector.stopCamera();
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    getAppreciationMessage() {
        switch (this.currentLevel.exercise) {
            case 'squat':
                return 'Hebat! Squat-mu stabil dan kuat. Terus tingkatkan repetisinya!';
            case 'pushup':
                return 'Luar biasa! Push-up kamu sangat bagus. Dada dan tricep kamu akan semakin kuat!';
            case 'plank':
                return 'Mantap! Plank kamu sangat solid. Otot perut kamu akan semakin kuat!';
            case 'jumpingjack':
                return 'Keren! Jumping jack yang energik. Stamina kamu sangat baik!';
            case 'lunge':
                return 'Bagus sekali! Lunge kamu hebat. Keseimbangan dan kekuatan kaki kamu akan semakin meningkat!';
            default:
                return 'Kerja bagus! Pertahankan performanya!';
        }
    }

    getMotivationMessage() {
        switch (this.currentLevel.exercise) {
            case 'squat':
                return 'Setiap turunan squat yang kamu lakukan meski belum sempurna, tetap membuat kakimu semakin kuat, jangan menyerah!.';
            case 'pushup':
                return 'Push-up pertamamu mungkin berat, tapi tiap usaha kecil itu sedang membangun kekuatan besar dalam dirimu, jangan menyerah!.';
            case 'plank':
                return 'Plank itu memang terasa berat, tapi detik demi detik yang kamu tahan adalah bukti ketangguhanmu, jangan menyerah!.';
            case 'jumpingjack':
                return 'Jumping jack-mu mungkin masih berantakan, tapi tiap lompatan adalah langkah menuju stamina yang lebih baik, jangan menyerah!.';
            case 'lunge':
                return 'Lunge-mu belum sempurna? Tidak apa-apa, karena setiap percobaan membuat keseimbanganmu semakin kokoh, jangan menyerah!.';
            default:
                return 'Tetap semangat! Perbaiki teknik sedikit lagi pasti bisa.';
        }
    }
}

// Create a global instance
const gameManager = new GameManager(); 