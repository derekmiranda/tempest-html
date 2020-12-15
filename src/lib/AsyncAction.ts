export class AsyncAction {
  active: boolean = false;
  promise: Promise<void>;

  private resolve: (value?: unknown) => void;
  private reject: (error: Error) => void;

  start() {
    this.promise = new Promise((resolve, reject) => {
      this.active = true;
      this.resolve = resolve;
      this.reject = reject;
    }).then(() => {
      this.active = false;
    });
  }

  complete() {
    this.resolve();
  }

  error(error) {
    this.reject(error);
  }
}
