async function markFound(id) {

await supabaseClient
    .from("items")
    .update({ status: "Returned" })
    .eq("id", item.id);


loadItems();
}
