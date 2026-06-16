mod crud;
mod model;

use mongodb::Client;
use crate::model::Internship;

#[tokio::main]
async fn main() -> std::result::Result<(), Box<dyn std::error::Error>> {
    let mongo_uri =
        std::env::var("MONGODB_URI").unwrap_or_else(|_| "mongodb://localhost:27017".to_string());

    println!("Connecting to MongoDB at: {}", mongo_uri);

    let client = Client::with_uri_str(&mongo_uri).await?;
    let db = client.database("internship_db");
    let col = db.collection::<Internship>("internships");

    println!("\n--- [STARTING CRUD CYCLE] ---");

    // STEP 1: CREATE OPERATION
    let new_internship = Internship {
        id: None,
        company: "Google".to_string(),
        role: "Software Engineering Intern".to_string(),
        status: "Applied".to_string(),
        salary: Some(8500),
    };

    println!("\n[1] Creating Internship...");
    let inserted_id = crud::create_internship(&col, new_internship).await?;
    println!(
        "Successfully created internship! Generated ID: {}",
        inserted_id
    );

    // STEP 2: READ OPERATION (Single Document)
    println!("\n[2] Reading Internship by ID: {}...", inserted_id);
    let fetched = crud::read_internship(&col, inserted_id).await?;

    match fetched {
        Some(internship) => println!("Fetched details: {:?}", internship),
        None => println!("No internship found with ID: {}", inserted_id),
    }

    // STEP 3: UPDATE OPERATION
    println!("\n[3] Updating Internship Status to 'Interviewing'...");
    let updated = crud::update_internship_status(&col, inserted_id, "Interviewing").await?;
    println!("Update successful? {}", updated);

    if let Some(updated_doc) = crud::read_internship(&col, inserted_id).await? {
        println!("Verified updated doc: {:?}", updated_doc);
    }

    let second_internship = Internship {
        id: None,
        company: "Meta".to_string(),
        role: "Frontend Engineer Intern".to_string(),
        status: "Accepted".to_string(),
        salary: Some(9000),
    };
    let second_id = crud::create_internship(&col, second_internship).await?;
    println!("\nCreated second internship for Meta. ID: {}", second_id);

    // STEP 4: READ OPERATION (List All Documents)
    println!("\n[4] Listing All Internships in Database...");
    let all = crud::read_all_internships(&col).await?;
    for (index, internship) in all.iter().enumerate() {
        println!("{}. {:?}", index + 1, internship);
    }

    // STEP 5: CLOSURE-BASED FILTRATION
    println!("\n[5] Filtering Internships in memory using a Closure...");
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

    // STEP 6: DELETE OPERATION
    println!("\n[6] Deleting Created Internships...");

    let deleted_second = crud::delete_internship(&col, second_id).await?;
    println!("Deleted Meta internship? {}", deleted_second);

    let remaining = crud::read_all_internships(&col).await?;
    println!("Remaining internships in database: {}", remaining.len());

    println!("\n--- [CRUD CYCLE COMPLETED SUCCESSFULY] ---");

    Ok(())
}
