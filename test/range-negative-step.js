// Test negative step (countdown) with stepBy
// Test 1: Countdown with stepBy(-1)
console.log("Test 1: Countdown with stepBy(-1)");
for (let i = 10; i > 0; i += -1) {
    console.log(i); // Should print: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
}
// Test 2: Countdown with stepBy(-2)
console.log("\nTest 2: Countdown with stepBy(-2)");
for (let i = 10; i > 0; i += -2) {
    console.log(i); // Should print: 10, 8, 6, 4, 2
}
// Test 3: Countdown with stepBy(-5)
console.log("\nTest 3: Countdown with stepBy(-5)");
for (let i = 100; i > 0; i += -5) {
    console.log(i); // Should print: 100, 95, 90, ..., 5
}
// Test 4: Negative literal number
console.log("\nTest 4: Using -3 directly");
for (let i = 20; i > 5; i += -3) {
    console.log(i); // Should print: 20, 17, 14, 11, 8
}
