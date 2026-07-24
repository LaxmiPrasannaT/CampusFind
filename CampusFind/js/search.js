const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", async () => {

const term = searchInput.value.toLowerCase();

const { data } = await supabaseClient
    .from("items")
    .select("*");

container.innerHTML = "";

data
.filter(item => item.name.toLowerCase().includes(term))
.forEach(item => {

const card = document.createElement("div");
card.className = "card";

card.innerHTML = `
<img src="${item.image_url}">
<h3>${item.name}</h3>
`;

container.appendChild(card);

});
});
