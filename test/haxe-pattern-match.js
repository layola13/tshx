const Color = { Red: () => ({ _tag: "Red" }), Green: () => ({ _tag: "Green" }), Blue: () => ({ _tag: "Blue" }), Rgb: (r, g, b) => ({ _tag: "Rgb", r, g, b }) };
function describeColor(color) {
    switch (color._tag) {
        case "Red": return "Pure red";
        case "Green": return "Pure green";
        case "Blue": return "Pure blue";
        case "Rgb":
            const { r, g, b } = color;
            return `RGB(${r}, ${g}, ${b})`;
        default:
            return "Unknown color";
    }
}
const Result = { Success: (value) => ({ _tag: "Success", value }), Error: (message) => ({ _tag: "Error", message }) };
function handleResult(result) {
    switch (result._tag) {
        case "Success":
            const { value } = result;
            return `Got value: ${value}`;
        case "Error":
            const { message } = result;
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
