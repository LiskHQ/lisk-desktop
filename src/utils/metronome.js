// import { ipcMain as ipc, BrowserWindow } from 'electron';
import { SYNC_ACTIVE_INTERVAL, SYNC_INACTIVE_INTERVAL } from '../constants/api';
import env from '../constants/env';

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
   * @param {Date} lastBeat
   * @param {Date} now
   * @param {Number} factor
   * @memberOf Metronome
   * @private
   */
  static _dispatch(lastBeat, now, factor) {
    const ev = new Event('beat', {
      factor,
      lastBeat,
      now,
    });
    document.dispatchEvent(ev);
  }

   /**
    * We're calling this in framerate.
    * calls broadcast method every SYNC_(IN)ACTIVE_INTERVAL and
    * sends a numeric factor for ease of use as multiples of updateInterval.
    *
    * @memberOf Metronome
    * @private
    */
  _step() {
    const now = new Date();
    if (now - this.lastBeat >= this.interval) {
      Metronome._dispatch(this.lastBeat, now, this.factor);
      this.lastBeat = now;
      this.factor += this.factor < 9 ? 1 : -9;
    }
    if (this.running) {
      window.requestAnimationFrame(this._step.bind(this));
    }
  }

  /**
   * Changes the duration of intervals when sending application
   * to tray or activating it again.
   *
   * @memberOf Metronome
   * @private
   */
  _initIntervalToggler() {
    const { ipc } = window;
    ipc.on('blur', () => this.interval = SYNC_INACTIVE_INTERVAL);
    ipc.on('focus', () => this.interval = SYNC_ACTIVE_INTERVAL);
  }

  /**
   * Terminates the intervals
   *
   * @memberOf Metronome
   */
  terminate() {
    this.running = false;
  }

  /**
   * Starts the first frame by calling requestAnimationFrame.
   *
   * @memberOf Metronome
   */
  init() {
    if (!this.running) {
      window.requestAnimationFrame(this._step.bind(this));
    }
    if (env.production) {
      this._initIntervalToggler();
    }
    this.running = true;
  }
}

export default Metronome;
