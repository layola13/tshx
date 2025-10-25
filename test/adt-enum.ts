// ADT-style enum using transformer pattern
// Syntax: enum members become factory methods

enum Option {
  Some,
  None
}

// The transformer will generate these factory functions:
// Option.Some = (value) => ({ _tag: 'Some', value })
// Option.None = () => ({ _tag: 'None' })

enum Result {
  Ok,
  Err
}

// Usage examples that will be transformed
const someValue = Option.Some(42);
const noneValue = Option.None();

console.log("Some:", someValue);
console.log("None:", noneValue);

const success = Result.Ok(100);
const failure = Result.Err("error");

console.log("Success:", success);
console.log("Failure:", failure);