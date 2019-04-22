import "./builtins"
import {Of, Generic, Repr} from "tshkt"
import { Identity } from "./Identity";

interface Functor<F> {
  map<A, B>(fa: Of<F, A>, f: (a: A) => B): Of<F, B>
}

function map<F, A, B>(functor: Functor<F>, fa: Of<F, A>, f: (a: A) => B) {
  return functor.map(fa, f)
}

function asVoid<F, A>(functor: Functor<F>, fa: Of<F, A>): Of<F, void> {
  return map(functor, fa, () => {})
}

function dupAndShow<F, A>(F: Functor<F>, fa: Of<F, A>) {
  return F.map(F.map(fa, x => [x, x] as const), ([a, b]) => [a, String(b)] as const)
}

const ArrayFunctor = {
  map<A, B>(fa: ReadonlyArray<A>, f: (a: A) => B) {
    return fa.map(f)
  }
}

const IdentityFunctor = {
  map<A, B>(fa: Identity<A>, f: (a: A) => B) {
    return new Identity(f(fa.get()))
  }
}

dupAndShow(ArrayFunctor, [1,2,3])
asVoid(IdentityFunctor, dupAndShow(IdentityFunctor, new Identity(2)))