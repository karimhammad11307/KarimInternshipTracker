use mongodb::{Collection, bson::{doc, oid::ObjectId}, error::Result};
use futures_util::StreamExt;
use crate::model::Internship;

pub async fn create_internship(
    col: &Collection<Internship>,
    mut new_internship: Internship,
) -> Result<ObjectId> {
    let insert_result = col.insert_one(&new_internship).await?;
    let generated_id = insert_result
        .inserted_id
        .as_object_id()
        .expect("MongoDB should return an ObjectId after insertion");

    new_internship.id = Some(generated_id);
    Ok(generated_id)
}

pub async fn read_internship(
    col: &Collection<Internship>,
    id: ObjectId,
) -> Result<Option<Internship>> {
    let filter = doc! { "_id": id };
    let find_result = col.find_one(filter).await?;
    Ok(find_result)
}

pub async fn read_all_internships(
    col: &Collection<Internship>,
) -> Result<Vec<Internship>> {
    let mut cursor = col.find(doc! {}).await?;
    let mut internships = Vec::new();

    while let Some(result) = cursor.next().await {
        let internship = result?;
        internships.push(internship);
    }

    Ok(internships)
}

pub async fn update_internship_status(
    col: &Collection<Internship>,
    id: ObjectId,
    new_status: &str,
) -> Result<bool> {
    let filter = doc! { "_id": id };
    let update = doc! { "$set": { "status": new_status } };
    let update_result = col.update_one(filter, update).await?;
    Ok(update_result.modified_count > 0)
}

pub async fn delete_internship(
    col: &Collection<Internship>,
    id: ObjectId,
) -> Result<bool> {
    let filter = doc! { "_id": id };
    let delete_result = col.delete_one(filter).await?;
    Ok(delete_result.deleted_count > 0)
}

pub async fn find_internships_with_filter<F>(
    col: &Collection<Internship>,
    filter_predicate: F,
) -> Result<Vec<Internship>>
where
    F: Fn(&Internship) -> bool,
{
    let all_internships = read_all_internships(col).await?;
    let filtered_results: Vec<Internship> = all_internships
        .into_iter()
        .filter(|item| filter_predicate(item))
        .collect();

    Ok(filtered_results)
}
