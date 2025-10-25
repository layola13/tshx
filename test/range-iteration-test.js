// Test 1: Basic exclusive range (0...10)
for (let i in 0..)
    .10;
{
    console.log(i); // Should print 0 to 9
}
// Test 2: Basic inclusive range (0...=10)
for (let i in 0... = 10) {
    console.log(i); // Should print 0 to 10
}
// Test 3: Range with variables
const start = 5;
const end = 15;
for (let i in start ... end) {
    console.log(i); // Should print 5 to 14
}
// Test 4: Inclusive range with variables
for (let i in start  end) {
    console.log(i); // Should print 5 to 15
}
// Test 5: Negative range
for (let i in -5..)
    .5;
{
    console.log(i); // Should print -5 to 4
}
// Test 6: Single element range
for (let i in 0..)
    .1;
{
    console.log(i); // Should print 0
}
// Test 7: Empty range (start >= end for exclusive)
for (let i in 5..)
    .5;
{
    console.log(i); // Should not print anything
}
// Test 8: Inclusive single element
for (let i in 5... = 5) {
    console.log(i); // Should print 5
}
