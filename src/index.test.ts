import {Repr, Of, Generic} from "."

class Box<A> {
  [Generic.repr]!: Generic<BoxRepr, A>
  constructor(private value: A) {}

  map<B>(f: (a: A) => B): Box<B> {
    return new Box(f(this.value))
  }
}

interface BoxRepr extends Repr<Box<unknown>> {
  type: this extends Generic<BoxRepr, infer A> ? Box<A> : never
}

declare function asVoid<F, A>(fa: Of<F, A>): Of<F, void>
asVoid(new Box(2))

