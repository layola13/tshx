// P0-1: Range iteration tests
console.log("=== P0-1: Range Iteration ===");
// Basic range
for (i in 0 ... 5) {
    console.log("Basic range:", i);
}
// Range with stepBy
for (i in (0 ... 10).stepBy(2)) {
    console.log("StepBy 2:", i);
}
// Negative stepBy (reverse)
for (i in (10 ... 0).stepBy(-2)) {
    console.log("Reverse stepBy:", i);
}
// P0-2: ADT Enum tests
console.log("\n=== P0-2: ADT Enums ===");
const Color = { Red: () => ({ _tag: "Red" }), Green: () => ({ _tag: "Green" }), Blue: () => ({ _tag: "Blue" }), Rgb: (r, g, b) => ({ _tag: "Rgb", r, g, b }) };
var Result;
(function (Result) {
})(Result || (Result = {}));
, E > {};
// Test enum construction
const red = Color.Red();
const green = Color.Green();
const customColor = Color.Rgb(255, 128, 0);
const success = Result.Success(42);
const failure = Result.Failure("Error message");
console.log("Red:", red);
console.log("Custom color:", customColor);
console.log("Success:", success);
console.log("Failure:", failure);
// Haxe type annotations
console.log("\n=== Haxe Types ===");
let intValue = 42;
let floatValue = 3.14;
let boolValue = true;
let dynamicValue = "anything";
console.log("Int:", intValue);
console.log("Float:", floatValue);
console.log("Bool:", boolValue);
console.log("Dynamic:", dynamicValue);
