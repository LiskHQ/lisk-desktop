import { SYNC_ACTIVE_INTERVAL, SYNC_INACTIVE_INTERVAL } from '../constants/api';

class Metronome {
  constructor() {
    this.interval = SYNC_ACTIVE_INTERVAL;
    this.lastBeat = new Date();
    this.factor = 0;
    this.running = false;
  }

  /**
   * Broadcast an event from rootScope downwards
   *
   * @param {Date} timeStamp
   */
  dispatch(timeStamp) {
    const ev = new Event('beat', {
      factor: this.factor,
      lastBeat: this.lastBeat,
      timeStamp,
    });
    document.dispatchEvent(ev);
  }

   /**
    * We're calling this in framerate. call broadcast every config.updateInterval and
    * sends a numeric factor for ease of use as multiples of updateInterval.
    */
  step() {
    const now = new Date();
    if (now - this.lastBeat >= this.interval) {
      this.dispatch(this.lastBeat, now, this.factor);
      this.lastBeat = now;
      this.factor += this.factor < 9 ? 1 : -9;
    }
    window.requestAnimationFrame(this.step.bind(this));
  }

  toggleSyncTimer(isFocused) {
    this.interval = (isFocused) ?
      SYNC_ACTIVE_INTERVAL :
      SYNC_INACTIVE_INTERVAL;
  }

  initIntervalToggler() {
    const { ipc } = window;
    ipc.on('blur', () => this.toggleSyncTimer(false));
    ipc.on('focus', () => this.toggleSyncTimer(true));
  }

  /**
   * Starts the first frame by calling requestAnimationFrame.
   * This will be
   */
  init() {
    if (!this.running) {
      window.requestAnimationFrame(this.step.bind(this));
    }
    if (PRODUCTION) {
      this.initIntervalToggler();
    }
  }
}

export default Metronome;
