import { TypeFamily } from ".";
import { Kind1, Kind2, Kind3, Kind4 } from "./kinds";

export type Reduce<T> = T extends { (): infer R } ? R : never

interface Carrier1<T1> {
  0: T1
}

interface Carrier2<T1, T2> {
  0: T1
  1: T2
}

interface Carrier3<T1, T2, T3> {
  0: T1
  1: T2
  2: T3
}

interface Carrier4<T1, T2, T3, T4> {
  0: T1
  1: T2
  2: T3
  3: T4
}


export type Generic1<R extends TypeFamily<Kind1>, T1> = R & Carrier1<T1>
export type Generic2<R extends TypeFamily<Kind2>, T1, T2> = R & Carrier2<T1, T2>
export type Generic3<R extends TypeFamily<Kind3>, T1, T2, T3> = R & Carrier3<T1, T2, T3>
export type Generic4<R extends TypeFamily<Kind4>, T1, T2, T3, T4> = R & Carrier4<T1, T2, T3, T4>

export namespace Generic {
  /**
   * A marker symbol for associating values of `T<A>` to `Generic<TRepr, A>`.
   */
  export const Type: unique symbol = Symbol("tshkt:Generic.Type")
}

/**
 * A concrete type `T<A>` needs to have an association to its corresponding Repr:
 *
 * ```typescript
 * interface Box<A> {
 *   [Generic.Type]: Generic1<BoxF, A>
 * }
 * ```
 * 
 * Now `BoxF` and `A` are inferred properly when a concrete `Box<A>` is used:
 *
 * ```typescript
 * declare function infer1<F, A>(fa: Of<F, A>): Of<F, string>
 * declare const box: Box<number>
 * infer1(box) // Box<string>
 * ```
 */
export interface HasGeneric<G> {
  [Generic.Type]: G
}