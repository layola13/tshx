// @ts-nocheck
// Enhanced Enum Test - ADT-style enums with data

// Simple enum without data
enum Status {
  Pending,
  Running,
  Complete
}

// Enum with data variants (Haxe style)
enum MyResult {
  Success(value: number),
  Failure(error: string)
}

enum MyOption {
  Something(value: any),
  Nothing
}

// Usage - these should be transformed to factory functions
const status1 = Status.Pending();
const status2 = Status.Complete();

const result1 = MyResult.Success(42);
const result2 = MyResult.Failure("error occurred");

const opt1 = MyOption.Something("hello");
const opt2 = MyOption.Nothing();

console.log("Status:", status1, status2);
console.log("Result:", result1, result2);
console.log("Option:", opt1, opt2);