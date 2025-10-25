// @ts-nocheck
// Haxe-style Enhanced Enum Test

enum Color {
  Red;
  Green;
  Blue;
  Rgb(r: Int, g: Int, b: Int);
}

enum Result {
  Success(value: Int);
  Failure(error: String);
}

// Usage - should transform to factory functions
const red = Color.Red();
const green = Color.Green();
const customColor = Color.Rgb(255, 128, 0);

const success = Result.Success(42);
const failure = Result.Failure("Something went wrong");

console.log("Colors:", red, green, customColor);
console.log("Results:", success, failure);

// Expected transformation:
// Color.Red = () => ({ _tag: 'Red' })
// Color.Rgb = (r, g, b) => ({ _tag: 'Rgb', r, g, b })