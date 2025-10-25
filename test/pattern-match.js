// Pattern Matching - Using helper function approach
// Syntax: match(value, { pattern1: handler1, pattern2: handler2 })
// Match helper function
function match(value, patterns) {
    for (const pattern in patterns) {
        if (pattern === '_')
            continue;
        // Try to match the pattern
        const handler = patterns[pattern];
        const result = handler(value);
        if (result !== undefined) {
            return result;
        }
    }
    // Default case
    return patterns._();
}
function Some(value) {
    return { _tag: 'Some', value };
}
function None() {
    return { _tag: 'None' };
}
// Pattern matching with ADT
function matchMaybe(maybe, cases) {
    switch (maybe._tag) {
        case 'Some':
            return cases.Some(maybe.value);
        case 'None':
            return cases.None();
    }
}
// Test cases
const someValue = Some(42);
const noneValue = None();
const result1 = matchMaybe(someValue, {
    Some: (v) => `Got value: ${v}`,
    None: () => 'No value'
});
const result2 = matchMaybe(noneValue, {
    Some: (v) => `Got value: ${v}`,
    None: () => 'No value'
});
console.log('Match Some:', result1);
console.log('Match None:', result2);
// Number matching
function matchNumber(n) {
    if (n === 0)
        return 'Zero';
    if (n > 0)
        return 'Positive';
    return 'Negative';
}
console.log('Match 0:', matchNumber(0));
console.log('Match 5:', matchNumber(5));
console.log('Match -3:', matchNumber(-3));
function matchPoint(p) {
    if (p.x === 0 && p.y === 0)
        return 'Origin';
    if (p.x === p.y)
        return 'Diagonal';
    if (p.y === 0)
        return `X-axis at ${p.x}`;
    if (p.x === 0)
        return `Y-axis at ${p.y}`;
    return 'Other';
}
console.log('Match origin:', matchPoint({ x: 0, y: 0 }));
console.log('Match diagonal:', matchPoint({ x: 5, y: 5 }));
console.log('Match x-axis:', matchPoint({ x: 10, y: 0 }));
console.log('Match y-axis:', matchPoint({ x: 0, y: 10 }));
console.log('Match other:', matchPoint({ x: 3, y: 7 }));
