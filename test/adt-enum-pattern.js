// ADT Enum Pattern - Using helper functions
// Helper function to create ADT enum variants
function createADT(tag) {
    return (value) => ({ _tag: tag, value });
}
// Maybe ADT (avoiding Option name conflict with DOM)
var MaybeTag;
(function (MaybeTag) {
    MaybeTag["Some"] = "Some";
    MaybeTag["None"] = "None";
})(MaybeTag || (MaybeTag = {}));
const Maybe = {
    Some: createADT(MaybeTag.Some),
    None: () => ({ _tag: MaybeTag.None })
};
// Usage
const someValue = Maybe.Some(42);
const noneValue = Maybe.None();
console.log("Some:", someValue);
console.log("None:", noneValue);
// Result ADT
var ResultTag;
(function (ResultTag) {
    ResultTag["Ok"] = "Ok";
    ResultTag["Err"] = "Err";
})(ResultTag || (ResultTag = {}));
const Result = {
    Ok: createADT(ResultTag.Ok),
    Err: createADT(ResultTag.Err)
};
const success = Result.Ok(100);
const failure = Result.Err("Something went wrong");
console.log("Success:", success);
console.log("Failure:", failure);
// Pattern matching helper
function matchMaybe(maybe, cases) {
    if (maybe._tag === MaybeTag.Some) {
        return cases.Some(maybe.value);
    }
    else {
        return cases.None();
    }
}
// Example: using pattern matching
const result = matchMaybe(someValue, {
    Some: (v) => `Got value: ${v}`,
    None: () => "No value"
});
console.log("Match result:", result);
