// Standard TypeScript test - should work normally
const greeting: string = "Hello, TypeScript!";
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
function add(a: number, b: number): number {
    return a + b;
}
console.log(`Sum: ${add(3, 4)}`);

// Class
class Person {
    constructor(public name: string, public age: number) {}
    
    greet(): string {
        return `Hello, I'm ${this.name}, ${this.age} years old`;
    }
}

const person = new Person("Alice", 30);
console.log(person.greet());