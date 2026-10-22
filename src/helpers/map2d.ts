import { Point } from "pixi.js";

export default class Map2D<T> {
  private inner: Map<number, Map<number, T>> = new Map();

  get(point: Point) {
    return this.inner.get(point.x)?.get(point.y);
  }

  set(point: Point, value: T) {
    if (!this.inner.has(point.x)) this.inner.set(point.x, new Map());
    this.inner.get(point.x)!.set(point.y, value);
  }

  has(point: Point) {
    return this.inner.has(point.x) && this.inner.get(point.x)!.has(point.y);
  }

  getAll() {
    return Array.from(this.inner.values()).flatMap((row) => Array.from(row.values()));
  }
}
