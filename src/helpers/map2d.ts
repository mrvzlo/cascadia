import { Coords } from "../components/coords";

export default class Map2D<T> {
  private inner: Map<string, T> = new Map();

  get(point: Coords) {
    return this.inner.get(this.getKey(point));
  }

  set(point: Coords, value: T) {
    return this.inner.set(this.getKey(point), value);
  }

  has(point: Coords) {
    return this.inner.has(this.getKey(point));
  }

  getAll() {
    return Array.from(this.inner.values());
  }

  delete(key: string) {
    this.inner.delete(key);
  }

  getKey(point: Coords) {
    return point.intX + "|" + point.intY;
  }
}
