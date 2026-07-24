const container = document.getElementById("myItemsContainer");

async function loadMyReports() {

const reporter = localStorage.getItem("registeredUser");

if(!reporter){
alert("Please register/login first.");
window.location.href = "register.html";
return;
}

const { data, error } = await supabaseClient
.from("items")
.select("*")
.eq("reporter_roll", reporter)
.order("id", { ascending:false });

if(error){
console.error(error);
return;
}

container.innerHTML = "";

if(data.length === 0){
container.innerHTML = "<p>No reports found.</p>";
return;
}

data.forEach(item => {

const card = document.createElement("div");
card.className = "card";

card.innerHTML = ` <img src="${item.image_url}" alt="item image">

<h3>${item.name}</h3>

<p>${item.description}</p>

<p><b>Location:</b> ${item.location}</p>

<p><b>Category:</b> ${item.category}</p>

<p><b>Status:</b> ${item.status}</p>
`;

container.appendChild(card);

});

}

loadMyReports();
