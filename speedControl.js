class SpeedControl {
    constructor() {
        this.speeds = [0.5, 1, 2, 3, 5];
        this.currentIndex = 1; // Start at 1x
    }

    cycleSpeed() {
        this.currentIndex = (this.currentIndex + 1) % this.speeds.length;
        return this.speeds[this.currentIndex];
    }

    getCurrentSpeed() {
        return this.speeds[this.currentIndex];
    }

    getSpeedLabel() {
        return this.speeds[this.currentIndex] + 'x';
    }
}
