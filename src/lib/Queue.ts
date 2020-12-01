export class Queue<T> {
  first: QueueNode<T>;
  last: QueueNode<T>;

  constructor(initItems?: T | T[]) {
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
      this.first = this.last = undefined;
    } else {
      this.first = this.first.next;
    }
    return dequeued.item;
  }

  // insert item in correct place
  add(item: T, comparator: (first: T, second: T) => number) {
    const node = new QueueNode<T>(item);
    if (!this.first) {
      this.first = this.last = node;
      return;
    }
    // if item to add goes before first
    if (comparator(item, this.first.item) < 0) {
      const oldFirst = this.first;
      this.first = node;
      this.first.next = oldFirst;
      return;
    }

    let curr = this.first;
    let next = this.first.next;

    while (next && comparator(item, next.item) >= 0) {
      // update pointers
      curr = next;
      next = next.next;
    }

    // add item after curr
    curr.next = node;
    node.next = next;

    if (curr === this.last) {
      this.last = node;
    }
  }

  remove(item: T) {
    if (!this.first) return;

    // check if first has item
    if (this.first.item === item) {
      if (this.last === this.first) {
        this.last = undefined;
      }
      this.first = this.first.next;
      return;
    }

    // check if subsequent nodes have item
    let curr = this.first;
    let next = this.first.next;

    while (next) {
      // check subsequent
      if (next.item === item) {
        // join nodes around node with item
        curr.next = next.next;
        if (this.last === next) {
          this.last = undefined;
        }
        return;
      }

      // update pointers
      curr = curr.next;
      next = curr?.next;
    }
  }

  getFirst(): T {
    return this.first?.item;
  }
}

class QueueNode<T> {
  item: T;
  next: QueueNode<T>;

  constructor(item) {
    this.item = item;
  }
}
