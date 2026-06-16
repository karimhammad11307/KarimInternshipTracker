// We declare model and crud as modules so the Rust compiler knows they exist and includes them in compilation.
mod crud;
mod model;

// We import Client from the mongodb crate to establish connections.
use mongodb::Client;

// We import the Internship struct from our model module.
use crate::model::Internship;

// The #[tokio::main] attribute is a procedural macro.
// In Rust, the standard runtime doesn't support async/await out of the box in the traditional main function.
// This macro transforms `async fn main()` into a synchronous `fn main()` that instantiates the Tokio async runtime executor
// and block-runs our asynchronous code on it.
#[tokio::main]
async fn main() -> std::result::Result<(), Box<dyn std::error::Error>> {
    // 1. Determine the MongoDB connection string.
    //    - std::env::var("MONGODB_URI") attempts to read the environment variable MONGODB_URI.
    //    - .unwrap_or_else(|_| ...) is a closure-based method on Result:
    //      If the environment variable is not set (returns an Err), it executes the closure and returns our default value.
    //      Here, we default to the local MongoDB connection string: "mongodb://localhost:27017".
    let mongo_uri =
        std::env::var("MONGODB_URI").unwrap_or_else(|_| "mongodb://localhost:27017".to_string());

    println!("Connecting to MongoDB at: {}", mongo_uri);

    // 2. Establish the connection to the MongoDB cluster.
    //    - Client::with_uri_str parses the URI and returns a client instance.
    //    - We use .await because establishing a socket connection is an asynchronous network operation.
    //    - The `?` operator propagates any connection error to the main function caller.
    let client = Client::with_uri_str(&mongo_uri).await?;

    // 3. Select the database.
    //    - client.database("internship_db") returns a database handle. If the database "internship_db" does not exist,
    //      MongoDB will automatically create it when we first write data.
    let db = client.database("internship_db");

    // 4. Select the collection and map it to our Internship struct type.
    //    - db.collection::<Internship>("internships") returns a Collection handle typed to only accept and return `Internship` structs.
    //      This provides type safety; we cannot accidentally insert a different struct type into this collection handle.
    let col = db.collection::<Internship>("internships");

    println!("\n--- [STARTING CRUD CYCLE] ---");

    // =========================================================================
    // STEP 1: CREATE OPERATION
    // =========================================================================
    // We instantiate a new Internship struct.
    // - id: is set to None since MongoDB will generate it.
    // - .to_string() converts string literals (&str) into owned Strings.
    let new_internship = Internship {
        id: None,
        company: "Google".to_string(),
        role: "Software Engineering Intern".to_string(),
        status: "Applied".to_string(),
        salary: Some(8500),
    };

    println!("\n[1] Creating Internship...");
    // We pass a reference to the collection (&col) and the owned new_internship struct.
    // This moves ownership of the new_internship into the create_internship function.
    let inserted_id = crud::create_internship(&col, new_internship).await?;
    println!(
        "Successfully created internship! Generated ID: {}",
        inserted_id
    );

    // =========================================================================
    // STEP 2: READ OPERATION (Single Document)
    // =========================================================================
    println!("\n[2] Reading Internship by ID: {}...", inserted_id);
    // We pass the inserted_id to search for the record we just inserted.
    let fetched = crud::read_internship(&col, inserted_id).await?;

    // We use a match statement to handle the Option returned by read_internship:
    // - match is Rust's powerful pattern-matching construct. It forces us to handle both the Some and None cases.
    match fetched {
        Some(internship) => println!("Fetched details: {:?}", internship),
        None => println!("No internship found with ID: {}", inserted_id),
    }

    // =========================================================================
    // STEP 3: UPDATE OPERATION
    // =========================================================================
    println!("\n[3] Updating Internship Status to 'Interviewing'...");
    // We pass the ID and a string slice literal representing the new status.
    let updated = crud::update_internship_status(&col, inserted_id, "Interviewing").await?;
    println!("Update successful? {}", updated);

    // Let's verify by fetching the updated record.
    if let Some(updated_doc) = crud::read_internship(&col, inserted_id).await? {
        println!("Verified updated doc: {:?}", updated_doc);
    }

    // Add a second internship to demonstrate reading lists and filtering.
    let second_internship = Internship {
        id: None,
        company: "Meta".to_string(),
        role: "Frontend Engineer Intern".to_string(),
        status: "Accepted".to_string(),
        salary: Some(9000),
    };
    let second_id = crud::create_internship(&col, second_internship).await?;
    println!("\nCreated second internship for Meta. ID: {}", second_id);

    // =========================================================================
    // STEP 4: READ OPERATION (List All Documents)
    // =========================================================================
    println!("\n[4] Listing All Internships in Database...");
    let all = crud::read_all_internships(&col).await?;
    // We iterate over the vector.
    // - &all borrows the vector as read-only.
    // - internship is a reference to each element inside the vector.
    for (index, internship) in all.iter().enumerate() {
        println!("{}. {:?}", index + 1, internship);
    }

    // =========================================================================
    // STEP 5: CLOSURE-BASED FILTRATION
    // =========================================================================
    println!("\n[5] Filtering Internships in memory using a Closure...");
    // We filter for internships where the status is "Interviewing".
    //
    // Let's break down the closure:
    // `|internship| internship.status == "Interviewing"`
    // - `|internship|` is the input parameter (the closure captures a reference to each Internship).
    // - `internship.status == "Interviewing"` is the evaluation logic which returns true/false.
    //
    // The compiler automatically infers types and generates code to call this predicate.
    let interviewing =
        crud::find_internships_with_filter(&col, |internship| internship.status == "Interviewing")
            .await?;

    println!(
        "Found {} internship(s) with 'Interviewing' status:",
        interviewing.len()
    );
    for item in interviewing {
        println!(" - {} for the role {}", item.company, item.role);
    }

    // Let's demonstrate another closure filter for internships with a salary > 8800.
    // - internship.salary.unwrap_or(0) returns the salary value, or 0 if it is None.
    let high_paying = crud::find_internships_with_filter(&col, |internship| {
        internship.salary.unwrap_or(0) > 8800
    })
    .await?;

    println!(
        "\nFound {} high paying (> $8800) internship(s):",
        high_paying.len()
    );
    for item in high_paying {
        println!(" - {} offering {:?}", item.company, item.salary);
    }

    // =========================================================================
    // STEP 6: DELETE OPERATION
    // =========================================================================
    println!("\n[6] Deleting Created Internships...");

    // Delete the first internship.
    // let deleted_first = crud::delete_internship(&col, inserted_id).await?;
    // println!("Deleted Google internship? {}", deleted_first);

    // Delete the second internship.
    let deleted_second = crud::delete_internship(&col, second_id).await?;
    println!("Deleted Meta internship? {}", deleted_second);

    // Verify database is back to original state.
    let remaining = crud::read_all_internships(&col).await?;
    println!("Remaining internships in database: {}", remaining.len());

    println!("\n--- [CRUD CYCLE COMPLETED SUCCESSFULY] ---");

    // We return Ok(()) to indicate main executed successfully without error.
    Ok(())
}
