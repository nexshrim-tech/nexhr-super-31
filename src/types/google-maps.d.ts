declare namespace google.maps {
  class MVCArray<T> {
    constructor(array?: T[]);
    clear(): void;
    getArray(): T[];
    getAt(i: number): T;
    getLength(): number;
    insertAt(i: number, elem: T): void;
    pop(): T;
    push(elem: T): number;
    removeAt(i: number): T;
    setAt(i: number, elem: T): void;
    forEach(callback: (elem: T, i: number) => void): void;
  }
  
  // Add any other Google Maps types needed
}
