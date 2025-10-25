// Enhanced enum test - simplified without generics
// Standard TypeScript enums don't support generics, so we use a workaround
// Simple enum for Option type
var OptionTag;
(function (OptionTag) {
    OptionTag[OptionTag["Some"] = 0] = "Some";
    OptionTag[OptionTag["None"] = 1] = "None";
})(OptionTag || (OptionTag = {}));
// Helper functions to create Option instances
function some(value) {
    return { _tag: OptionTag.Some, value };
}
function none() {
    return { _tag: OptionTag.None };
}
// Create instances
const someValue = some(42);
const noneValue = none();
console.log("Some value:", someValue);
console.log("None value:", noneValue);
// Result type
var ResultTag;
(function (ResultTag) {
    ResultTag[ResultTag["Ok"] = 0] = "Ok";
    ResultTag[ResultTag["Err"] = 1] = "Err";
})(ResultTag || (ResultTag = {}));
function ok(value) {
    return { _tag: ResultTag.Ok, value };
}
function err(error) {
    return { _tag: ResultTag.Err, error };
}
const success = ok(100);
const failure = err("Something went wrong");
console.log("Success:", success);
console.log("Failure:", failure);
