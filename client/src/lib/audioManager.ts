class AudioManager {
  private static instance: AudioManager;
  private audioElement: HTMLAudioElement | null = null;
  private isInitialized = false;

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async initializeAudio(src: string): Promise<void> {
    if (this.isInitialized) return;

    this.audioElement = new Audio(src);
    this.audioElement.loop = true;
    this.audioElement.volume = 0.02;
    this.audioElement.preload = 'auto';
    this.isInitialized = true;
  }

  async play(): Promise<boolean> {
    if (!this.audioElement) return false;
    
    try {
      await this.audioElement.play();
      return true;
    } catch (error) {
      console.log('Audio play failed:', error);
      return false;
    }
  }

  stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement.volume = 0;
      this.audioElement.muted = true;
      this.audioElement.src = '';
      this.audioElement.remove();
      this.audioElement = null;
    }
    this.isInitialized = false;
  }

  isPlaying(): boolean {
    return this.audioElement ? !this.audioElement.paused : false;
  }

  onPlay(callback: () => void): void {
    if (this.audioElement) {
      this.audioElement.addEventListener('play', callback);
    }
  }

  onPause(callback: () => void): void {
    if (this.audioElement) {
      this.audioElement.addEventListener('pause', callback);
    }
  }
}

export default AudioManager;