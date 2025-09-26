class AudioManager {
    constructor() {
        this.audioContext = null;
        this.currentBacksound = null;
        this.currentLevelMusic = null;
        this.sounds = {};
        this.isInitialized = false;
        this.settings = {
            bgMusic: true,
            sfx: true,
            volume: 1.0
        };
        
        this.init();
    }

    async init() {
        try {
            // Buat audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Muat semua file audio
            await this.loadSounds();
            
            this.isInitialized = true;
            console.log('Audio Manager berhasil diinisialisasi');
        } catch (error) {
            console.error('Gagal menginisialisasi Audio Manager:', error);
        }
    }

    async loadSounds() {
        const soundFiles = {
            backsound: 'assets/Sound/Backsound.mp3',
            level: 'assets/Sound/Level.mp3',
            klik: 'assets/Sound/Klik.mp3',
            notif: 'assets/Sound/Notif.mp3',
            gagal: 'assets/Sound/Gagal.mp3',
            berhasil: 'assets/Sound/Berhasil.mp3'
        };

        for (const [name, path] of Object.entries(soundFiles)) {
            try {
                const response = await fetch(path);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.sounds[name] = audioBuffer;
            } catch (error) {
                console.warn(`Gagal memuat suara: ${name}`, error);
            }
        }
    }

    playSound(soundName, options = {}) {
        if (!this.isInitialized || !this.sounds[soundName]) {
            console.warn(`Suara ${soundName} tidak tersedia`);
            return null;
        }

        if (!this.settings.sfx) return null;

        try {
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = this.sounds[soundName];
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Atur volume
            const volume = options.volume || this.settings.volume;
            gainNode.gain.value = volume;
            
            // Atur loop jika ditentukan
            if (options.loop) {
                source.loop = true;
            }
            
            source.start(0);
            
            return { source, gainNode };
        } catch (error) {
            console.error(`Error memutar suara ${soundName}:`, error);
            return null;
        }
    }

    playBacksound(type) {
        // Jika beralih ke level, hentikan backsound saat ini dan mulai musik level
        if (type === 'level') {
            this.stopBacksound();
            this.playLevelMusic();
            return;
        }

        // Jika beralih ke menu dan tidak ada backsound yang diputar, mulai
        if (type === 'menu' && !this.currentBacksound) {
            this.playMenuBacksound();
            return;
        }

        // Jika beralih ke menu dan musik level sedang diputar, hentikan dan mulai backsound
        if (type === 'menu' && this.currentLevelMusic) {
            this.stopLevelMusic();
            this.playMenuBacksound();
            return;
        }
    }

    playMenuBacksound() {
        // Hanya mulai backsound jika belum diputar
        if (!this.currentBacksound && this.settings.bgMusic) {
            this.currentBacksound = this.playSound('backsound', { 
                loop: true, 
                volume: this.settings.volume * 0.7 // Musik latar sedikit lebih pelan
            });
        }
    }

    playLevelMusic() {
        // Stop any existing level music
        this.stopLevelMusic();
        
        // Start level music if background music is enabled
        if (this.settings.bgMusic) {
            this.currentLevelMusic = this.playSound('level', { 
                loop: true, 
                volume: this.settings.volume * 0.7
            });
        }
    }

    stopLevelMusic() {
        if (this.currentLevelMusic) {
            this.currentLevelMusic.source.stop();
            this.currentLevelMusic = null;
        }
    }

    // Method to stop level music when level results popup appears
    onLevelComplete() {
        this.stopLevelMusic();
        // Don't automatically resume backsound - it will be started when returning to level selection
    }

    // Method to restart level music when retrying level
    onLevelRetry() {
        this.playLevelMusic();
    }

    playKlik() {
        this.playSound('klik', { volume: this.settings.volume * 0.8 });
    }

    playNotif() {
        this.playSound('notif', { volume: this.settings.volume });
    }

    playGagal() {
        this.playSound('gagal', { volume: this.settings.volume });
    }

    playBerhasil() {
        this.playSound('berhasil', { volume: this.settings.volume });
    }

    stopBacksound() {
        if (this.currentBacksound) {
            this.currentBacksound.source.stop();
            this.currentBacksound = null;
        }
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        
        // Update current backsound volume if playing
        if (this.currentBacksound && this.currentBacksound.gainNode) {
            this.currentBacksound.gainNode.gain.value = this.settings.volume * 0.7;
        }
        
        // Update current level music volume if playing
        if (this.currentLevelMusic && this.currentLevelMusic.gainNode) {
            this.currentLevelMusic.gainNode.gain.value = this.settings.volume * 0.7;
        }
        
        // Stop all music if disabled
        if (!this.settings.bgMusic) {
            this.stopBacksound();
            this.stopLevelMusic();
        }
    }

    pauseAll() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
    }

    resumeAll() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Method to handle page visibility changes
    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseAll();
        } else {
            this.resumeAll();
        }
    }
}

// Create global instance
const audioManager = new AudioManager();

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    audioManager.handleVisibilityChange();
});

// Handle user interaction to start audio context
document.addEventListener('click', () => {
    if (audioManager.audioContext && audioManager.audioContext.state === 'suspended') {
        audioManager.audioContext.resume();
    }
}, { once: true });

