// Haxe基本类型测试
var x: Int = 42;
var y: Float = 3.14;
var name: String = "hello";
var flag: Bool = true;

// Haxe Dynamic类型测试
var dynamic: Dynamic = "can be anything";
dynamic = 123;
dynamic = true;

// 函数参数类型测试
function add(a: Int, b: Int): Int {
    return a + b;
}

function divide(a: Float, b: Float): Float {
    return a / b;
}

function greet(name: String): String {
    return "Hello, " + name;
}

function toggle(flag: Bool): Bool {
    return !flag;
}

// 类中的类型使用
class Person {
    name: String;
    age: Int;
    height: Float;
    isActive: Bool;
    
    constructor(name: String, age: Int) {
        this.name = name;
        this.age = age;
        this.height = 1.75;
        this.isActive = true;
    }
    
    getInfo(): String {
        return this.name + " is " + this.age + " years old";
    }
}

// 数组类型测试
var numbers: Array<Int> = [1, 2, 3, 4, 5];
var floats: Array<Float> = [1.1, 2.2, 3.3];
var names: Array<String> = ["Alice", "Bob", "Charlie"];
var flags: Array<Bool> = [true, false, true];

console.log("Haxe types test completed");