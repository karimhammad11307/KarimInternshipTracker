// We import ObjectId from the mongodb::bson module.
// ObjectId is the unique 12-byte identifier type that MongoDB uses for document primary keys (_id).
use mongodb::bson::oid::ObjectId;

// We import Serialize and Deserialize traits from serde.
// - Serialize allows converting a Rust struct into other formats (like BSON or JSON).
// - Deserialize allows converting formats (like BSON or JSON) back into a Rust struct.
use serde::{Serialize, Deserialize};

// The #[derive(...)] attribute is a macro that automatically generates implementations for the specified traits.
// Here we generate:
// - Serialize: To enable saving this struct into MongoDB (translating struct fields to BSON elements).
// - Deserialize: To enable reading this struct from MongoDB (translating BSON elements to struct fields).
// - Debug: To allow printing the struct to the terminal using the {:?} formatter.
// - Clone: To allow making deep copies of the struct's data.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Internship {
    // MongoDB documents always have a primary key field named "_id".
    // Since Rust structs usually use camelCase or snake_case names like "id", we use the #[serde(rename = "_id")] attribute.
    // This tells Serde to read/write this field as "_id" when converting to/from MongoDB.
    // 
    // We wrap ObjectId in Option<ObjectId>:
    // - Option<T> is a Rust enum representing a value that may or may not exist. It has two variants: Some(T) or None.
    // - We use Option because when creating a new Internship in memory, it doesn't have a database-assigned ID yet (it's None).
    //   Once inserted, MongoDB generates the ID, and when we read it back, it is populated (Some(ObjectId)).
    //
    // The skip_serializing_if = "Option::is_none" tells Serde not to send the "_id" key to MongoDB if its value is None.
    // This allows MongoDB to automatically generate a fresh unique ID for us during insertion.
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,

    // The name of the company offering the internship (e.g., "Google").
    // String is a growable, UTF-8 encoded, heap-allocated string type in Rust.
    pub company: String,

    // The job title (e.g., "Software Engineering Intern").
    pub role: String,

    // The current status of the application (e.g., "Applied", "Interviewing", "Accepted").
    pub status: String,

    // The salary per month, which is optional (since some internships are unpaid or undisclosed).
    // u32 is an unsigned 32-bit integer. We wrap it in Option because it can be empty (None).
    pub salary: Option<u32>,
}