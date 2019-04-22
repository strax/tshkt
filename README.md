# Encoding higher-kinded types in TypeScript

## Motivation

Higher-kinded types are needed when abstracting over type constructors; one might want to define an interface
that captures the behavior of objects that support mapping; e.g.

```typescript
interface Mappable<A> {
  map<B>(f: (a: A) => B): ???
}
```

The problem is caused by the return type of `map`: if `Array<T>` implements `Mappable<T>`, we would like to express that mapping over an array returns an array. We would end up with

```typescript
interface Mappable<F, A> {
  // Assuming `this` is F<A>
  map(f: (a: A) => B): F<B>
}
```

but this syntax is not supported in TypeScript ([TypeScript#1213](https://github.com/Microsoft/TypeScript/issues/1213)). This library provides means to express `F<B>` using the existing semantics of TypeScript.

## Usage

Let us have a simple container for values:

```typescript
import {Repr, Generic, Of} from "tshkt"
class Box<A> {
  [Generic.repr]: Generic<BoxRepr, A> // Explained below
  constructor(private value: A) {}
}
```

To encode the type constructor `Box` we write

```typescript
interface BoxRepr extends Repr {
  type: Box<this["argument"]>
}
```

and associate `Box<A>` with `Generic<BoxRepr, A>` by adding a phantom property with name `[Generic.repr]` to
the shape of `Box<A>`. Now we can convert a `Generic<BoxRepr, A>` to `Box<A>` with

```typescript
type test1 = Of<BoxRepr, string> // Box<string>
```

and perform type inference in function parameters:

```typescript
declare function asVoid<F, A>(fa: Of<F, A>): Of<F, void>
asVoid(new Box(2)) // evaluates to Box<void>
```

## License

MIT