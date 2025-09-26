// pose-detection.js

class PoseDetector {
    constructor() {
        this.pose = null;
        this.camera = null;
        this.poseResults = null;
        this.isRunning = false;
        this.videoElement = null;
        this.canvasElement = null;
        this.canvasCtx = null;
        this.exerciseCounter = 0;
        this.lastPoseState = null;
        this.holdStartTime = null;
        this.poseHistory = [];
        this.confidenceThreshold = 0.6;
        this.stateChangeDelay = 150; // ms to prevent rapid state changes
        this.lastStateChange = 0;
        this.frameSkipCounter = 0;
        this.processEveryNthFrame = 2; // Process every 2nd frame for better performance
        
        // Add event listeners to ensure camera is stopped when page is unloaded
        window.addEventListener('beforeunload', () => {
            this.stopCamera();
        });
        
        window.addEventListener('pagehide', () => {
            this.stopCamera();
        });
    }

    async initialize(videoElement, canvasElement) {
        // Stop any existing camera stream first
        this.stopCamera();
        
        this.videoElement = videoElement;
        this.canvasElement = canvasElement;
        this.canvasCtx = canvasElement.getContext('2d');

        // Set video to use contain instead of cover to avoid cropping
        this.videoElement.style.objectFit = 'contain';
        
        this.pose = new Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        this.pose.setOptions(CONFIG.POSE_DETECTION);

        this.pose.onResults((results) => {
            this.poseResults = results;
            this.drawResults();
        });

        // Get user media with preferred resolution but allow browser to choose best fit
        const constraints = {
            video: {
                facingMode: 'user',
                width: { ideal: 1280, min: 640 },
                height: { ideal: 720, min: 480 }
            }
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoElement.srcObject = stream;
            
            // Wait for video metadata to load to get actual dimensions
            await new Promise((resolve) => {
                this.videoElement.onloadedmetadata = () => {
                    // Set canvas size to match video's actual dimensions
                    this.canvasElement.width = this.videoElement.videoWidth;
                    this.canvasElement.height = this.videoElement.videoHeight;
                    resolve();
                };
            });
            
            this.camera = new Camera(this.videoElement, {
                onFrame: async () => {
                    if (this.isRunning) {
                        // Skip frames for better performance
                        this.frameSkipCounter++;
                        if (this.frameSkipCounter >= this.processEveryNthFrame) {
                            this.frameSkipCounter = 0;
                            await this.pose.send({ image: this.videoElement });
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error accessing camera:', error);
            throw error;
        }
    }

    async startCamera() {
        await this.camera.start();
    }

    stopCamera() {
        // Stop detection first
        this.isRunning = false;
        
        // Stop MediaPipe camera
        if (this.camera) {
            this.camera.stop();
            this.camera = null;
        }
        
        // Stop MediaPipe pose processing
        if (this.pose) {
            this.pose.close();
            this.pose = null;
        }
        
        // Stop all video tracks to turn off camera indicator
        if (this.videoElement && this.videoElement.srcObject) {
            const stream = this.videoElement.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => {
                track.stop();
            });
            this.videoElement.srcObject = null;
            
            // Pause and reset video element
            this.videoElement.pause();
            this.videoElement.currentTime = 0;
        }
        
        // Clear canvas
        if (this.canvasCtx && this.canvasElement) {
            this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        }
        
        // Reset pose results
        this.poseResults = null;
    }

    startDetection() {
        this.isRunning = true;
        this.exerciseCounter = 0;
        this.lastPoseState = null;
        this.holdStartTime = null;
        this.poseHistory = [];
        this.lastStateChange = 0;
        this.frameSkipCounter = 0;
    }

    stopDetection() {
        this.isRunning = false;
    }

    drawResults() {
        if (!this.poseResults?.poseLandmarks) return;

        // Use requestAnimationFrame for smoother rendering
        requestAnimationFrame(() => {
            this.canvasCtx.save();
            this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
            
            // Lighter background for better performance
            this.canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.canvasCtx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);

            // Draw with optimized settings
            drawConnectors(this.canvasCtx, this.poseResults.poseLandmarks, POSE_CONNECTIONS,
                { color: '#00FF00', lineWidth: 1.5 });
            drawLandmarks(this.canvasCtx, this.poseResults.poseLandmarks,
                { color: '#FF0000', lineWidth: 0.8, radius: 3 });

            this.canvasCtx.restore();
        });
    }

    calculateAngle(p1, p2, p3) {
        const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) -
                        Math.atan2(p1.y - p2.y, p1.x - p2.x);
        let angle = Math.abs(radians * 180.0 / Math.PI);
        if (angle > 180.0) angle = 360 - angle;
        return angle;
    }

    // Check if landmarks have sufficient confidence (optimized)
    hasGoodConfidence(landmarks) {
        if (!landmarks) return false;
        // Check only essential landmarks for performance
        const essentialLandmarks = [11, 12, 23, 24, 25, 26];
        return essentialLandmarks.every(idx => 
            landmarks[idx] && landmarks[idx].visibility > this.confidenceThreshold
        );
    }

    // Smooth pose detection with history (optimized)
    addToHistory(isCorrectPose, maxHistory = 3) {
        this.poseHistory.push(isCorrectPose);
        if (this.poseHistory.length > maxHistory) {
            this.poseHistory.shift();
        }
        // Return true if majority of recent poses are correct
        const correctCount = this.poseHistory.filter(p => p).length;
        return correctCount >= Math.ceil(maxHistory / 2);
    }

    // Prevent rapid state changes
    canChangeState() {
        const now = Date.now();
        if (now - this.lastStateChange > this.stateChangeDelay) {
            this.lastStateChange = now;
            return true;
        }
        return false;
    }

    detectSquat() {
        if (!this.poseResults?.poseLandmarks) return false;
        const lms = this.poseResults.poseLandmarks;
        
        // Coba deteksi dari sisi kanan terlebih dahulu
        let shoulder, hip, knee, ankle;
        let side = 'right';
        
        // Periksa visibilitas landmark sisi kanan
        const rightLandmarks = [12, 24, 26, 28]; // bahu, pinggul, lutut, pergelangan kaki kanan
        const leftLandmarks = [11, 23, 25, 27];  // bahu, pinggul, lutut, pergelangan kaki kiri
        
        const rightSideVisible = rightLandmarks.every(i => lms[i]?.visibility > this.confidenceThreshold);
        const leftSideVisible = leftLandmarks.every(i => lms[i]?.visibility > this.confidenceThreshold);
        
        if (rightSideVisible) {
            // Gunakan landmark sisi kanan
            shoulder = lms[12];
            hip = lms[24];
            knee = lms[26];
            ankle = lms[28];
        } else if (leftSideVisible) {
            // Gunakan landmark sisi kiri
            shoulder = lms[11];
            hip = lms[23];
            knee = lms[25];
            ankle = lms[27];
            side = 'left';
        } else {
            return false; // Tidak ada sisi yang terdeteksi dengan baik
        }

        // 1. Lutut sejajar horizontal dengan pinggul
        const kneeHipHorizontalAlign = Math.abs(knee.y - hip.y) < 0.15 * Math.abs(shoulder.y - ankle.y);
        
        // 2. Bahu sejajar vertikal dengan kaki
        const shoulderAnkleVerticalAlign = Math.abs(shoulder.x - ankle.x) < 0.15 * Math.abs(shoulder.y - ankle.y);
        
        // 3. Kaki terlihat minimal (pergelangan kaki di bawah lutut)
        const footVisible = ankle.y > knee.y;
        
        // 4. Hitung sudut lutut untuk memastikan squat cukup dalam
        const kneeAngle = this.calculateAngle(hip, knee, ankle);
        
        // 5. Hitung sudut pinggul untuk memastikan pinggul turun
        const hipAngle = this.calculateAngle(
            {x: shoulder.x, y: hip.y}, // horizontal
            hip,
            knee
        );
        
        // Kriteria utama (harus terpenuhi)
        const mainCriteria = kneeHipHorizontalAlign && 
                           shoulderAnkleVerticalAlign && 
                           footVisible;
                           
        // Kriteria tambahan (opsional, untuk referensi)
        const additionalCriteria = {
            goodKneeAngle: kneeAngle > 80 && kneeAngle < 130,
            goodHipAngle: hipAngle > 40 && hipAngle < 100
        };
        
        // Gunakan hanya kriteria utama untuk penilaian
        const isGoodSquat = mainCriteria;
        
        // Gunakan smoothing untuk menghindari false positive
        const smoothedSquat = this.addToHistory(isGoodSquat, 4);
        
        // Update state dan counter
        if (smoothedSquat && this.lastPoseState !== 'squat' && this.canChangeState()) {
            this.exerciseCounter++;
            this.lastPoseState = 'squat';
            console.log('Squat terdeteksi!', { 
                side,
                kneeHipHorizontalAlign,
                shoulderAnkleVerticalAlign,
                footVisible,
                additionalCriteria,
                kneeAngle,
                hipAngle
            });
        } else if (!smoothedSquat && this.lastPoseState !== 'standing' && this.canChangeState()) {
            this.lastPoseState = 'standing';
        } else if (this.lastPoseState === null) {
            this.lastPoseState = smoothedSquat ? 'squat' : 'standing';
        }

        return smoothedSquat;
    }

    detectPushup() {
        if (!this.poseResults?.poseLandmarks) return false;
        const lms = this.poseResults.poseLandmarks;

        // Cek visibilitas dan posisi samping (kiri atau kanan)
        const leftSideVisible = this.checkSideVisibility(lms, 'left');
        const rightSideVisible = this.checkSideVisibility(lms, 'right');
        
        if (!leftSideVisible.visible && !rightSideVisible.visible) return false;

        // Gunakan sisi yang terlihat (prioritaskan kiri jika keduanya terlihat)
        const side = leftSideVisible.visible ? 'left' : 'right';
        const sideData = side === 'left' ? leftSideVisible : rightSideVisible;

        // Cek apakah posisi tubuh sejajar (dari samping)
        const isAligned = this.checkBodyAlignment(sideData.shoulder, sideData.hip, 
                                                sideData.knee, sideData.ankle);
        if (!isAligned) return false;

        // Hitung sudut siku
        const leftElbow = this.calculateAngle(lms[11], lms[13], lms[15]);
        const rightElbow = this.calculateAngle(lms[12], lms[14], lms[16]);

        // Deteksi push-up ketika kedua siku menekuk di bawah 90 derajat
        const isPush = leftElbow < 90 && rightElbow < 90;

        // Update state dan counter
        if (isPush && this.lastPoseState === 'up') {
            this.exerciseCounter++;
            this.lastPoseState = 'down';
        } else if (!isPush && this.lastPoseState === 'down') {
            this.lastPoseState = 'up';
        } else if (this.lastPoseState === null) {
            this.lastPoseState = isPush ? 'down' : 'up';
        }

        return isPush;
    }

    // Cek visibilitas sisi tubuh (kiri/kanan)
    checkSideVisibility(lms, side) {
        const isLeft = side === 'left';
        const shoulder = isLeft ? 11 : 12;
        const hip = isLeft ? 23 : 24;
        const knee = isLeft ? 25 : 26;
        const ankle = isLeft ? 27 : 28;

        const visibility = {
            shoulder: lms[shoulder].visibility > 0.7,
            hip: lms[hip].visibility > 0.7,
            knee: lms[knee].visibility > 0.7,
            ankle: lms[ankle].visibility > 0.7,
            visible: false
        };

        visibility.visible = visibility.shoulder && visibility.hip && 
                           visibility.knee && visibility.ankle;
        
        // Tambahkan landmark points untuk perhitungan alignment
        if (visibility.visible) {
            visibility.shoulder = lms[shoulder];
            visibility.hip = lms[hip];
            visibility.knee = lms[knee];
            visibility.ankle = lms[ankle];
        }

        return visibility;
    }

    // Cek keselarasan tubuh dari samping (untuk posisi push-up)
    checkBodyAlignment(shoulder, hip, knee, ankle) {
        // Hitung sudut antara bahu, pinggul, dan lutut
        const hipAngle = this.calculateAngle(shoulder, hip, knee);
        
        // Hitung sudut antara pinggul, lutut, dan pergelangan kaki
        const kneeAngle = this.calculateAngle(hip, knee, ankle);
        
        // Posisi push-up yang baik memiliki:
        // - Sudut pinggul mendekati 180 derajat (tubuh lurus)
        // - Sudut lutut mendekati 180 derajat (kaki lurus)
        const isBodyStraight = Math.abs(hipAngle - 180) < 30;  // Menerima deviasi 30 derajat
        const isLegStraight = Math.abs(kneeAngle - 180) < 30;  // Menerima deviasi 30 derajat
        
        return isBodyStraight && isLegStraight;
    }

    detectPlank() {
        if (!this.poseResults?.poseLandmarks) return false;
        const lms = this.poseResults.poseLandmarks;
        
        // Check visibility of required landmarks on both sides
        const leftSideVisible = [15, 13, 11, 23, 25, 27].every(i => lms[i]?.visibility > this.confidenceThreshold);
        const rightSideVisible = [16, 14, 12, 24, 26, 28].every(i => lms[i]?.visibility > this.confidenceThreshold);
        
        if (!leftSideVisible && !rightSideVisible) return false;
        
        // Use the side with better visibility
        const useRightSide = rightSideVisible || !leftSideVisible;
        const [wrist, elbow, shoulder, hip, knee, ankle] = useRightSide ? 
            [16, 14, 12, 24, 26, 28] : [15, 13, 11, 23, 25, 27];
        
        // Landmark references are used directly in angle calculations
        
        // 1. Check if body is roughly horizontal (shoulder to hip to knee)
        const shoulderHipAngle = this.calculateAngle(
            lms[shoulder],
            lms[hip],
            lms[knee]
        );
        
        // 2. Check if arms are vertical (wrist, elbow, shoulder alignment)
        const armAngle = this.calculateAngle(
            lms[wrist],
            lms[elbow],
            lms[shoulder]
        );
        
        // 3. Check if legs are straight (hip to knee to ankle)
        const legAngle = this.calculateAngle(
            lms[hip],
            lms[knee],
            lms[ankle]
        );
        
        // Additional checks for proper plank form
        const shoulderY = lms[shoulder].y;
        const hipY = lms[hip].y;
        const kneeY = lms[knee].y;
        const ankleY = lms[ankle].y;
        
        // Check if hips are elevated (more flexible check)
        // Allow some flexibility - hips can be slightly lower than shoulders
        const hipsElevated = (hipY < shoulderY + 0.1) && (hipY < kneeY + 0.1);
        
        // Check if knees are elevated (more flexible check)
        // Allow some flexibility - knees can be slightly lower than ankles
        const kneesElevated = kneeY < ankleY + 0.05;

        // Accept if:
        // - Shoulder-hip-knee angle is roughly 180° (straight line)
        // - Arm angle is roughly 90° (elbow bent) or 180° (straight arm plank)
        // - Leg angle is roughly 180° (straight legs)
        // - Hips and knees are properly elevated
        const isPlank = 
            Math.abs(shoulderHipAngle - 180) < 30 &&
            (Math.abs(armAngle - 90) < 30 || Math.abs(armAngle - 180) < 30) &&
            Math.abs(legAngle - 180) < 30 &&
            hipsElevated && 
            kneesElevated;
        
        // Smooth the detection
        const smoothedPlank = this.addToHistory(isPlank, 3);
        
        // Update hold time for scoring
        if (smoothedPlank) {
            if (!this.holdStartTime) {
                this.holdStartTime = Date.now();
            }
        } else {
            this.holdStartTime = null;
        }
        
        return smoothedPlank;
    }

    detectJumpingJack() {
        if (!this.poseResults?.poseLandmarks) return false;
        const lms = this.poseResults.poseLandmarks;
        
        if (!this.hasGoodConfidence(lms)) return false;

        // Get head and hand positions (using nose and wrists)
        const headY = lms[0].y; // nose
        const leftWristY = lms[15].y;
        const rightWristY = lms[16].y;
        
        // Check if hands are above head level (key condition for jumping jack)
        const handsAboveHead = (leftWristY < headY) && (rightWristY < headY);
        
        // Check if person is standing upright (shoulder-ankle should be ~90° from horizontal)
        const leftShoulderAnkle = this.calculateAngle(
            {x: 1, y: lms[11].y}, // horizontal reference
            lms[11], // left shoulder
            lms[27]  // left ankle
        );
        const rightShoulderAnkle = this.calculateAngle(
            {x: 1, y: lms[12].y}, // horizontal reference
            lms[12], // right shoulder
            lms[28]  // right ankle
        );
        
        const isStanding = Math.abs(leftShoulderAnkle - 90) < 20 && Math.abs(rightShoulderAnkle - 90) < 20;
        
        // Check leg spread (ankles should be wider apart than shoulders)
        const shoulderWidth = Math.abs(lms[11].x - lms[12].x);
        const ankleWidth = Math.abs(lms[27].x - lms[28].x);
        const legsSpread = ankleWidth > shoulderWidth * 1.3;
        
        const isJackOpen = handsAboveHead && isStanding && legsSpread;
        
        // Use shorter history for more responsive detection
        if (isJackOpen && this.lastPoseState !== 'open' && this.canChangeState()) {
            this.exerciseCounter++;
            this.lastPoseState = 'open';
        } else if (!isJackOpen && this.lastPoseState !== 'closed' && this.canChangeState()) {
            this.lastPoseState = 'closed';
        } else if (this.lastPoseState === null) {
            this.lastPoseState = isJackOpen ? 'open' : 'closed';
        }

        return isJackOpen;
    }

    detectLunge() {
        if (!this.poseResults?.poseLandmarks) return false;
        const lms = this.poseResults.poseLandmarks;
        
        if (!this.hasGoodConfidence(lms)) return false;

        // Side-view lunge detection - analyze both legs for front/back positioning
        const leftShoulder = lms[11];
        const rightShoulder = lms[12];
        const leftHip = lms[23];
        const rightHip = lms[24];
        const leftKnee = lms[25];
        const rightKnee = lms[26];
        const leftAnkle = lms[27];
        const rightAnkle = lms[28];
        
        // Calculate knee angles for both legs
        const leftKneeAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
        const rightKneeAngle = this.calculateAngle(rightHip, rightKnee, rightAnkle);
        
        // Calculate hip angles (shoulder-hip-knee) for both legs
        const leftHipAngle = this.calculateAngle(leftShoulder, leftHip, leftKnee);
        const rightHipAngle = this.calculateAngle(rightShoulder, rightHip, rightKnee);
        
        // Calculate torso angle to ensure upright posture
        const avgShoulder = {x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2};
        const avgHip = {x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2};
        const torsoAngle = this.calculateAngle(
            {x: avgHip.x, y: avgHip.y - 0.1}, // vertical reference
            avgHip,
            avgShoulder
        );
        
        // Detect leg positioning - one leg should be forward (smaller x in side view), one back
        const legSeparation = Math.abs(leftAnkle.x - rightAnkle.x);
        const significantSeparation = legSeparation > 0.15; // legs are separated front/back
        
        // Lunge criteria for side view:
        // 1. One knee should be bent (60-120 degrees), other can be more extended
        // 2. Hip angles should show one leg forward position
        // 3. Body should be lowered (hip lower than shoulder)
        // 4. Torso should remain relatively upright
        const frontKneeBent = (leftKneeAngle >= 60 && leftKneeAngle <= 120) || 
                             (rightKneeAngle >= 60 && rightKneeAngle <= 120);
        
        const properHipPosition = (leftHipAngle >= 45 && leftHipAngle <= 135) || 
                                 (rightHipAngle >= 45 && rightHipAngle <= 135);
        
        const bodyLowered = avgHip.y > avgShoulder.y;
        const uprightTorso = torsoAngle <= 30; // More strict for lunges
        
        const isLunge = frontKneeBent && properHipPosition && bodyLowered && 
                       uprightTorso && significantSeparation;
        const smoothedLunge = this.addToHistory(isLunge);

        if (smoothedLunge && this.lastPoseState !== 'lunge' && this.canChangeState()) {
            this.exerciseCounter++;
            this.lastPoseState = 'lunge';
        } else if (!smoothedLunge && this.lastPoseState !== 'standing' && this.canChangeState()) {
            this.lastPoseState = 'standing';
        } else if (this.lastPoseState === null) {
            this.lastPoseState = smoothedLunge ? 'lunge' : 'standing';
        }

        return smoothedLunge;
    }

    getExerciseCount() {
        return this.exerciseCounter;
    }

    getPlankDuration() {
        return this.holdStartTime ? (Date.now() - this.holdStartTime) / 1000 : 0;
    }
}

const poseDetector = new PoseDetector();
