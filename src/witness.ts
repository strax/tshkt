declare const $witness: unique symbol

export interface Witnessing<T> {
  [$witness]: T
}
