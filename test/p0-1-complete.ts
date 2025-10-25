// @ts-nocheck
// P0-1 Complete Feature Test

// 1. Basic range iteration
console.log("=== Basic Range ===");
for (let i in 0...5) {
    console.log(i);
}

// 2. StepBy with positive step
console.log("=== StepBy Positive ===");
for (let i in (0...20).stepBy(5)) {
    console.log(i);
}

// 3. StepBy with negative step
console.log("=== StepBy Negative ===");
for (let i in (100...0).stepBy(-10)) {
    console.log(i);
}

// 4. Haxe types
console.log("=== Haxe Types ===");
var count: Int = 10;
var pi: Float = 3.14159;
var active: Bool = true;
var data: Dynamic = { name: "test" };
console.log(count, pi, active, data);

console.log("=== All P0-1 Tests Complete ===");