
declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, options?: MapOptions);
    setCenter(latLng: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
    panTo(latLng: LatLng | LatLngLiteral): void;
    controls: MVCArray<Node>[][];
    fitBounds(bounds: LatLngBounds): void;
  }
  
  class Marker {
    constructor(opts?: MarkerOptions);
    setPosition(latLng: LatLng | LatLngLiteral): void;
    setMap(map: Map | null): void;
    getPosition(): LatLng | null;
  }
  
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

  class LatLngBounds {
    constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
    extend(point: LatLng | LatLngLiteral): LatLngBounds;
    getCenter(): LatLng;
    isEmpty(): boolean;
    toJSON(): object;
    toSpan(): LatLng;
    toString(): string;
    union(other: LatLngBounds): LatLngBounds;
  }
  
  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
  }
  
  interface MarkerOptions {
    position?: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
  }
  
  interface LatLng {
    lat(): number;
    lng(): number;
  }
  
  interface LatLngLiteral {
    lat: number;
    lng: number;
  }
  
  interface MouseEvent {
    latLng: LatLng;
  }
  
  namespace event {
    function addListener(instance: any, eventName: string, handler: Function): any;
  }
  
  namespace ControlPosition {
    const RIGHT_BOTTOM: number;
  }
}
