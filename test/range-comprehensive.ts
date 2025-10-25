// Comprehensive range tests

// Test 1: Basic exclusive range (0...10)
console.log("Test 1: Basic exclusive range (0...10)");
for (let i in 0...10) {
    console.log(i);
}

// Test 2: Range with variables
console.log("\nTest 2: Range with variables");
const start = 5;
const end = 8;
for (let j in start...end) {
    console.log(j);
}

// Test 3: Nested range loops
console.log("\nTest 3: Nested range loops");
for (let x in 0...3) {
    for (let y in 0...3) {
        console.log(`(${x}, ${y})`);
    }
}

// Test 4: Range with expressions
console.log("\nTest 4: Range with expressions");
for (let k in (2 + 3)...(10 - 2)) {
    console.log(k);
}

// Test 5: Range in function
console.log("\nTest 5: Range in function");
function printRange(start: number, end: number) {
    for (let i in start...end) {
        console.log(i);
    }
}
printRange(10, 15);