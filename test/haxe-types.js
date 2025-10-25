// Haxe基本类型测试
var x = 42;
var y = 3.14;
var name = "hello";
var flag = true;
// Haxe Dynamic类型测试
var dynamic = "can be anything";
dynamic = 123;
dynamic = true;
// 函数参数类型测试
function add(a, b) {
    return a + b;
}
function divide(a, b) {
    return a / b;
}
function greet(name) {
    return "Hello, " + name;
}
function toggle(flag) {
    return !flag;
}
// 类中的类型使用
class Person {
    name;
    age;
    height;
    isActive;
    constructor(name, age) {
        this.name = name;
        this.age = age;
        this.height = 1.75;
        this.isActive = true;
    }
    getInfo() {
        return this.name + " is " + this.age + " years old";
    }
}
// 数组类型测试
var numbers = [1, 2, 3, 4, 5];
var floats = [1.1, 2.2, 3.3];
var names = ["Alice", "Bob", "Charlie"];
var flags = [true, false, true];
console.log("Haxe types test completed");
