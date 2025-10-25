// Enhanced enum test - simplified without generics
// Standard TypeScript enums don't support generics, so we use a workaround

// Simple enum for Option type
enum OptionTag {
  Some,
  None
}

// Option type using objects
interface Option<T> {
  _tag: OptionTag;
  value?: T;
}

// Helper functions to create Option instances
function some<T>(value: T): Option<T> {
  return { _tag: OptionTag.Some, value };
}

function none<T>(): Option<T> {
  return { _tag: OptionTag.None };
}

// Create instances
const someValue = some(42);
const noneValue = none();

console.log("Some value:", someValue);
console.log("None value:", noneValue);

// Result type
enum ResultTag {
  Ok,
  Err
}

interface Result<T, E> {
  _tag: ResultTag;
  value?: T;
  error?: E;
}

function ok<T, E>(value: T): Result<T, E> {
  return { _tag: ResultTag.Ok, value };
}

function err<T, E>(error: E): Result<T, E> {
  return { _tag: ResultTag.Err, error };
}

const success = ok<number, string>(100);
const failure = err<number, string>("Something went wrong");

console.log("Success:", success);
console.log("Failure:", failure);