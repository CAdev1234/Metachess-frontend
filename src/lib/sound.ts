import { isSSR } from "./utils";

class _Sounds {
  private moveSound: HTMLAudioElement;
  private captureSound: HTMLAudioElement;
  private checkSound: HTMLAudioElement;
  private checkmateSound: HTMLAudioElement;
  private stalemateSound: HTMLAudioElement;

  constructor() {
    if (!isSSR) {
      this.moveSound = new Audio('/sounds/move.wav');
      this.moveSound.load();
      this.captureSound = new Audio('/sounds/capture.wav');
      this.captureSound.load();
      this.checkSound = new Audio('/sounds/check.wav');
      this.checkSound.load();
      this.checkmateSound = new Audio('/sounds/checkmate.wav');
      this.checkmateSound.load();
      this.stalemateSound = new Audio('/sounds/stalemate.wav');
      this.stalemateSound.load();
    }
  }
  move = async () => {
    this.moveSound.currentTime = 0;
    await this.moveSound.play();
  }

  capture = async () => {
    this.captureSound.currentTime = 0;
    await this.captureSound.play();
  }

  check = async () => {
    this.checkSound.currentTime = 0;
    await this.checkSound.play();
  }

  checkmate = async () => {
    this.checkmateSound.currentTime = 0;
    await this.checkmateSound.play();
  }

  stalemate = async () => {
    this.stalemateSound.currentTime = 0;
    await this.stalemateSound.play();
  }
}

const Sounds = new _Sounds();

export default Sounds;
