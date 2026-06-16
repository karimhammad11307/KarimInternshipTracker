// We import standard types from the MongoDB driver:
// - Collection: Represents the MongoDB collection typed with our Internship struct.
// - doc!: A macro to create BSON Documents using JSON-like syntax.
// - ObjectId: The MongoDB unique ID type.
// - Result: The mongodb::error::Result type, which is a shortcut for std::result::Result<T, mongodb::error::Error>.
use mongodb::{Collection, bson::{doc, oid::ObjectId}, error::Result};

// We import StreamExt from futures_util to work with async streams (useful when reading multiple rows from a cursor).
use futures_util::StreamExt;

// We import the Internship struct that we defined in model.rs.
use crate::model::Internship;

/// =========================================================================
/// 1. CREATE OPERATION
/// =========================================================================
/// This function inserts a new internship document into the database.
///
/// --- Rust Concepts Explained ---
/// * `async fn`: An asynchronous function that returns a Future. It does not block the thread while waiting for the database.
/// * `&Collection<Internship>`: We pass the collection as a shared borrow (reference).
///   - Ownership concept: If we didn't use `&`, the caller would "give away" ownership of the collection, and they couldn't use it again.
///   - Lifetime concept: The reference lives only for the duration of the function call (lifetime elision rules automatically make this safe).
/// * `mut new_internship: Internship`: We take ownership of the Internship struct by value.
///   - The `mut` keyword allows us to modify the struct inside this function (e.g., updating its `id` field).
/// * `Result<ObjectId>`: Returns the generated ObjectId on success, or a database error on failure.
pub async fn create_internship(
    col: &Collection<Internship>,
    mut new_internship: Internship,
) -> Result<ObjectId> {
    // 1. We execute the insert_one operation on our collection.
    //    - The `col` variable is borrowed, so we access it using the dot `.` operator.
    //    - The `&new_internship` passes a read-only reference of the struct so `insert_one` can read its fields without destroying it.
    //    - The `.await` pauses execution of this async function until the database finishes inserting, returning control to the Tokio executor.
    //    - The `?` operator is Rust's shorthand for: "If this returned an Error, return the error immediately from this function; otherwise, extract the success value."
    let insert_result = col.insert_one(&new_internship).await?;

    // 2. We extract the generated ID from the insert result.
    //    - `inserted_id` is a BSON value type. We convert it to an ObjectId by calling `.as_object_id()`.
    //    - `.as_object_id()` returns an `Option<ObjectId>` (Some if it matches ObjectId, None if it doesn't).
    //    - `.expect(...)` is called on the Option. If it is Some, it unwraps and returns the ObjectId. If it is None, it panics with our message.
    let generated_id = insert_result
        .inserted_id
        .as_object_id()
        .expect("MongoDB should return an ObjectId after insertion");

    // 3. We update our local struct's ID field so the caller gets a fully populated struct back.
    //    - We assign `Some(generated_id)` to `new_internship.id`.
    new_internship.id = Some(generated_id);

    // 4. We return the generated ID wrapped in `Ok(...)` to indicate success.
    Ok(generated_id)
}

/// =========================================================================
/// 2. READ OPERATION (Single Document)
/// =========================================================================
/// This function retrieves a single internship by its unique ObjectId.
///
/// --- Rust Concepts Explained ---
/// * `id: ObjectId`: We pass the ObjectId by value. Because ObjectId is a small struct implementing the `Copy` trait,
///   it is copied rather than moved, so the caller doesn't lose ownership of it.
/// * `Result<Option<Internship>>`:
///   - The outer `Result` handles database connection/query failures.
///   - The inner `Option` handles whether the document was found in the database.
///     If found: `Ok(Some(internship))`
///     If not found: `Ok(None)`
pub async fn read_internship(
    col: &Collection<Internship>,
    id: ObjectId,
) -> Result<Option<Internship>> {
    // 1. We construct a query filter using MongoDB's `doc!` macro.
    //    - `_id: id` tells MongoDB to search for a document where the _id matches our target ID.
    let filter = doc! { "_id": id };

    // 2. We perform the database search.
    //    - `find_one` queries the collection with the filter.
    //    - We pass `None` for options (default options).
    //    - We `.await` the network request and propagate errors with `?`.
    let find_result = col.find_one(filter).await?;

    // 3. We return the result. Since find_one naturally returns a `Result<Option<T>>`, we just return `Ok(find_result)`.
    Ok(find_result)
}

/// =========================================================================
/// 3. READ OPERATION (List All Documents)
/// =========================================================================
/// This function queries and returns all internships in the database.
///
/// --- Rust Concepts Explained ---
/// * Streams: MongoDB's `find` returns a `Cursor`, which behaves like an asynchronous iterator (a Stream).
/// * Mutability: We declare `let mut cursor` because fetching the next item modifies the state of the cursor stream.
pub async fn read_all_internships(
    col: &Collection<Internship>,
) -> Result<Vec<Internship>> {
    // 1. We query all documents by passing `None` as the filter (matches everything).
    //    - `.await?` waits for the cursor to be created and handles errors.
    let mut cursor = col.find(doc! {}).await?;

    // 2. We initialize an empty vector to store our results.
    //    - `Vec` is Rust's heap-allocated growable array type.
    //    - It must be declared with `mut` because we will push items into it.
    let mut internships = Vec::new();

    // 3. We iterate over the asynchronous stream of database documents.
    //    - `while let Some(result) = cursor.next().await` is a loop that runs as long as the stream yields `Some`.
    //    - `.next().await` fetches the next document from the stream asynchronously.
    //    - `result` is a `Result<Internship>`, because fetching individual documents from the network can fail mid-stream.
    while let Some(result) = cursor.next().await {
        // - `let internship = result?;` extracts the Internship struct, propagating any error.
        let internship = result?;
        // - We push the successfully deserialized internship into our vector.
        internships.push(internship);
    }

    // 4. We return the vector wrapped in `Ok`.
    Ok(internships)
}

/// =========================================================================
/// 4. UPDATE OPERATION
/// =========================================================================
/// This function updates the status of a specific internship.
///
/// --- Rust Concepts Explained ---
/// * String Slices (`&str`): We accept the new status as a string slice reference `&str` instead of an owned `String`.
///   - This is more memory-efficient because it references the existing characters directly without allocating new heap memory.
///   - It allows passing string literals (like `"Interviewing"`) directly.
/// * Lifetimes: In `new_status: &str`, the lifetime of the string slice is bound to the function call.
///   Since we don't store it in a struct that outlives the function, Rust's lifetime elision is sufficient.
pub async fn update_internship_status(
    col: &Collection<Internship>,
    id: ObjectId,
    new_status: &str,
) -> Result<bool> {
    // 1. Define which document we want to update.
    let filter = doc! { "_id": id };

    // 2. Define what changes we want to make.
    //    - We use the MongoDB `$set` operator.
    //    - `new_status` is passed directly. The `doc!` macro automatically converts the `&str` to a BSON string.
    let update = doc! { "$set": { "status": new_status } };

    // 3. Execute the update operation.
    //    - `update_one` matches the document and updates it.
    //    - `.await?` waits for completion and propagates errors.
    let update_result = col.update_one(filter, update).await?;

    // 4. Check if a document was actually modified.
    //    - `modified_count` tells us how many documents were changed.
    //    - We return `Ok(true)` if modified_count is greater than 0, otherwise `Ok(false)`.
    Ok(update_result.modified_count > 0)
}

/// =========================================================================
/// 5. DELETE OPERATION
/// =========================================================================
/// This function deletes a single internship document by its ID.
pub async fn delete_internship(
    col: &Collection<Internship>,
    id: ObjectId,
) -> Result<bool> {
    // 1. Define the query filter for the target document.
    let filter = doc! { "_id": id };

    // 2. Execute the delete operation.
    //    - `delete_one` deletes the first matching document.
    //    - `.await?` handles asynchronously waiting and propagating errors.
    let delete_result = col.delete_one(filter).await?;

    // 3. Return whether a document was deleted.
    //    - `deleted_count` will be 1 if deleted, 0 if no matching document existed.
    Ok(delete_result.deleted_count > 0)
}

/// =========================================================================
/// 6. CLOSURE & HIGHER-ORDER FUNCTION EXAMPLE
/// =========================================================================
/// This function retrieves all internships from the database and filters them
/// using a custom closure provided by the user.
///
/// --- Rust Concepts Explained ---
/// * Closures: A closure is an anonymous function (like an arrow function in JavaScript or lambda in Python).
///   It can capture variables from its surrounding scope.
/// * Trait Bounds (`where F: Fn(&Internship) -> bool`):
///   - We declare a generic parameter `F`.
///   - `Fn(&Internship) -> bool` is a trait bound indicating that `F` must be a function/closure
///     that takes a read-only reference to an `Internship` and returns a boolean (`true` or `false`).
pub async fn find_internships_with_filter<F>(
    col: &Collection<Internship>,
    filter_predicate: F,
) -> Result<Vec<Internship>>
where
    F: Fn(&Internship) -> bool,
{
    // 1. We get all internships from the database by calling our own helper function.
    let all_internships = read_all_internships(col).await?;

    // 2. We filter the results in memory using the closure.
    //    - `all_internships.into_iter()` consumes the vector and returns an iterator that owns the elements.
    //    - `.filter(...)` is a standard library method that takes a closure.
    //      Here, we pass a closure `|item| filter_predicate(item)`.
    //      - `|item|` defines the closure's parameter.
    //      - `filter_predicate(item)` invokes the user's closure.
    //    - `.collect()` gathers the filtered elements back into a new `Vec<Internship>`.
    let filtered_results: Vec<Internship> = all_internships
        .into_iter()
        .filter(|item| filter_predicate(item))
        .collect();

    // 3. We return the filtered vector.
    Ok(filtered_results)
}
