// Using typedefs
const user = {
    id: 1,
    name: "Alice",
    email: "alice@example.com"
};
const processFn = (input) => input.toUpperCase();
const result = {
    success: true,
    data: 42
};
const currentStatus = "active";
const admin = {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    role: "admin",
    permissions: ["read", "write", "delete"]
};
console.log(user, processFn("hello"), result, currentStatus, admin);
