/**
 * A `Repr` type is an encoding for a type-level function `<T, A>(generic: Generic<T, A>) => T<A>`.
 *
 * ```typescript
 * // Assumes a type Box<A> is defined
 * interface BoxRepr extends Repr<Box<unknown>> {
 *  type: this extends Generic<BoxRepr, infer A> ? Box<A> : never
 * }
 * ```
 */
export interface Repr<TWitness = unknown> {
  witness: TWitness
  type: unknown
}

/**
 * A `Generic<T, A>` is the defunctionalized representation of type `T<A>`.
 */
export interface Generic<TTypeConstructor, TArgument> {
  constructor: TTypeConstructor
  argument: TArgument
}

export namespace Generic {
  export declare const repr: unique symbol
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
export type Of<T, A> = T extends Repr ? (T & Generic<T, A>)["type"] : HasGeneric<T, A>
