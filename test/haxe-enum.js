const Color = { Red: () => ({ _tag: "Red" }), Green: () => ({ _tag: "Green" }), Blue: () => ({ _tag: "Blue" }), Rgb: (r, g, b) => ({ _tag: "Rgb", r, g, b }) };
const Result = { Success: (value) => ({ _tag: "Success", value }), Failure: (error) => ({ _tag: "Failure", error }) };
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
