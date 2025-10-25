// ADT Enum Pattern - Using helper functions

// Helper function to create ADT enum variants
function createADT<T extends string>(tag: T): <V>(value?: V) => { _tag: T; value?: V } {
  return (value) => ({ _tag: tag, value });
}

// Maybe ADT (avoiding Option name conflict with DOM)
enum MaybeTag {
  Some = "Some",
  None = "None"
}

const Maybe = {
  Some: createADT(MaybeTag.Some),
  None: () => ({ _tag: MaybeTag.None as const })
};

// Usage
const someValue = Maybe.Some(42);
const noneValue = Maybe.None();

console.log("Some:", someValue);
console.log("None:", noneValue);

// Result ADT
enum ResultTag {
  Ok = "Ok",
  Err = "Err"
}

const Result = {
  Ok: createADT(ResultTag.Ok),
  Err: createADT(ResultTag.Err)
};

const success = Result.Ok(100);
const failure = Result.Err("Something went wrong");

console.log("Success:", success);
console.log("Failure:", failure);

// Pattern matching helper
function matchMaybe<T, R>(
  maybe: ReturnType<typeof Maybe.Some<T>> | ReturnType<typeof Maybe.None>,
  cases: {
    Some: (value: T) => R;
    None: () => R;
  }
): R {
  if (maybe._tag === MaybeTag.Some) {
    return cases.Some(maybe.value!);
  } else {
    return cases.None();
  }
}

// Example: using pattern matching
const result = matchMaybe(someValue, {
  Some: (v) => `Got value: ${v}`,
  None: () => "No value"
});

console.log("Match result:", result);