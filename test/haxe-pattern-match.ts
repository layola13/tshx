// @ts-nocheck
// Test Haxe-style pattern matching with ADT enums

enum Color {
    Red;
    Green;
    Blue;
    Rgb(r: number, g: number, b: number);
}

function describeColor(color: Color): string {
    switch (color) {
        case Red:
            return "Pure red";
        case Green:
            return "Pure green";
        case Blue:
            return "Pure blue";
        case Rgb(r, g, b):
            return `RGB(${r}, ${g}, ${b})`;
        default:
            return "Unknown color";
    }
}

enum Result {
    Success(value: number);
    Error(message: string);
}

function handleResult(result: Result): string {
    switch (result) {
        case Success(value):
            return `Got value: ${value}`;
        case Error(message):
            return `Error: ${message}`;
    }
}

// Test execution
const red = Color.Red();
const green = Color.Green();
const rgb = Color.Rgb(128, 64, 255);

console.log("Color descriptions:");
console.log(describeColor(red));
console.log(describeColor(green));
console.log(describeColor(rgb));

const success = Result.Success(42);
const error = Result.Error("Not found");

console.log("\nResult handling:");
console.log(handleResult(success));
console.log(handleResult(error));