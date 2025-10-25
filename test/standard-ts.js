// Standard TypeScript test - should work normally
const greeting = "Hello, TypeScript!";
console.log(greeting);
// Standard for loop (not using range syntax)
for (let i = 0; i < 5; i++) {
    console.log(`Standard loop: ${i}`);
}
// For...of loop
const arr = [1, 2, 3];
for (const item of arr) {
    console.log(`For...of: ${item}`);
}
// Function with types
function add(a, b) {
    return a + b;
}
console.log(`Sum: ${add(3, 4)}`);
// Class
class Person {
    name;
    age;
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    greet() {
        return `Hello, I'm ${this.name}, ${this.age} years old`;
    }
}
const person = new Person("Alice", 30);
console.log(person.greet());
