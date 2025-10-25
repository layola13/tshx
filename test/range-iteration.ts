// 测试范围迭代语法 (Range-based For Loop)
// Test case for for...in range iteration syntax

// 基础范围迭代测试
console.log("Test 1: Basic range iteration (0...10)");
for (i in 0...10) {
  console.log(i); // 应该输出 0 到 9
}

// 包含上界的迭代测试
console.log("\nTest 2: Inclusive range iteration (0...=10)");
for (i in 0...=10) {
  console.log(i); // 应该输出 0 到 10
}

// 负数范围测试
console.log("\nTest 3: Negative range (5...0)");
for (i in 5...0) {
  console.log(i); // 应该输出 5, 4, 3, 2, 1
}

// 带步长的迭代测试
console.log("\nTest 4: Range with step (0...100 step 5)");
for (i in (0...100).stepBy(5)) {
  console.log(i); // 应该输出 0, 5, 10, ..., 95
}

// 变量范围测试
console.log("\nTest 5: Variable range");
const start = 2;
const end = 7;
for (i in start...end) {
  console.log(i); // 应该输出 2, 3, 4, 5, 6
}

// 在数组中使用
console.log("\nTest 6: Range in array literal");
const numbers = [for (i in 0...5) i * 2];
console.log(numbers); // 应该输出 [0, 2, 4, 6, 8]

// 嵌套循环
console.log("\nTest 7: Nested range loops");
for (i in 0...3) {
  for (j in 0...3) {
    console.log(`(${i}, ${j})`);
  }
}