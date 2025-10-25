// Test stepBy functionality for range iteration

// Test 1: Basic stepBy with step of 2
console.log("Test 1: stepBy(2)");
for (let i in (0...10).stepBy(2)) {
    console.log(i); // Should print: 0, 2, 4, 6, 8
}

// Test 2: stepBy with step of 5
console.log("\nTest 2: stepBy(5)");
for (let i in (0...100).stepBy(5)) {
    console.log(i); // Should print: 0, 5, 10, 15, ..., 95
}

// Test 3: stepBy with step of 10
console.log("\nTest 3: stepBy(10)");
for (let i in (10...50).stepBy(10)) {
    console.log(i); // Should print: 10, 20, 30, 40
}

// Test 4: stepBy with variable step
console.log("\nTest 4: stepBy with variable");
const step = 3;
for (let i in (0...20).stepBy(step)) {
    console.log(i); // Should print: 0, 3, 6, 9, 12, 15, 18
}

// Test 5: Regular range without stepBy (should still work)
console.log("\nTest 5: Regular range without stepBy");
for (let i in 0...5) {
    console.log(i); // Should print: 0, 1, 2, 3, 4
}