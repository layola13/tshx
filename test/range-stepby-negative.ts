// @ts-nocheck
// Test negative stepBy transformation
for (let i in (100...0).stepBy(-10)) {
    console.log(i);
}