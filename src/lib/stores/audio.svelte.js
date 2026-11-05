import { get } from 'svelte/store';
import { is_music_on } from '$lib/stores/settings';

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

  async play() {
    if (!this.audio) return;
    if(!get(is_music_on)) return;

    const currentPath = window.location.pathname;
    if (currentPath !== '/game/play' && currentPath !== '/game/answer' && currentPath !== '/game/end') {
      this.pause();
      return;
    }

    try {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        this.isPlaying = true;
      }
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

}

export const backgroundMusic = new AudioManager();