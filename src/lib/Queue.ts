export class Queue<T> {
  first: QueueNode<T> = null;
  last: QueueNode<T> = null;

  constructor(initItems: T | T[]) {
    if (initItems) {
      this.enqueue(initItems);
    }
  }

  enqueue(item: T | T[]): void {
    if (!Array.isArray(item)) item = [item];

    item.forEach((_item) => {
      const newNode = new QueueNode<T>(_item);
      if (!this.first) {
        this.first = this.last = newNode;
      } else {
        this.last.next = newNode;
        this.last = newNode;
      }
    });
  }

  dequeue(): T {
    const dequeued = this.first;
    if (this.first === this.last) {
      this.first = this.last = null;
    } else {
      this.first = this.first.next;
    }
    return dequeued.item;
  }

  getFirst(): T {
    return this.first && this.first.item;
  }
}

class QueueNode<T> {
  item: T;
  next: QueueNode<T>;

  constructor(item) {
    this.item = item;
  }
}
