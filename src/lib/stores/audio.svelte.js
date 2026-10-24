import { SvelteSet } from 'svelte/reactivity';

// Using a simple reactive state or class for global control
class AudioManager {
  audio = null;
  isPlaying = $state(true);

  init(src) {
    if (typeof window === 'undefined') return;
    if (!this.audio) {
      this.audio = new Audio(src);
      this.audio.loop = true;
      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
      });
    }

    this.toggle();
  }

  async play() {
    if (!this.audio) return;
    try {
      await this.audio.play();
      this.isPlaying = true;
    } catch (err) {
      // Browser blocked autoplay due to lack of user interaction
      console.warn("Autoplay prevented:", err);
      this.isPlaying = false;
    }
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}

export const backgroundMusic = new AudioManager();