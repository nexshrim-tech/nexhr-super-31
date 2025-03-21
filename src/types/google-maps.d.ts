declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element | null, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      fitBounds(bounds: LatLngBounds, padding?: number | Padding): void;
      getZoom(): number;
      controls: MVCArray<Node>[][];
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
      toJSON(): LatLngLiteral;
      toString(): string;
      equals(other: LatLng): boolean;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      extend(point: LatLng | LatLngLiteral): LatLngBounds;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      getPosition(): LatLng | null;
      addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener;
      setTitle(title: string): void;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map?: Map, anchor?: MVCObject): void;
      close(): void;
      setContent(content: string | Node): void;
    }

    class MVCArray<T> {
      constructor(array?: T[]);
      push(element: T): number;
      pop(): T;
      getLength(): number;
    }

    class MVCObject {
      constructor();
    }

    interface ControlPosition {
      TOP_LEFT: number;
      TOP_CENTER: number;
      TOP_RIGHT: number;
      LEFT_CENTER: number;
      RIGHT_CENTER: number;
      BOTTOM_LEFT: number;
      BOTTOM_CENTER: number;
      BOTTOM_RIGHT: number;
    }

    namespace event {
      function addListener(instance: object, eventName: string, handler: (...args: any[]) => void): MapsEventListener;
      function removeListener(listener: MapsEventListener): void;
      function clearInstanceListeners(instance: object): void;
    }

    const ControlPosition: ControlPosition;

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      minZoom?: number;
      maxZoom?: number;
      mapTypeId?: string;
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
      mapTypeControl?: boolean;
      scaleControl?: boolean;
      streetViewControl?: boolean;
      rotateControl?: boolean;
      fullscreenControl?: boolean;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface Padding {
      top: number;
      right: number;
      bottom: number;
      left: number;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      label?: string | MarkerLabel;
      draggable?: boolean;
      animation?: Animation;
    }

    interface InfoWindowOptions {
      content?: string | Node;
      position?: LatLng | LatLngLiteral;
      maxWidth?: number;
    }

    interface Icon {
      url: string;
      size?: Size;
      origin?: Point;
      anchor?: Point;
      scaledSize?: Size;
    }

    interface MarkerLabel {
      text: string;
      color?: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
    }

    interface Size {
      width: number;
      height: number;
    }

    interface Point {
      x: number;
      y: number;
    }

    interface Symbol {
      path: string;
      fillColor?: string;
      fillOpacity?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }

    enum Animation {
      BOUNCE = 1,
      DROP = 2
    }

    interface MapsEventListener {
      remove(): void;
    }

    interface MapMouseEvent {
      latLng?: LatLng;
    }
  }
}

interface Window {
  google: typeof google;
}
