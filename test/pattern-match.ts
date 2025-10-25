// Pattern Matching - Using helper function approach
// Syntax: match(value, { pattern1: handler1, pattern2: handler2 })

// Match helper function
function match<T, R>(
  value: T,
  patterns: { [key: string]: (val: T) => R } & { _: () => R }
): R {
  for (const pattern in patterns) {
    if (pattern === '_') continue;
    
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

// ADT types for testing
type Maybe<T> = { _tag: 'Some'; value: T } | { _tag: 'None' };

function Some<T>(value: T): Maybe<T> {
  return { _tag: 'Some', value };
}

function None<T>(): Maybe<T> {
  return { _tag: 'None' };
}

// Pattern matching with ADT
function matchMaybe<T, R>(
  maybe: Maybe<T>,
  cases: {
    Some: (value: T) => R;
    None: () => R;
  }
): R {
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
function matchNumber(n: number): string {
  if (n === 0) return 'Zero';
  if (n > 0) return 'Positive';
  return 'Negative';
}

console.log('Match 0:', matchNumber(0));
console.log('Match 5:', matchNumber(5));
console.log('Match -3:', matchNumber(-3));

// Object destructuring match
type Point = { x: number; y: number };

function matchPoint(p: Point): string {
  if (p.x === 0 && p.y === 0) return 'Origin';
  if (p.x === p.y) return 'Diagonal';
  if (p.y === 0) return `X-axis at ${p.x}`;
  if (p.x === 0) return `Y-axis at ${p.y}`;
  return 'Other';
}

console.log('Match origin:', matchPoint({ x: 0, y: 0 }));
console.log('Match diagonal:', matchPoint({ x: 5, y: 5 }));
console.log('Match x-axis:', matchPoint({ x: 10, y: 0 }));
console.log('Match y-axis:', matchPoint({ x: 0, y: 10 }));
console.log('Match other:', matchPoint({ x: 3, y: 7 }));