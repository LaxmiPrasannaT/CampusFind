const form = document.getElementById("reportForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    /* get inputs */
    const nameInput = document.getElementById("name").value;
    const descriptionInput = document.getElementById("description").value;
    const locationInput = document.getElementById("location").value;
    const typeInput = document.getElementById("type").value;
    const categoryInput = document.getElementById("category").value;

    /* validations */

    if (nameInput.trim().length < 3) {
        alert("Name must be at least 3 characters");
        return;
    }

    if (descriptionInput.trim() === "") {
        alert("Please enter item description");
        return;
    }

    if (locationInput.trim() === "") {
        alert("Please enter location");
        return;
    }

    if (categoryInput === "") {
        alert("Please select a category");
        return;
    }

    const file = document.getElementById("image").files[0];

    if (!file) {
        alert("Please upload an image");
        return;
    }

    /* get logged user */
    const reporter = localStorage.getItem("registeredUser");

    /* check duplicate report (same user only) */
    const { data: existing } = await supabaseClient
        .from("items")
        .select("*")
        .eq("reporter_roll", reporter)
        .eq("name", nameInput.trim())
        .eq("location", locationInput.trim());

    if (existing && existing.length > 0) {
        alert("You already reported this item.");
        return;
    }

    /* get user phone */
    const { data: userData } = await supabaseClient
        .from("users")
        .select("phone")
        .eq("roll_number", reporter)
        .single();

    const contactNumber = userData.phone;

    /* generate return code */
    const returnCode = Math.floor(1000 + Math.random() * 9000);

    /* upload image */
    const fileName = Date.now() + "_" + file.name;

    await supabaseClient.storage
        .from("images")
        .upload(fileName, file);

    const { data } = supabaseClient
        .storage
        .from("images")
        .getPublicUrl(fileName);

    const imageUrl = data.publicUrl;

    /* insert row */
    await supabaseClient.from("items").insert({
        name: nameInput,
        description: descriptionInput,
        location: locationInput,
        contact: contactNumber,
        type: typeInput,
        category: categoryInput,
        status: "Pending",
        return_code: returnCode,
        reporter_roll: reporter,
        image_url: imageUrl,
        created_at: new Date()
    });

    alert("Item reported successfully. Your return verification code is: " + returnCode + ". Please save this code.");

    form.reset();
});

