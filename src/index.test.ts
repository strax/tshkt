import { Generic, TypeFamily, Of, Kind1, Generic1, Kind2, Generic2, Of2 } from ".";
import { Carrier2 } from "./generics"

declare class Box<A> {
  [Generic.Type]: Generic1<BoxF, A>

  readonly value: A
}

interface BoxF extends TypeFamily<Kind1> {
  (): Box<this[0]>
}

interface CrossF extends TypeFamily<Kind2> {
  <A extends this[0], B extends this[1]>(): [A, B]
}

type x = Of2<CrossF, string, number>

declare const enum Pass {}

type Eq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false
type Assert<T extends true> = Pass

namespace test$1 {
  export type Result = Assert<Eq<Of<BoxF, string>, Box<string>>>
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
  const result = duplicate(box, fb => fb.value, Box)
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

// Tests kinds * -> * -> *
namespace test$7 {
  class Pair<A, B> {
    [Generic.Type]: Generic2<Pair$λ, A, B>
    constructor(readonly _0: A, readonly _1: B) {}
  }

  interface Pair$λ extends TypeFamily<Kind2> {
    (): Pair<this[0], this[1]>
  }

  declare function infer2<T extends TypeFamily<Kind2>, A1, A2>(t: Of2<T, A1, A2>): Of2<T, A1, A2>

  declare const pair: Pair<string, number>
  declare function asVoid<F, A>(fa: Of<F, A>): Of<F, void>
  declare function infer<T, A1>(fa: Of<T, A1>): Of<T, A1>

  declare const box: Box<string>

  type Ex = Of<Pair$λ, string>
  const inferred = infer(pair)
  const asV = asVoid(pair)
  type Result = Assert<Eq<Pair<string, void>, typeof asV>>
  const x = infer2(pair)
 }
