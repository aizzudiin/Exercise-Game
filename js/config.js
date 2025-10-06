const CONFIG = {
    // Game settings
    COUNTDOWN_DURATION: 10, // seconds
    STORAGE_KEY: 'exercise_game_progress',
    
    // Audio settings
    AUDIO: {
        bgMusic: true,
        sfx: true,
        volume: 0.5
    },

    // Theme settings
    THEME: {
        current: 'light',
        available: ['light', 'dark']
    },

    // Level configurations
    LEVELS: [
        {
            id: 1,
            name: 'Jumping-Jack',
            exercise: 'jumpingjack',
            duration: 60,
            targetReps: 15,
            xpReward: 100,
            requiredScore: 70,
            instruction: '1. Posisikan kamera di depan tubuh setinggi pinggang, jarak 2-3 meter.\n2. Pastikan seluruh tubuh terlihat dari kepala hingga kaki.\n3. Mulai dengan posisi berdiri tegak, kaki rapat, dan tangan di sisi tubuh.\n4. Lompat sambil membuka kaki lebih lebar dari bahu dan angkat kedua tangan lurus ke atas.\n5. Pastikan tangan berada di atas kepala dan kaki terbuka lebar saat melompat.\n6. Kembali ke posisi awal dengan kaki rapat dan tangan di sisi tubuh.\n7. Ulangi gerakan dengan ritme yang stabil.\n8. Timer permainan akan dimulai setelah countdown selesai.',
            gifUrl: 'assets/animations/Jumping_Jack.gif'
        },
        {
            id: 2,
            name: 'Squat',
            exercise: 'squat',
            duration: 75,
            targetReps: 12,
            xpReward: 150,
            requiredScore: 75,
            instruction: '1. Posisikan kamera dari samping tubuh setinggi pinggang, jarak 2-3 meter.\n2. Pastikan seluruh tubuh terlihat dari bahu hingga kaki.\n3. Berdiri dengan kaki selebar bahu, jari kaki mengarah ke depan.\n4. Turunkan badan dengan menekuk lutut hingga membentuk sudut 90° (paha sejajar lantai).\n5. Pastikan lutut tidak melebihi jari kaki dan punggung tetap lurus.\n6. Dorong tubuh kembali ke posisi berdiri dengan tumit.\n7. Ulangi gerakan dengan ritme yang stabil.\n8. Timer permainan akan dimulai setelah countdown selesai.',
            gifUrl: 'assets/animations/Squat.gif'
        },
        {
            id: 3,
            name: 'Lunges',
            exercise: 'lunge',
            duration: 90,
            targetReps: 16,
            xpReward: 200,
            requiredScore: 80,
            instruction: '1. Posisikan kamera dari samping tubuh setinggi pinggang, jarak 2-3 meter.\n2. Pastikan seluruh tubuh terlihat dari kepala hingga kaki.\n3. Berdiri tegak dengan kaki sejajar pinggul.\n4. Langkahkan satu kaki ke depan, jaga jarak antar kaki selebar pinggul.\n5. Turunkan tubuh hingga lutut depan membentuk sudut 90° dan lutut belakang hampir menyentuh lantai.\n6. Pastikan lutut depan tidak melebihi jari kaki dan tubuh tetap tegak.\n7. Dorong tubuh kembali ke posisi awal menggunakan tumit kaki depan.\n8. Ganti kaki dan ulangi semua gerakan.\n9. Timer permainan akan dimulai setelah countdown selesai.',
            gifUrl: 'assets/animations/Lunges.gif'
        },
        {
            id: 4,
            name: 'Push-up',
            exercise: 'pushup',
            duration: 105,
            targetReps: 12,
            xpReward: 250,
            requiredScore: 80,
            instruction: '1. Posisikan kamera dari samping tubuh setinggi betis kaki, jarak kira-kira 2 meter.\n2. Pastikan seluruh tubuh terlihat lurus dari kepala hingga kaki.\n3. Mulai dari posisi plank dengan tangan lurus di bawah bahu.\n4. Jaga tubuh membentuk garis lurus dari kepala hingga tumit.\n5. Turunkan badan dengan menekuk siku hingga membentuk sudut 90°, dekatkan dada ke lantai.\n6. Pastikan siku dekat dengan tubuh, tidak melebar ke samping.\n7. Dorong tubuh kembali ke posisi awal dengan lengan lurus.\n8. Ulangi gerakan dengan ritme yang stabil.\n9. Timer permainan akan dimulai setelah countdown selesai.',
            gifUrl: 'assets/animations/Push_Up.gif'
        },
        {
            id: 5,
            name: 'Plank',
            exercise: 'plank',
            duration: 90,
            targetDuration: 30,
            xpReward: 300,
            requiredScore: 70,
            instruction: '1. Posisikan kamera dari samping tubuh setinggi betis kaki, jarak kira-kira 2 meter.\n2. Pastikan seluruh tubuh terlihat lurus dari kepala hingga tumit.\n3. Mulai dari posisi plank dengan lengan bawah menempel lantai.\n4. Letakkan siku tepat di bawah bahu, lengan sejajar bahu.\n5. Kencangkan otot perut dan bokong, jaga tubuh tetap lurus.\n6. Tahan posisi, jangan biarkan pinggul turun atau naik.\n7. Pertahankan posisi selama 30 detik dengan formasi yang benar.\n8. Timer permainan akan dimulai setelah countdown selesai.',
            gifUrl: 'assets/animations/Plank.gif'
        }
    ],

    // Pose detection settings
    POSE_DETECTION: {
        minConfidence: 0.6,
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.5
    }
}; 