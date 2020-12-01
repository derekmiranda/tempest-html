import { Queue } from "./Queue";

describe("Queue", () => {
  it("has proper defaults", () => {
    const q = new Queue<number>();
    expect(q.first).toBe(undefined);
    expect(q.last).toBe(undefined);
  });

  it("can enqueue items", () => {
    const q = new Queue<number>();
    q.enqueue(1);
    q.enqueue(2);
    q.enqueue(3);
    expect(q.first.item).toBe(1);
    expect(q.first.next.item).toBe(2);
    expect(q.first.next.next.item).toBe(3);
    expect(q.last.item).toBe(3);
  });

  it("can dequeue items", () => {
    const q = new Queue<number>();
    q.enqueue(1);
    q.enqueue(2);
    expect(q.dequeue()).toBe(1);
    expect(q.first.item).toBe(2);
    expect(q.last.item).toBe(2);
  });

  it("can dequeue just one item", () => {
    const q = new Queue<number>();
    q.enqueue(1);
    expect(q.dequeue()).toBe(1);
    expect(q.first).toBe(undefined);
    expect(q.last).toBe(undefined);
  });

  it("can remove a specific item", () => {
    const q = new Queue<number>();
    q.enqueue(1);
    q.enqueue(2);
    q.enqueue(5);
    q.remove(2);
    expect(q.first.item).toBe(1);
    expect(q.first.next.item).toBe(5);
    expect(q.last.item).toBe(5);
  });

  it("can remove the first item", () => {
    const q = new Queue<number>();
    q.enqueue(1);
    q.remove(1);
    expect(q.first).toBe(undefined);
    expect(q.last).toBe(undefined);
  });

  it("will not do anything if can't find item to remove", () => {
    const q = new Queue<number>();
    q.enqueue(1);
    q.remove(2);
    expect(q.first.item).toBe(1);
    expect(q.last.item).toBe(1);
  });

  it("can add item with comparison function", () => {
    const q = new Queue<number>();
    q.enqueue(1);
    q.enqueue(2);
    q.enqueue(4);
    q.add(3, (a, b) => a - b);
    expect(q.first.item).toBe(1);
    expect(q.first.next.item).toBe(2);
    expect(q.first.next.next.item).toBe(3);
    expect(q.first.next.next.next.item).toBe(4);
    expect(q.last.item).toBe(4);
  });

  it("can add item as first", () => {
    const q = new Queue<number>();
    q.add(1, (a, b) => a - b);
    expect(q.first.item).toBe(1);
    expect(q.last.item).toBe(1);
  });

  it("can add item that would replace first", () => {
    const q = new Queue<number>();
    q.enqueue(2);
    q.enqueue(3);
    q.add(1, (a, b) => a - b);
    expect(q.first.item).toBe(1);
    expect(q.first.next.item).toBe(2);
    expect(q.first.next.next.item).toBe(3);
    expect(q.last.item).toBe(3);
  });

  it("can add item that would replace last", () => {
    const q = new Queue<number>();
    q.enqueue(1);
    q.enqueue(2);
    q.add(3, (a, b) => a - b);
    expect(q.first.item).toBe(1);
    expect(q.first.next.item).toBe(2);
    expect(q.first.next.next.item).toBe(3);
    expect(q.last.item).toBe(3);
  });
});
