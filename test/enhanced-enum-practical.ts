// @ts-nocheck
// Practical Enhanced Enum - using class pattern for ADT enums

// Pattern 1: Using class with static methods (no transformer needed)
class MyResult {
  static Success(value: number) {
    return { _tag: 'Success' as const, value };
  }
  
  static Failure(error: string) {
    return { _tag: 'Failure' as const, error };
  }
}

class MyOption {
  static Some(value: any) {
    return { _tag: 'Some' as const, value };
  }
  
  static None() {
    return { _tag: 'None' as const };
  }
}

// Usage
const result1 = MyResult.Success(42);
const result2 = MyResult.Failure("error occurred");

const opt1 = MyOption.Some("hello");
const opt2 = MyOption.None();

console.log("Result Success:", result1);
console.log("Result Failure:", result2);
console.log("Option Some:", opt1);
console.log("Option None:", opt2);

// Pattern matching simulation
function handleResult(result: ReturnType<typeof MyResult.Success> | ReturnType<typeof MyResult.Failure>) {
  if (result._tag === 'Success') {
    console.log("Got success value:", result.value);
  } else if (result._tag === 'Failure') {
    console.log("Got failure error:", result.error);
  }
}

handleResult(result1);
handleResult(result2);