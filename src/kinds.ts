import { Witnessing } from "./witness";

// Witnesses for kinds (* -> *) to (* -> * -> * -> * -> *)
declare const enum K1 { }
declare const enum K2 { }
declare const enum K3 { }
declare const enum K4 { }

export interface Kind1 extends Witnessing<K1> {
  0: unknown
}

export interface Kind2 extends Witnessing<K2> {
  0: unknown
  1: unknown
}

export interface Kind3 extends Witnessing<K3> {
  0: unknown
  1: unknown
  2: unknown
}

export interface Kind4 extends Witnessing<K4> {
  0: unknown
  1: unknown
  2: unknown
  3: unknown
}
