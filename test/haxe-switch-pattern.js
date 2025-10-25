const Color = { Red: () => ({ _tag: "Red" }), Green: () => ({ _tag: "Green" }), Blue: () => ({ _tag: "Blue" }), Rgb: (r, g, b) => ({ _tag: "Rgb", r, g, b }) };
// Test function: basic switch with enum values
function getColorName(color) {
    switch (color._tag) {
        case "Red":
            return "Red";
        case "Green":
            return "Green";
        case "Blue":
            return "Blue";
        case "Rgb":
            const { r, g, b } = color;
            return `RGB(${r}, ${g}, ${b})`;
        default:
            return "Unknown";
    }
}
// Test function: getting red component
function getRedComponent(color) {
    switch (color._tag) {
        case "Rgb":
            const { r } = color;
            return r;
        case "Red":
            return 255;
        default:
            return 0;
    }
}
const Result = { Success: (value) => ({ _tag: "Success", value }), Error: (message) => ({ _tag: "Error", message }) };
// Test function: Result pattern matching
function handleResult(result) {
    switch (result._tag) {
        case "Success":
            const { value } = result;
            return `Got value: ${value}`;
        case "Error":
            const { message } = result;
            return `Error: ${message}`;
        default:
            return "Unknown result";
    }
}
// Test execution
const red = Color.Red();
const green = Color.Green();
const blue = Color.Blue();
const rgb = Color.Rgb(128, 64, 255);
console.log("Color name tests:");
console.log(getColorName(red)); // "Red"
console.log(getColorName(green)); // "Green"
console.log(getColorName(rgb)); // "RGB(128, 64, 255)"
console.log("\nRed component tests:");
console.log(getRedComponent(red)); // 255
console.log(getRedComponent(rgb)); // 128
console.log(getRedComponent(green)); // 0
console.log("\nResult tests:");
const success = Result.Success(42);
const error = Result.Error("Not found");
console.log(handleResult(success)); // "Got value: 42"
console.log(handleResult(error)); // "Error: Not found"
