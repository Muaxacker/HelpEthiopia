// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Select DOM Elements
    const container = document.getElementById("postedItemsContainer");
    const searchInput = document.getElementById("searchItem");
    const categoryFilter = document.getElementById("categoryFilter");
    const typeFilter = document.getElementById("typeFilter");

    // 2. Function to Render Items
    function renderItems(items) {
        // Clear current items
        container.innerHTML = "";

        if (items.length === 0) {
            container.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>No items found.</p>";
            return;
        }

        items.forEach(item => {
            // Determine badge color based on type
            const badgeClass = item.type === "Donation" ? "badge-donation" : "badge-request";
            
            // Create HTML String
            const cardHTML = `
                <div class="item-card" data-category="${item.category}">
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                    <div class="item-content">
                        <span class="badge ${badgeClass}">${item.type}</span>
                        ${item.urgency === 'Critical' || item.urgency === 'High' ? '<span class="badge badge-urgent">Urgent</span>' : ''}
                        
                        <span class="item-category">${item.category}</span>
                        <h3 class="item-title">${item.name}</h3>
                        
                        <p class="item-info"><strong>📍 Location:</strong> ${item.location}</p>
                        <p class="item-info"><strong>📄 Details:</strong> ${item.description}</p>
                        
                        <a href="item-detail.html?id=${item.id}" class="btn btn-primary" style="width: 100%; margin-top: 10px; display: block; text-decoration: none;">View Details</a>
                    </div>
                </div>
            `;
            
            // Append to container
            container.innerHTML += cardHTML;
        });
    }

    // 3. Function to Filter Items
    function filterItems() {
        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedType = typeFilter.value;

        // Filter the current data from localStorage
        const currentItems = StorageManager.getItems();
        const filtered = currentItems.filter(item => {
            // Check Name (Search)
            const matchesSearch = item.name.toLowerCase().includes(searchText) || 
                                  item.description.toLowerCase().includes(searchText);
            
            // Check Category
            const matchesCategory = selectedCategory === "" || item.category === selectedCategory;

            // Check Type (Donation vs Request)
            const matchesType = selectedType === "" || item.type === selectedType;

            return matchesSearch && matchesCategory && matchesType;
        });

        renderItems(filtered);
    }

    // 4. Event Listeners (Live filtering)
    if(searchInput) searchInput.addEventListener("input", filterItems);
    if(categoryFilter) categoryFilter.addEventListener("change", filterItems);
    if(typeFilter) typeFilter.addEventListener("change", filterItems);

    // 5. Initial Render
    if(container) {
        // Load fresh data from localStorage
        const currentItems = StorageManager.getItems();
        renderItems(currentItems);
    }
});