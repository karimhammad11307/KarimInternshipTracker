# 🦀 Learning Rust MongoDB CRUD Operations

Welcome! This folder is a complete, hands-on tutorial designed to help you apply what you've learned about Rust while building a simple MongoDB CRUD (Create, Read, Update, Delete) application. 

The codebase tracks **Internship applications** (fitting the theme of this repository) and includes comprehensive, line-by-line comments for every operation.

---

## 🎯 Why do we need `tokio` and `serde` instead of "Pure Rust"?

If you are coming from languages like Python, Go, or Node.js, you might be used to having JSON parsers, async runtimes, or database clients bundled directly into the standard library. Rust takes a different path:

### 1. The Rust Standard Library is Intentionally Minimal
To keep Rust lightweight, fast, and portable (even to embedded systems or web assembly), Rust's standard library (`std`) only includes bare primitives: system threads, TCP sockets, basic file I/O, and collections (like `Vec` and `HashMap`). It has no knowledge of database drivers, HTTP requests, or serialization. The community uses **crates** (libraries on `crates.io`) to build on top of these primitives.

### 2. Why we need `tokio` (The Async Runtime)
Rust supports the `async` and `await` keywords natively, but the compiler only compiles async code into state machines called **Futures**. It does **not** provide an execution engine to schedule these Futures, poll sockets, or distribute work across CPU cores.
* **MongoDB’s official driver is asynchronous** to enable non-blocking network I/O.
* **Tokio** is the industry-standard async engine/runtime for Rust. It runs in the background, spawning a thread pool and managing the network events that resolve our database requests.

### 3. Why we need `serde` (The Serialization Framework)
MongoDB stores database records in a binary format called **BSON** (Binary JSON).
* Inside your Rust program, you want to use strongly typed Rust structs (like `struct Internship`).
* To save it to the database, you must serialize the struct into BSON bytes.
* To read it back, you must deserialize BSON bytes back into your struct.
* **Serde** (Serializer/Deserializer) uses compiler macros (`#[derive(Serialize, Deserialize)]`) to auto-generate high-performance binary conversion code at compile time. Doing this in "pure Rust" would require you to write hundreds of lines of tedious, error-prone byte-parsing code manually.

---

## 💡 Key Rust Concepts Explained

Here is a summary of the concepts you will see explained in the code comments:

### 1. Ownership & Borrowing (`&` and `&mut`)
Rust uses a compile-time ownership system to manage memory without a garbage collector:
* **Ownership**: Every value has a single owner (a variable). When the owner goes out of scope, the memory is freed.
* **Borrowing (`&T`)**: Instead of transferring ownership, you can "borrow" a value. 
  * In `read_internship(&col, id)`, we borrow the collection `&col` so we can search it without consuming it. The caller keeps ownership and can use `col` again.
* **Mutable Borrowing (`&mut T` or `mut var`)**: Allows modifying the borrowed value. You can only have one active mutable borrow at a time to prevent data races.

### 2. Lifetimes
A **lifetime** is a parameter named with an apostrophe (e.g., `'a`) that tells the compiler how long a reference is valid:
* Rust enforces that no reference can outlive the data it points to (preventing dangling pointers).
* In simple functions like `pub async fn read_internship(col: &Collection, ...)`, you don't see lifetimes because the compiler applies **lifetime elision rules**—it automatically infers that the references are valid for the duration of the function call.

### 3. The `Option` and `Result` Enums
Rust does not have `null` or exceptions. Instead, it uses type-safe enums:
* **`Option<T>`**: Represents a value that might be absent. It has two variants:
  * `Some(value)`: The value is present.
  * `None`: No value exists.
  * *Example:* The `salary` field is `Option<u32>` because some internships are unpaid or don't disclose salaries.
* **`Result<T, E>`**: Represents an operation that can fail. It has two variants:
  * `Ok(value)`: The operation succeeded.
  * `Err(error)`: The operation failed.
  * *Example:* All MongoDB requests return `Result` because connection failures or query issues can happen at runtime.
* **The `?` Operator**: Written after a `Result` (e.g. `col.insert_one(...).await?`). If the result is `Ok`, it extracts the inner value. If it is `Err`, it returns early from the function and passes the error up to the caller.

### 4. Closures
A **closure** is an anonymous function that can capture variables from its environment.
* Syntax: `|param1, param2| { body }`
* In `main.rs`, we filter internships using:
  ```rust
  let interviewing = find_internships_with_filter(&col, |internship| {
      internship.status == "Interviewing"
  }).await?;
  ```
  Here, the closure `|internship| internship.status == "Interviewing"` is passed as an argument. The function calls this closure on every item to check if it matches the filter.

---

## 🛠️ Step-by-Step Project Setup

Here is how this tutorial was created:
1. **Initialize cargo package**:
   ```bash
   cargo init rust-mongodb-crud --bin
   ```
2. **Add dependencies in `Cargo.toml`**: We added `mongodb`, `tokio`, `serde`, and `futures-util`.
3. **Define data model (`src/model.rs`)**: Mapped Rust structs to MongoDB document schemas.
4. **Implement CRUD operations (`src/crud.rs`)**: Wrote helper functions for Create, Read, Update, Delete, and Closure filtration.
5. **Execute CRUD loop (`src/main.rs`)**: Wired the client connection and sequentially tested all functions.

---

## 🚀 How to Run the Code

### Step 1: Start MongoDB locally
The easiest way to run MongoDB is using Docker. Run the following command in your terminal:
```bash
docker run -d --name mongodb-local -p 27017:27017 mongo:latest
```
This downloads the official MongoDB image, runs it as a background container (`-d`), and maps port `27017` of the container to your host machine.

*(Alternatively, if you use a local service or a cloud cluster on MongoDB Atlas, you can configure the connection string via the `MONGODB_URI` environment variable).*

### Step 2: Run the Rust application
Navigate into the project folder and run Cargo:
```bash
cd rust-mongodb-crud
cargo run
```
You will see output showing:
1. Connecting to the database.
2. Creating a Google internship document and printing its auto-generated `ObjectId`.
3. Fetching the document back from MongoDB.
4. Updating its status to "Interviewing".
5. Creating a Meta internship and listing all documents.
6. Filtering documents in memory using a custom closure.
7. Deleting the documents and verifying the database is clean.
