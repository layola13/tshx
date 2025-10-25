// P0 Features Integration Test
// Tests all three core P0 features working together
console.log("=== P0 Integration Test ===\n");
// P0-1: Range Iteration
console.log("P0-1: Range Iteration");
for (let i = 0; i < 5; i++) {
    console.log(`  Range: ${i}`);
}
// P0-2: ADT Enums
console.log("\nP0-2: ADT Enums");
const Maybe = {
    Some: (value) => ({ _tag: 'Some', value }),
    None: () => ({ _tag: 'None' })
};
const Result = {
    Ok: (value) => ({ _tag: 'Ok', value }),
    Err: (error) => ({ _tag: 'Err', error })
};
const someValue = Maybe.Some(42);
const noneValue = Maybe.None();
const okValue = Result.Ok(100);
const errValue = Result.Err("error");
console.log("  Maybe.Some:", someValue);
console.log("  Maybe.None:", noneValue);
console.log("  Result.Ok:", okValue);
console.log("  Result.Err:", errValue);
// P0-3: Pattern Matching
console.log("\nP0-3: Pattern Matching");
function matchMaybe(maybe, cases) {
    switch (maybe._tag) {
        case 'Some': return cases.Some(maybe.value);
        case 'None': return cases.None();
    }
}
function matchResult(result, cases) {
    switch (result._tag) {
        case 'Ok': return cases.Ok(result.value);
        case 'Err': return cases.Err(result.error);
    }
}
const maybeResult1 = matchMaybe(someValue, {
    Some: (v) => `Got: ${v}`,
    None: () => 'Nothing'
});
const maybeResult2 = matchMaybe(noneValue, {
    Some: (v) => `Got: ${v}`,
    None: () => 'Nothing'
});
const resultResult1 = matchResult(okValue, {
    Ok: (v) => `Success: ${v}`,
    Err: (e) => `Error: ${e}`
});
const resultResult2 = matchResult(errValue, {
    Ok: (v) => `Success: ${v}`,
    Err: (e) => `Error: ${e}`
});
console.log("  Match Some:", maybeResult1);
console.log("  Match None:", maybeResult2);
console.log("  Match Ok:", resultResult1);
console.log("  Match Err:", resultResult2);
// Combined: Use range iteration with ADT and pattern matching
console.log("\nCombined Features:");
// Create a list of results using range iteration
const results = [];
for (let i = 0; i < 5; i++) {
    const num = Number(i);
    if (num % 2 === 0) {
        results.push(Result.Ok(num * 10));
    }
    else {
        results.push(Result.Err(`Error at ${num}`));
    }
}
// Pattern match on each result
results.forEach((result, index) => {
    const message = matchResult(result, {
        Ok: (v) => `  [${index}] Success: ${v}`,
        Err: (e) => `  [${index}] Failed: ${e}`
    });
    console.log(message);
});
console.log("\n=== All P0 Tests Passed ===");
