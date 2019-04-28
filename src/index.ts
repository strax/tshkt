/**
 * A `Repr` type is an encoding for a type-level function `<T, A>(generic: Generic<T, A>) => T<A>`.
 *
 * ```typescript
 * // Assumes a type Box<A> is defined
 * interface BoxRepr extends Repr {
 *  type: Box<this["argument"]>
 * }
 * ```
 */
export interface Repr {
  argument: unknown
  type: unknown
}

/**
 * A `Generic<T, A>` is the defunctionalized representation of type `T<A>`.
 * By intersecting `TRepr` and `TypeArgument<TArgument>` we get a type
 * ```typescript
 * {
 *   type: T<A>
 *   argument: A
 * }
 * ```
 */
export type Generic<TRepr, TArgument> = TRepr & TypeArgument<TArgument>

export namespace Generic {
  /**
   * A marker symbol for associating values of `T<A>` to `Generic<TRepr, A>`.
   */
  export const repr: unique symbol = Symbol("Generic.repr")
}

export interface TypeArgument<T = unknown> {
  argument: T
}

/**
 * A concrete type `T<A>` needs to have an association to its corresponding Repr:
 *
 * ```typescript
 * interface Box<A> {
 *   [generic]: Generic<BoxRepr, A>
 * }
 * ```
 * 
 * Now `BoxRepr` and `A` are inferred properly when a rigid `Box<A>` is used:
 *
 * ```typescript
 * declare function infer1<F, A>(fa: Of<F, A>): Of<F, string>
 * declare const box: Box<number>
 * infer1(box) // Box<string>
 * ```
 */
export interface HasGeneric<T, A> {
  [Generic.repr]: Generic<T, A>
}

/**
 * Transforms `T` and `A` into `T<A>` if `T` extends `Repr`. The bound `HasGeneric<T, A>` is used
 * to allow type inference to function propely when `Of<T, A>` is used in function parameter positions.
 *
 * ```typescript
 * type test = Of<BoxRepr, string> // ==> Box<string>
 * ```
 */
export type Of<T, A> = [T] extends [Repr] ? Generic<T, A>["type"] : HasGeneric<T, A>
