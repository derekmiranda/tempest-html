export class AsyncAction {
  active: boolean = false;
  promise: Promise<void>;

  private resolve: (value?: unknown) => void;
  private reject: (error: Error) => void;

  start(): Promise<void> {
    this.promise = new Promise((resolve, reject) => {
      this.active = true;
      this.resolve = resolve;
      this.reject = reject;
    }).then(() => {
      this.active = false;
    });

    return this.promise;
  }

  complete() {
    this.resolve();
  }

  error(error) {
    this.reject(error);
  }
}
