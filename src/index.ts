import { Kind1, Kind2, Kind3, Kind4 } from "./kinds";
import { HasGeneric, Generic1, Generic2, Generic3, Generic4, Reduce } from "./generics";

export { Kind1, Kind2, Kind3, Kind4 } from "./kinds"
export { HasGeneric, Generic1, Generic2, Generic3, Generic4, Generic } from "./generics";

/**
 * A `TypeFamily` type is an encoding for a closed type family. Its type parameter `K` denotes the kind of the type.
 * For example, a type family with two type parameters has the kind `Kind2`.
 *
 * ```typescript
 * // Assumes a type Box<A> is defined
 * interface BoxF extends TypeFamily<Kind1> {
 *   (): Box<this[0]>
 * }
 * ```
 */
export type TypeFamily<K = Kind1> = K

type Generic1$Constraint<T, A1> = T extends TypeFamily<Kind1> ? HasGeneric<Generic1<T, A1>> : HasGeneric<Generic1<TypeFamily<Kind1>, A1>>
type Generic2$Constraint<T, A1, A2> = T extends TypeFamily<Kind2> ? HasGeneric<Generic2<T, A1, A2>> : HasGeneric<Generic2<TypeFamily<Kind2>, A1, A2>>
type Generic3$Constraint<T, A1, A2, A3> = T extends TypeFamily<Kind3> ? HasGeneric<Generic3<T, A1, A2, A3>> : HasGeneric<Generic3<TypeFamily<Kind3>, A1, A2, A3>>
type Generic4$Constraint<T, A1, A2, A3, A4> = T extends TypeFamily<Kind4> ? HasGeneric<Generic4<T, A1, A2, A3, A4>> : HasGeneric<Generic4<TypeFamily<Kind4>, A1, A2, A3, A4>>

/**
 * Transforms `T` and `A` into `T<A>` if `T` extends `TypeFamily`. The bound `HasGeneric<T, A>` is used
 * to allow type inference to function propely when `Of<T, A>` is used in function parameter positions.
 *
 * ```typescript
 * type test = Of<BoxF, string> // ==> Box<string>
 * ```
 */
export type Of<T, A> = Of1<T, A>
export type Of1<T, A1> =
  T extends TypeFamily<Kind1>
    ? Reduce<Generic1<T, A1>>
    : T extends TypeFamily<Kind2>
        ? Reduce<Generic2<T, any, A1>>
        : Generic1$Constraint<T, A1>
export type Of2<T, A1, A2> =
  T extends TypeFamily<Kind2>
    ? Reduce<Generic2<T, A1, A2>>
    : Generic2$Constraint<T, A1, A2>
export type Of3<T, A1, A2, A3> =
  T extends TypeFamily<Kind3>
    ? Reduce<Generic3<T, A1, A2, A3>>
    : Generic3$Constraint<T, A1, A2, A3>
export type Of4<T, A1, A2, A3, A4> =
  T extends TypeFamily<Kind4>
    ? Reduce<Generic4<T, A1, A2, A3, A4>>
    : Generic4$Constraint<T, A1, A2, A3, A4>
