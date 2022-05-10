export class Timer {
  finished: boolean = false;
  timePassed: number = 0;
  timeLeft: number = 0;
  private timerBonus: number = 0;
  timerLimit: number = 0;

  private startDate: number = 0;

  private previousTimestamp: number = 0;

  private oldDate: number = 0;

  interval: NodeJS.Timeout;

  constructor(
    timeBase: number,
    timeIncrement: number,
    startDate: number,
    timeLeft?: number
  ) {
    this.timerBonus = timeIncrement * 1000;
    this.timeLeft = timeLeft ? timeLeft : timeBase * 1000 * 60;
    this.timerLimit = timeBase * 1000 * 60;
    this.startDate = startDate;
    this.previousTimestamp = this.startDate;
  }

  handler = (secondPassCallback: () => void) => () => {
    const now = Date.now();
    const diff = now - this.oldDate;
    if (diff < 1000) return;

    this.timeLeft = this.timeLeft - diff;
    this.oldDate = now;
    secondPassCallback();
  };

  reinit = (lastTimestamp: number, secondPassCallback: () => void) => {
    this.previousTimestamp = lastTimestamp;
    // this.timePassed = this.timerLimit - this.timeLeft;

    console.log(secondPassCallback);
    if (!secondPassCallback) {
      return;
    }

    this.start(secondPassCallback);
  };

  start = (secondPassCallback: () => void) => {
    this.clear();

    if (this.finished) {
      this.clear();
      return;
    }
    this.oldDate = Date.now();

    this.interval = setInterval(this.handler(secondPassCallback), 100);
  };

  stop = (lastTimestamp: number, useMoveTome: boolean = true) => {
    this.clear();
    if (this.finished) {
      this.clear();
      return;
    }
    const currentTimestamp = lastTimestamp;
    const moveTime = currentTimestamp - this.previousTimestamp;
    this.previousTimestamp = lastTimestamp;

    if (!useMoveTome) {
      return;
    }

    const timePassed =
      this.timePassed + moveTime - (lastTimestamp <= 0 ? 0 : this.timerBonus);

    this.timeLeft = this.timerLimit - timePassed;
    this.timePassed = timePassed;
  };

  clear = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
  };
}
