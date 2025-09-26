# Exercise Game

A web-based exercise game that uses MediaPipe for pose detection to track and score various exercises.

## Features

- 5 different exercise levels (Squat, Push-up, Plank, Jumping Jack, Lunges)
- Real-time pose detection and feedback
- Progress tracking and level unlocking system
- Score and XP system
- Theme customization (Light/Dark mode)
- Audio settings

## Prerequisites

- Modern web browser with camera access
- Internet connection (for loading MediaPipe and other CDN resources)
## Getting Started

1. Clone the repository
2. Open `index.html` in a web browser
3. Allow camera access when prompted
4. Start with Level 1 and progress through the exercises

## Game Structure

- **Level 1**: Jumping Jack Pro
  - Jumping jacks with form detection
  - 30 repetitions target
  - 90 seconds time limit

- **Level 2**: Squat Master
  - Basic squats with form detection
  - 10 repetitions target
  - 60 seconds time limit

- **Level 3**: Lunges Expert
  - Alternating lunges with form detection
  - 20 repetitions target
  - 120 seconds time limit

- **Level 4**: Push-up Challenge
  - Push-ups with form detection
  - 15 repetitions target
  - 90 seconds time limit

## Project Structure

```
/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Styles and themes
├── js/
│   ├── app.js         # Main application initialization
│   ├── config.js      # Game configuration and settings
│   ├── storage.js     # Progress and settings storage
│   ├── pose-detection.js  # MediaPipe pose detection
│   ├── game-logic.js  # Game mechanics and scoring
│   └── ui-manager.js  # UI and view management
└── assets/
    └── animations/    # Exercise reference GIFs
```

## How to Play

1. Start from the main menu
2. Select "Choose Level"
3. Begin with Level 1 (other levels are locked initially)
4. Read the instructions and click "Start Level"
5. Follow the reference animation and maintain proper form
6. Complete the required repetitions within the time limit
7. Achieve the minimum score to unlock the next level

## Settings

- Theme: Switch between light and dark modes
- Background Music: Toggle on/off
- Sound Effects: Toggle on/off
- Volume: Adjust audio volume

## Progress Saving

The game automatically saves your progress, including:
- Unlocked levels
- Best scores for each level
- Settings preferences

## Browser Support

- Chrome (recommended)
- Firefox
- Edge
- Safari

## Dokumentasi Terpadu (Bahasa Indonesia)

Dokumentasi ini menggabungkan seluruh petunjuk dari beberapa file README terpisah menjadi satu file utama. Bagian-bagian berikut merangkum Intro, Audio (termasuk perbaikan kontinuitas), Responsivitas, Struktur Proyek, Cara Bermain, serta Troubleshooting singkat.

### 1) Ringkasan Game
- Game workout berbasis web dengan pelacakan pose menggunakan MediaPipe untuk menilai gerakan.
- Sistem level, skor, dan XP dengan penyimpanan progres otomatis (localStorage).
- Mode tema terang/gelap dan pengaturan audio.

### 2) Urutan Level dan Kesulitan (Progressi terbaru)
- Level 1: Jumping Jack — pemanasan dan koordinasi, target repetisi mudah, waktu singkat.
- Level 2: Squat — fokus pada bentuk tubuh bawah (paha dan pinggul).
- Level 3: Lunges — keseimbangan dan kekuatan unilateral, analisis kedua kaki.
- Level 4: Push-up — kekuatan tubuh atas dan inti.
- Level 5: Plank — isometrik inti, menantang untuk ditahan.

Catatan: Parameter durasi, target repetisi, skor minimal, dan XP telah disesuaikan agar progresi terasa seimbang dari mudah ke sulit.

### 3) Halaman Intro
- Menampilkan judul “Game Gerakan Dasar Workout” dengan efek glow dan animasi intro.
- Media intro: `assets/animations/intro.gif` atau `intro.mp4` (opsional, ditambahkan manual).
- Transisi halus (fade/slide/scale) dan “klik di mana saja” untuk masuk ke menu utama.
- Responsif pada desktop, tablet, dan mobile.

### 4) Cara Bermain
1. Buka aplikasi dan klik layar intro untuk masuk ke menu utama.
2. Pilih “Choose Level” dan mulai dari Level 1 (level lain terkunci sampai terbuka).
3. Baca instruksi dan klik “Start Level”.
4. Ikuti animasi referensi dan pertahankan bentuk gerakan yang benar.
5. Capai target repetisi/durasi dalam batas waktu dan raih skor minimal untuk membuka level berikutnya.

Tips teknis deteksi pose: jaga tubuh penuh terlihat kamera, pencahayaan cukup, dan kontras pakaian terhadap latar belakang.

### 5) Sistem Audio
- Background Music: `Backsound.mp3` (menu) dan `Level.mp3` (saat bermain), keduannya loop sesuai konteks.
- Sound Effects: `Klik.mp3`, `Notif.mp3`, `Berhasil.mp3`, `Gagal.mp3`.
- Pengaturan di Settings: on/off BGM, on/off SFX, dan slider volume (0.0–1.0). Perubahan tersimpan dan berlaku real-time.
- Optimalisasi: auto-pause saat tab tidak aktif, kontrol volume real-time, manajemen memori, dan error handling.

Peningkatan terbaru (kontinuitas musik):
- Backsound berlanjut mulus antar halaman menu (tidak restart) dan hanya berhenti saat masuk level.
- Musik level berhenti saat level selesai atau saat kembali. Backsound tidak otomatis mulai sampai benar-benar kembali ke halaman pemilihan level.
- Volume diterapkan konsisten untuk musik menu dan level.

File terkait: `js/audio-manager.js`, `js/ui-manager.js`, `js/game-logic.js`, dan `index.html`.

### 6) Responsivitas (Mobile & Desktop)
- CSS: `css/styles.css` dan `css/responsive.css` dengan breakpoint untuk desktop, tablet, dan mobile (termasuk small/extra small).
- JS: `js/responsive-handler.js` untuk optimasi sentuh, perubahan orientasi, dan pengelolaan viewport.
- Layout game menyesuaikan: side-by-side di desktop, vertikal di mobile; rasio kamera adaptif.
- Touch-friendly: target minimal 44px, cegah double-tap zoom dan pull-to-refresh di mobile.
- Dukungan DPI tinggi dan aksesibilitas dasar (kontras, preferensi reduced motion).

### 7) Struktur Proyek (Ringkas)
```
game/
├── index.html
├── css/
│   ├── styles.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── config.js
│   ├── storage.js
│   ├── pose-detection.js
│   ├── game-logic.js
│   ├── ui-manager.js
│   └── responsive-handler.js
└── assets/
    ├── animations/
    └── Sound/
```

### 8) Prasyarat & Dukungan Browser
- Browser modern dengan akses kamera, koneksi internet untuk memuat MediaPipe/CDN.
- Rekomendasi: Chrome. Dukungan juga untuk Firefox, Edge, dan Safari.

### 9) Troubleshooting Singkat
- Audio tidak berfungsi: pastikan file ada, cek console, pastikan Web Audio API didukung, cek Settings.
- Mobile: beberapa browser butuh interaksi pengguna sebelum audio berjalan; pastikan perangkat tidak dalam mode senyap.
- Responsivitas: verifikasi meta viewport dan breakpoint;uji perubahan orientasi.

### 10) Catatan Tambahan
- Deteksi pose ditingkatkan dengan threshold kepercayaan landmark, smoothing riwayat pose, dan delay perubahan state untuk stabilitas.
- Algoritma squat dan lunges dioptimalkan untuk sudut kamera samping dengan pengukuran sudut sendi yang lebih akurat.