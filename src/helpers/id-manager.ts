export class IdManager {
  private prefixes = new Map<string, number>();

  getNext(prefix: string) {
    const last = this.prefixes.get(prefix) ?? 0;
    this.prefixes.set(prefix, last + 1);
    return prefix + ":" + last;
  }
}
