const adminCode = prompt("Enter Admin Access Code:");

if(adminCode !== "secret785"){
alert("Access denied.");
window.location.href = "index.html";
}
const container = document.getElementById("pendingContainer");

async function loadPendingItems() {

    const { data } = await supabaseClient
        .from("items")
        .select("*")
        .eq("status", "Pending");

    container.innerHTML = "";

    data.forEach(async item => {
        const { data: user } = await supabaseClient
.from("users")
.select("name,roll_number,department")
.eq("roll_number", item.reporter_roll)
.single();
        

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${item.image_url}" alt="item image">

            <h3>${item.name}</h3>

            <p>${item.description}</p>

            <p><b>Location:</b> ${item.location}</p>

            <p><b>Category:</b> ${item.category}</p>
            <p><b>Reported By:</b></p>
<p>Name: ${user.name}</p>
<p>Roll: ${user.roll_number}</p>
<p>Department: ${user.department}</p>

            <button class="approveBtn btn">Approve</button>
            <button class="rejectBtn btn">Reject</button>
        `;

        container.appendChild(card);

        const approveBtn = card.querySelector(".approveBtn");
        const rejectBtn = card.querySelector(".rejectBtn");

        approveBtn.addEventListener("click", async () => {

            await supabaseClient
                .from("items")
                .update({ status: "Approved" })
                .eq("id", item.id);

            loadPendingItems();

        });

        rejectBtn.addEventListener("click", async () => {

            await supabaseClient
                .from("items")
                .update({ status: "Rejected" })
                .eq("id", item.id);

            loadPendingItems();

        });

    });

}

loadPendingItems();