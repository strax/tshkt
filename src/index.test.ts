import { Generic, Repr, Of } from ".";

declare class Box<A> {
  [Generic.repr]: Generic<BoxRepr, A>

  readonly value: A
}

interface BoxRepr extends Repr {
  type: Box<this["argument"]>
}

declare const enum Pass {}

type Eq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false
type Assert<T extends true> = Pass

namespace test$1 {
  export type Result = Assert<Eq<Of<BoxRepr, string>, Box<string>>>
}

namespace test$2 {
  declare const box: Box<number>
  declare function test<F, A>(fa: Of<F, A>): typeof fa

  const inferred = test(box)
  export type Result = Assert<Eq<typeof inferred, Box<number>>>
}

namespace test$3 {
  declare const box: Box<number>
  declare function test<F, A>(fa: Of<F, A>): Of<F, A>

  const inferred = test(box)
  export type Result = Assert<Eq<typeof inferred, Box<number>>>
}

namespace test$4 {
  declare const box: Box<number>
  declare function asVoid<F, A>(fa: Of<F, A>): Of<F, void>

  const inferred = asVoid(box)
  export type Result = Assert<Eq<typeof inferred, Box<void>>>
}

// Tests extracting and lifting generic parameters
namespace test$5 {
  declare const box: Box<string>
  function duplicate<F, A>(fa: Of<F, A>, extract: <B>(fb: Of<F, B>) => B, lift: <B>(b: B) => Of<F, B>) {
    const a = extract(fa)
    return lift([a, a] as const)
  }
  declare function Box<T>(x: T): Box<T>
  const result = duplicate(box, b => b.value, Box)
  export type Result = Assert<Eq<typeof result, Box<readonly [string, string]>>>
}

// Tests static-land typeclass inference
namespace test$6 {
  interface Functor<F> {
    map<A, B>(fa: Of<F, A>, f: (a: A) => B): Of<F, B>
  }

  declare function Box<T>(x: T): Box<T>
  const BoxFunctor = {
    map<A, B>(box: Box<A>, f: (a: A) => B): Box<B> {
      return Box(f(box.value))
    }
  }
  function map<F, A, B>(functor: Functor<F>, fa: Of<F, A>, f: (a: A) => B): Of<F, B> {
    return functor.map(functor.map(functor.map(fa, x => x), f), x => x)
  }
  declare const box: Box<string>

  const mapped = map(BoxFunctor, box, _ => parseInt(_, 10))
  export type Result = Assert<Eq<typeof mapped, Box<number>>>
}