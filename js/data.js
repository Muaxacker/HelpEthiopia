// js/data.js

// Default items for initial load
const defaultItems = [
    {
        id: 1,
        type: "Donation",
        name: "Winter Jacket",
        category: "Clothes",
        location: "Addis Ababa, Bole",
        urgency: "Medium",
        status: "Available",
        image: "images/jacket.jpg",
        description: "Gently used winter jacket, size L. Good for cold nights.",
        datePosted: new Date().toISOString()
    },
    {
        id: 2,
        type: "Request",
        name: "School Textbooks",
        category: "Books",
        location: "Hawassa",
        urgency: "High",
        status: "Active",
        image: "images/extrem book.jpg",
        description: "Math and Science books needed for Grade 9 students.",
        datePosted: new Date().toISOString()
    },
    {
        id: 3,
        type: "Donation",
        name: "Canned Food Pack",
        category: "Food",
        location: "Adama",
        urgency: "Low",
        status: "Available",
        image: "images/icon food donation.jpg",
        description: "10 cans of beans and pasta. Expiry date is next year.",
        datePosted: new Date().toISOString()
    },
    {
        id: 4,
        type: "Request",
        name: "First Aid Kits",
        category: "Hygiene",
        location: "Gondar",
        urgency: "Critical",
        status: "Active",
        image: "images/first-aid-1.jpg",
        description: "Urgent need for basic medical supplies and bandages.",
        datePosted: new Date().toISOString()
    },
    {
        id: 5,
        type: "Donation",
        name: "Laptop for Student",
        category: "Electronics",
        location: "Addis Ababa, Piassa",
        urgency: "Medium",
        status: "Pending",
        image: "images/Toshiba Satellite A210-1AX 0713 Laptop.jpg",
        description: "Old Dell laptop, working fine. Needs a charger.",
        datePosted: new Date().toISOString()
    },
    {
        id: 6,
        type: "Donation",
        name: "Clothing Bundle",
        category: "Clothes",
        location: "Dire Dawa",
        urgency: "Low",
        status: "Available",
        image: "images/Clothing Donation Near Me.jpg",
        description: "Mixed clothing items for all ages, clean and in good condition.",
        datePosted: new Date().toISOString()
    },
    {
        id: 7,
        type: "Request",
        name: "Food Supplies",
        category: "Food",
        location: "Mekelle",
        urgency: "High",
        status: "Active",
        image: "images/giving food.jpg",
        description: "Urgent need for non-perishable food items for community center.",
        datePosted: new Date().toISOString()
    },
    {
        id: 8,
        type: "Donation",
        name: "Electronics Charger",
        category: "Electronics",
        location: "Bahir Dar",
        urgency: "Low",
        status: "Available",
        image: "images/charger.jPG",
        description: "Universal phone charger, compatible with multiple devices.",
        datePosted: new Date().toISOString()
    }
];

// LocalStorage Manager
const StorageManager = {
    // Initialize storage with default data if empty
    init() {
        if (!localStorage.getItem('helpethiopia_items')) {
            this.saveItems(defaultItems);
        }
        if (!localStorage.getItem('helpethiopia_users')) {
            localStorage.setItem('helpethiopia_users', JSON.stringify([]));
        }
    },

    // Get all items
    getItems() {
        const items = localStorage.getItem('helpethiopia_items');
        return items ? JSON.parse(items) : defaultItems;
    },

    // Save items
    saveItems(items) {
        localStorage.setItem('helpethiopia_items', JSON.stringify(items));
    },

    // Add new item
    addItem(item) {
        const items = this.getItems();
        const newItem = {
            ...item,
            id: Date.now(),
            datePosted: new Date().toISOString(),
            status: item.type === 'Donation' ? 'Available' : 'Active'
        };
        items.push(newItem);
        this.saveItems(items);
        return newItem;
    },

    // Get item by ID
    getItemById(id) {
        const items = this.getItems();
        return items.find(item => item.id === parseInt(id));
    },

    // Update item
    updateItem(id, updates) {
        const items = this.getItems();
        const index = items.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            this.saveItems(items);
            return items[index];
        }
        return null;
    },

    // Delete item
    deleteItem(id) {
        const items = this.getItems();
        const filtered = items.filter(item => item.id !== parseInt(id));
        this.saveItems(filtered);
    },

    // User management
    getUsers() {
        const users = localStorage.getItem('helpethiopia_users');
        return users ? JSON.parse(users) : [];
    },

    addUser(user) {
        const users = this.getUsers();
        const newUser = {
            ...user,
            id: Date.now(),
            dateJoined: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('helpethiopia_users', JSON.stringify(users));
        return newUser;
    },

    // Session management
    setCurrentUser(user) {
        sessionStorage.setItem('helpethiopia_currentUser', JSON.stringify(user));
    },

    getCurrentUser() {
        const user = sessionStorage.getItem('helpethiopia_currentUser');
        return user ? JSON.parse(user) : null;
    },

    logout() {
        sessionStorage.removeItem('helpethiopia_currentUser');
    }
};

// Initialize storage on load
StorageManager.init();

// Export for use in other files
const itemsData = StorageManager.getItems();