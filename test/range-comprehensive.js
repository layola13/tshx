// Comprehensive range tests
// Test 1: Basic exclusive range (0...10)
console.log("Test 1: Basic exclusive range (0...10)");
for (let i = 0; i < 10; i++) {
    console.log(i);
}
// Test 2: Range with variables
console.log("\nTest 2: Range with variables");
const start = 5;
const end = 8;
for (let j = start; j < end; j++) {
    console.log(j);
}
// Test 3: Nested range loops
console.log("\nTest 3: Nested range loops");
for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
        console.log(`(${x}, ${y})`);
    }
}
// Test 4: Range with expressions
console.log("\nTest 4: Range with expressions");
for (let k = (2 + 3); k < (10 - 2); k++) {
    console.log(k);
}
// Test 5: Range in function
console.log("\nTest 5: Range in function");
function printRange(start, end) {
    for (let i = start; i < end; i++) {
        console.log(i);
    }
}
printRange(10, 15);
