// Advanced typedef tests

// Basic structure typedef
typedef User = {
  id: number;
  name: string;
  email: string;
}

// Function type typedef
typedef ProcessFn = (input: string) => string;

// Generic typedef
typedef Result<T> = {
  success: boolean;
  data?: T;
  error?: string;
}

// Union type typedef
typedef Status = "pending" | "active" | "completed";

// Intersection typedef
typedef AdminUser = User & {
  role: "admin";
  permissions: string[];
}

// Using typedefs
const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

const processFn: ProcessFn = (input) => input.toUpperCase();

const result: Result<number> = {
  success: true,
  data: 42
};

const currentStatus: Status = "active";

const admin: AdminUser = {
  id: 2,
  name: "Bob",
  email: "bob@example.com",
  role: "admin",
  permissions: ["read", "write", "delete"]
};

console.log(user, processFn("hello"), result, currentStatus, admin);