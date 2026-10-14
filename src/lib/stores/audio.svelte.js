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
  }

  toggle() {
    if (!this.audio) return;
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play();
      this.isPlaying = true;
    }
  }
}

export const backgroundMusic = new AudioManager();