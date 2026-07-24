const container = document.getElementById("itemsContainer");
const categoryFilter = document.getElementById("categoryFilter");

async function loadItems() {

let query = supabaseClient
.from("items")
.select("*")
.in("status", ["Approved","Returned"]);

const selectedCategory = categoryFilter.value;

if(selectedCategory !== "All"){
query = query.eq("category", selectedCategory);
}

const { data } = await query
.order("status",{ascending:true})
.order("id",{ascending:false});
    


    container.innerHTML = "";

    data.forEach(item => {

        const card = document.createElement("div");
        card.className = "card";

        // Format date & time
        const date = item.created_at
            ? new Date(item.created_at).toLocaleString()
            : "";

        // Type badge color
        const typeClass = item.type === "Lost" ? "badge-lost" : "badge-found";

        // Status badge color
        const statusClass = item.status === "Returned"
            ? "badge-returned"
            : "badge-active";

        // Masked contact (always hidden initially)
        const maskedContact = item.contact
            ? "**********"
            : "Not available";

        card.innerHTML = `
            <img src="${item.image_url}" alt="item image">

            <h3>${item.name}</h3>
<p>${item.description}</p>
<p><b>Location:</b> ${item.location}</p>
<p><b>Category:</b> ${item.category || "Other"}</p>

            <!-- Contact (Always Hidden First - Even Returned Items) -->
            <p>
                <b>Contact:</b> 
                <span class="contact-text">${maskedContact}</span>
            </p>

            <button class="viewContactBtn btn-secondary">
                View Contact
            </button>

            <!-- Type Badge -->
            <p>
                <b>Type:</b> 
                <span class="badge ${typeClass}">
                    ${item.type}
                </span>
            </p>

            <!-- Status Badge -->
            <p>
                <b>Status:</b> 
                <span class="badge ${statusClass}">
                    ${item.status}
                </span>
            </p>

            <p class="date">${date}</p>

            ${
                item.status === "Returned"
                ? `<button class="btn disabled-btn">Returned</button>`
                : `<button class="btn markBtn" data-id="${item.id}">
                        Mark as Returned
                   </button>`
            }
        `;

        container.appendChild(card);

        /* 🔒 CONTACT PRIVACY (CONFIRM + AUTO HIDE AFTER 10s) */
        const viewBtn = card.querySelector(".viewContactBtn");
        const contactText = card.querySelector(".contact-text");

        let hideTimer = null;

        if (viewBtn) {
            viewBtn.addEventListener("click", () => {

                const confirmView = confirm(
                    "Are you sure this item belongs to you? Contact will be shown for 10 seconds."
                );

                if (!confirmView) return;

                // Show real contact
                contactText.innerText = item.contact || "Not available";
                viewBtn.innerText = "Contact Visible (10s)";
                viewBtn.disabled = true;

                // Clear previous timer (important)
                if (hideTimer) {
                    clearTimeout(hideTimer);
                }

                // Auto hide after 10 seconds
                hideTimer = setTimeout(() => {
                    contactText.innerText = maskedContact;
                    viewBtn.innerText = "View Contact";
                    viewBtn.disabled = false;
                }, 10000);
            });
        }

        /* 🔁 MARK AS RETURNED LOGIC */
        const markBtn = card.querySelector(".markBtn");

        if (markBtn) {
            markBtn.addEventListener("click", async () => {

    const enteredCode = prompt("Enter return verification code:");

    if (enteredCode == item.return_code) {

        await supabaseClient
            .from("items")
            .update({ status: "Returned" })
            .eq("id", item.id);

        alert("Item marked as returned successfully.");

        loadItems();

    } else {

        alert("Invalid verification code. Return denied.");

    }

});

            
        }

    });
}

loadItems();
categoryFilter.addEventListener("change", loadItems);
