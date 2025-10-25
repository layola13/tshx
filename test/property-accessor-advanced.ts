// Advanced property accessor test - various accessor modes
class Person {
  private _name: string = "";
  private _age: number = 0;
  private _id: number = 0;

  // Read-write property (get, set)
  public var name(get, set): string;

  // Read-only property (get, never)
  public var age(get, never): number;

  // Write-only property (never, set) - unusual but valid
  public var id(never, set): number;

  get_name(): string {
    console.log("Getting name");
    return this._name;
  }

  set_name(value: string): string {
    console.log("Setting name to:", value);
    return this._name = value;
  }

  get_age(): number {
    return this._age;
  }

  set_id(value: number): number {
    console.log("Setting id to:", value);
    return this._id = value;
  }

  // Regular method (should not be affected)
  greet(): void {
    console.log(`Hello, I'm ${this._name}, age ${this._age}`);
  }

  // Method starting with get_ but not used as accessor (should be kept)
  get_info(): string {
    return `${this._name} (${this._age})`;
  }
}

// Test usage
const person = new Person();
person.name = "Alice";
console.log(person.name); // Should call getter
console.log(person.age);  // Should work (read-only)
person.id = 12345;        // Should work (write-only)
// console.log(person.id); // Would be a compile error (write-only)
person.greet();
console.log(person.get_info());