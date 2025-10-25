// Comprehensive P0 features test for Haxe extensions in TypeScript
// ============================================
// P0-1: Range iteration with stepBy
// ============================================
console.log("=== P0-1: Range Iteration Tests ===");
// Basic range (exclusive)
console.log("Basic range 0...5:");
for (let i = 0; i < 5; i++) {
    console.log(i); // 0, 1, 2, 3, 4
}
// Range with stepBy
console.log("\nRange 0...10 with stepBy(2):");
for (let i = 0; i < 10; i += 2) {
    console.log(i); // 0, 2, 4, 6, 8
}
// Negative stepBy (reverse iteration)
console.log("\nRange 10...0 with stepBy(-1):");
for (let i = 10; i > 0; i += -1) {
    console.log(i); // 10, 9, 8, ..., 1
}
// ============================================
// P0-2: ADT Enums with parameters
// ============================================
console.log("\n=== P0-2: ADT Enum Tests ===");
const Color = { Red: () => ({ _tag: "Red" }), Green: () => ({ _tag: "Green" }), Blue: () => ({ _tag: "Blue" }), Rgb: (r, g, b) => ({ _tag: "Rgb", r, g, b }), Alpha: (color, alpha) => ({ _tag: "Alpha", color, alpha }) };
// Create enum instances
const red = Color.Red();
const green = Color.Green();
const blue = Color.Blue();
const orange = Color.Rgb(255, 165, 0);
const translucentRed = Color.Alpha(Color.Red(), 0.5);
console.log("Color instances:");
console.log("red:", red);
console.log("orange:", orange);
console.log("translucentRed:", translucentRed);
const Result = { Success: (value) => ({ _tag: "Success", value }), Error: (message) => ({ _tag: "Error", message }) };
const success = Result.Success(42);
const error = Result.Error("File not found");
console.log("\nResult instances:");
console.log("success:", success);
console.log("error:", error);
// ============================================
// P0-3: Switch pattern matching with ADT enums
// ============================================
console.log("\n=== P0-3: Switch Pattern Matching Tests ===");
// Function using switch for pattern matching
function describeColor(color) {
    switch (color._tag) {
        case "Red":
            return "Pure red";
        case "Green":
            return "Pure green";
        case "Blue":
            return "Pure blue";
        case "Rgb":
            const { r, g, b } = color;
            return `RGB(${r}, ${g}, ${b})`;
        case "Alpha":
            const { color: innerColor, alpha } = color;
            return `Transparent color with alpha ${alpha}`;
        default:
            return "Unknown color";
    }
}
console.log("Color descriptions:");
console.log(describeColor(red));
console.log(describeColor(orange));
console.log(describeColor(translucentRed));
// Function for Result pattern matching
function handleResult(result) {
    switch (result._tag) {
        case "Success":
            const { value } = result;
            return `Operation succeeded with value: ${value}`;
        case "Error":
            const { message } = result;
            return `Operation failed: ${message}`;
        default:
            return "Unknown result";
    }
}
console.log("\nResult handling:");
console.log(handleResult(success));
console.log(handleResult(error));
// ============================================
// Combined test: Range + Enum + Pattern matching
// ============================================
console.log("\n=== Combined P0 Features Test ===");
const Status = { Pending: () => ({ _tag: "Pending" }), InProgress: (percent) => ({ _tag: "InProgress", percent }), Complete: (result) => ({ _tag: "Complete", result }) };
const statuses = [
    Status.Pending(),
    Status.InProgress(50),
    Status.InProgress(75),
    Status.Complete("Done!")
];
console.log("Processing statuses:");
for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];
    let description;
    switch (status._tag) {
        case "Pending":
            description = "Waiting to start";
            break;
        case "InProgress":
            const { percent } = status;
            description = `${percent}% complete`;
            break;
        case "Complete":
            const { result } = status;
            description = `Finished: ${result}`;
            break;
        default:
            description = "Unknown status";
    }
    console.log(`Status ${i}: ${description}`);
}
console.log("\n=== All P0 tests completed successfully! ===");
