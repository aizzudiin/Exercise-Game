class StorageManager {
    constructor() {
        this.storageKey = CONFIG.STORAGE_KEY;
        this.initializeStorage();
    }

    initializeStorage() {
        if (!this.getProgress()) {
            const initialData = {
                currentLevel: 1,
                unlockedLevels: [1],
                scores: {},
                settings: {
                    theme: CONFIG.THEME.current,
                    audio: { ...CONFIG.AUDIO }
                }
            };
            this.saveProgress(initialData);
        }
    }

    getProgress() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    saveProgress(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    updateLevelProgress(levelId, score) {
        const progress = this.getProgress();
        const level = CONFIG.LEVELS.find(l => l.id === levelId);
        progress.scores[levelId] = Math.max(score, progress.scores[levelId] || 0);
        if (score >= level.requiredScore && levelId < CONFIG.LEVELS.length) {
            const nextLevelId = levelId + 1;
            if (!progress.unlockedLevels.includes(nextLevelId)) {
                progress.unlockedLevels.push(nextLevelId);
                progress.currentLevel = nextLevelId;
            }
        }
        this.saveProgress(progress);
        return progress;
    }

    isLevelUnlocked(levelId) {
        const progress = this.getProgress();
        return progress.unlockedLevels.includes(levelId);
    }

    getLevelScore(levelId) {
        const progress = this.getProgress();
        return progress.scores[levelId] || 0;
    }

    getOverallScore() {
        const progress = this.getProgress();
        const scores = Object.values(progress.scores);
        
        if (scores.length === 0) {
            return {
                average: 0,
                total: 0,
                completedLevels: 0,
                totalLevels: CONFIG.LEVELS.length
            };
        }
        
        const total = scores.reduce((sum, score) => sum + score, 0);
        const average = Math.round(total / scores.length);
        
        return {
            average: average,
            total: total,
            completedLevels: scores.length,
            totalLevels: CONFIG.LEVELS.length
        };
    }

    updateSettings(settings) {
        const progress = this.getProgress();
        progress.settings = { ...progress.settings, ...settings };
        this.saveProgress(progress);
        return progress.settings;
    }

    resetProgress() {
        localStorage.removeItem(this.storageKey);
        this.initializeStorage();
    }

    resetSettings() {
        const progress = this.getProgress();
        // Reset hanya settings, pertahankan progress level dan skor
        progress.settings = {
            theme: CONFIG.THEME.current,
            audio: { ...CONFIG.AUDIO }
        };
        this.saveProgress(progress);
        return progress.settings;
    }
}

// Create a global instance
const storageManager = new StorageManager(); 