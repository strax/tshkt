declare const $witness: unique symbol

interface Witnessing<T> {
  [$witness]: T
}

/**
 * A `HFunction` type is an encoding for a closed type family. Its type parameter `K` denotes the kind of the type.
 * For example, a type family with two type parameters has the kind `Kind2`.
 *
 * ```typescript
 * // Assumes a type Box<A> is defined
 * interface BoxF extends HFunction<Kind1> {
 *   (): Box<this[0]>
 * }
 * ```
 */
export type HFunction<K = Kind1> = K

// Witnesses for kinds (* -> *) to (* -> * -> * -> * -> *)
declare const enum K1 {}
declare const enum K2 {}
declare const enum K3 {}
declare const enum K4 {}

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

type Reduce<T> = T extends {(): infer R} ? R : never

export type Generic1<R extends HFunction<Kind1>, T1> = R & Carrier1<T1>
export type Generic2<R extends HFunction<Kind2>, T1, T2> = R & Carrier2<T1, T2>
export type Generic3<R extends HFunction<Kind3>, T1, T2, T3> = R & Carrier3<T1, T2, T3>
export type Generic4<R extends HFunction<Kind4>, T1, T2, T3, T4> = R & Carrier4<T1, T2, T3, T4>

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

type Generic1$Constraint<T, A1> = T extends HFunction<Kind1> ? HasGeneric<Generic1<T, A1>> : HasGeneric<Generic1<HFunction<Kind1>, A1>>
type Generic2$Constraint<T, A1, A2> = T extends HFunction<Kind2> ? HasGeneric<Generic2<T, A1, A2>> : HasGeneric<Generic2<HFunction<Kind2>, A1, A2>>
type Generic3$Constraint<T, A1, A2, A3> = T extends HFunction<Kind3> ? HasGeneric<Generic3<T, A1, A2, A3>> : HasGeneric<Generic3<HFunction<Kind3>, A1, A2, A3>>
type Generic4$Constraint<T, A1, A2, A3, A4> = T extends HFunction<Kind4> ? HasGeneric<Generic4<T, A1, A2, A3, A4>> : HasGeneric<Generic4<HFunction<Kind4>, A1, A2, A3, A4>>

/**
 * Transforms `T` and `A` into `T<A>` if `T` extends `HFunction`. The bound `HasGeneric<T, A>` is used
 * to allow type inference to function propely when `Of<T, A>` is used in function parameter positions.
 *
 * ```typescript
 * type test = Of<BoxF, string> // ==> Box<string>
 * ```
 */

export type Of<T, A> = Of1<T, A>
export type Of1<T, A1> = T extends HFunction<Kind1> ? Reduce<Generic1<T, A1>> : Generic1$Constraint<T, A1>
export type Of2<T, A1, A2> = T extends HFunction<Kind2> ? Reduce<Generic2<T, A1, A2>> : Generic2$Constraint<T, A1, A2>
export type Of3<T, A1, A2, A3> = T extends HFunction<Kind3> ? Reduce<Generic3<T, A1, A2, A3>> : Generic3$Constraint<T, A1, A2, A3>
export type Of4<T, A1, A2, A3, A4> = T extends HFunction<Kind4> ? Reduce<Generic4<T, A1, A2, A3, A4>> : Generic4$Constraint<T, A1, A2, A3, A4>