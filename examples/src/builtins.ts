import {Generic, Repr} from "tshkt"

interface ArrayRepr extends Repr {
  type: Array<this["argument"]>
}

declare global {
  interface Array<T> {
    [Generic.repr]: Generic<ArrayRepr, T>
  }
}

interface ReadonlyArrayRepr extends Repr {
  type: ReadonlyArray<this["argument"]>
}

declare global {
  interface ReadonlyArray<T> {
    [Generic.repr]: Generic<ReadonlyArrayRepr, T>
  }
}