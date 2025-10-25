// Advanced property accessor test - various accessor modes
class Person {
    _name = "";
    _age = 0;
    _id = 0;
    get name() {
        console.log("Getting name");
        return this._name;
    }
    set name(value) {
        console.log("Setting name to:", value);
        return this._name = value;
    }
    get age() {
        return this._age;
    }
    set id(value) {
        console.log("Setting id to:", value);
        return this._id = value;
    }
    // Regular method (should not be affected)
    greet() {
        console.log(`Hello, I'm ${this._name}, age ${this._age}`);
    }
    // Method starting with get_ but not used as accessor (should be kept)
    get_info() {
        return `${this._name} (${this._age})`;
    }
}
// Test usage
const person = new Person();
person.name = "Alice";
console.log(person.name); // Should call getter
console.log(person.age); // Should work (read-only)
person.id = 12345; // Should work (write-only)
// console.log(person.id); // Would be a compile error (write-only)
person.greet();
console.log(person.get_info());
