// @ts-nocheck
// P0-1 Complete Feature Test
// 1. Basic range iteration
console.log("=== Basic Range ===");
for (let i = 0; i < 5; i++) {
    console.log(i);
}
// 2. StepBy with positive step
console.log("=== StepBy Positive ===");
for (let i = 0; i < 20; i += 5) {
    console.log(i);
}
// 3. StepBy with negative step
console.log("=== StepBy Negative ===");
for (let i = 100; i > 0; i += -10) {
    console.log(i);
}
// 4. Haxe types
console.log("=== Haxe Types ===");
var count = 10;
var pi = 3.14159;
var active = true;
var data = { name: "test" };
console.log(count, pi, active, data);
console.log("=== All P0-1 Tests Complete ===");
