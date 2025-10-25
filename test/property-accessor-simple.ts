// Simple property accessor test - Haxe style getter/setter
class Rectangle {
  private _width: number = 0;
  private _height: number = 0;

  // Haxe style property with getter and setter
  public var width(get, set): number;
  public var height(get, set): number;
  public var area(get, never): number;

  get_width(): number {
    return this._width;
  }

  set_width(value: number): number {
    return this._width = Math.max(0, value);
  }

  get_height(): number {
    return this._height;
  }

  set_height(value: number): number {
    return this._height = Math.max(0, value);
  }

  get_area(): number {
    return this._width * this._height;
  }
}

// Test usage
const rect = new Rectangle();
rect.width = 10;
rect.height = 5;
console.log(rect.area); // Should output: 50