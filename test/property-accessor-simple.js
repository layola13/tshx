// Simple property accessor test - Haxe style getter/setter
class Rectangle {
    _width = 0;
    _height = 0;
    get width() {
        return this._width;
    }
    set width(value) {
        return this._width = Math.max(0, value);
    }
    get height() {
        return this._height;
    }
    set height(value) {
        return this._height = Math.max(0, value);
    }
    get area() {
        return this._width * this._height;
    }
}
// Test usage
const rect = new Rectangle();
rect.width = 10;
rect.height = 5;
console.log(rect.area); // Should output: 50
