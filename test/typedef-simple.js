// Using the type aliases
const p1 = { x: 10, y: 20 };
const p2 = { x: 1, y: 2, z: 3 };
const callback = (data) => {
    console.log(data);
};
const num = 42;
callback("Hello typedef!");
console.log(p1, p2, num);
