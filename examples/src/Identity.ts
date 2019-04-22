import {Generic, Repr} from "tshkt"

export class Identity<A> {
  [Generic.repr]: Generic<IdentityRepr, A>

  constructor(private value: A) {}

  get(): A {
    return this.value
  }
}

interface IdentityRepr extends Repr {
  type: Identity<this["argument"]>
}