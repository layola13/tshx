// ADT-style enum using transformer pattern
// Syntax: enum members become factory methods
var Option;
(function (Option) {
    Option[Option["Some"] = 0] = "Some";
    Option[Option["None"] = 1] = "None";
})(Option || (Option = {}));
// The transformer will generate these factory functions:
// Option.Some = (value) => ({ _tag: 'Some', value })
// Option.None = () => ({ _tag: 'None' })
var Result;
(function (Result) {
    Result[Result["Ok"] = 0] = "Ok";
    Result[Result["Err"] = 1] = "Err";
})(Result || (Result = {}));
// Usage examples that will be transformed
const someValue = Option.Some(42);
const noneValue = Option.None();
console.log("Some:", someValue);
console.log("None:", noneValue);
const success = Result.Ok(100);
const failure = Result.Err("error");
console.log("Success:", success);
console.log("Failure:", failure);
