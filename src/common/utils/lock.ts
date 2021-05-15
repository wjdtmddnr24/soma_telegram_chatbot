import * as EventEmitter from 'events';

export class Lock {
  private _locked = false;
  private _eventEmitter: EventEmitter = new EventEmitter();
  acquire(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this._locked) {
        this._locked = true;
        return resolve();
      }
      const tryAquire = () => {
        if (!this._locked) {
          this._locked = true;
          this._eventEmitter.removeListener('release', tryAquire);
          return resolve();
        }
      };
      this._eventEmitter.on('release', tryAquire);
    });
  }
  release() {
    this._locked = false;
    setImmediate(() => this._eventEmitter.emit('release'));
  }
}
