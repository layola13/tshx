// Test Haxe typedef syntax
// typedef should be transformed to TypeScript's type keyword

// Basic type alias
typedef Point = {
  x: number;
  y: number;
}

// Function type alias
typedef Callback<T> = (data: T) => void;

// Union type alias
typedef Numeric = number | bigint;

// Intersection type alias with extension
typedef Point3D = Point & {
  z: number;
}

// Using the type aliases
const p1: Point = { x: 10, y: 20 };
const p2: Point3D = { x: 1, y: 2, z: 3 };

const callback: Callback<string> = (data) => {
  console.log(data);
};

const num: Numeric = 42;

callback("Hello typedef!");
console.log(p1, p2, num);