
// ---------- Book Collection ----------

const books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 299,
        category: "Fiction",
        isbn: "9780061122415"
    },
    {
        id: 2,
        title: "Harry Potter",
        author: "J.K. Rowling",
        price: 449,
        category: "Fiction",
        isbn: "9780590353427"
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        price: 249,
        category: "Fiction",
        isbn: "9780451524935"
    },
    {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        price: 279,
        category: "Fiction",
        isbn: "9780141439518"
    },
    {
        id: 5,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        price: 399,
        category: "Fiction",
        isbn: "9780547928227"
    },
    {
        id: 6,
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 599,
        category: "Technology",
        isbn: "9780132350884"
    },
    {
        id: 7,
        title: "The Lean Startup",
        author: "Eric Ries",
        price: 499,
        category: "Business",
        isbn: "9780307887894"
    },
    {
        id: 8,
        title: "Rich Dad Poor Dad",
        author: "Robert T. Kiyosaki",
        price: 349,
        category: "Business",
        isbn: "9781612680194"
    },
    {
        id: 9,
        title: "Atomic Habits",
        author: "James Clear",
        price: 399,
        category: "Self-Help",
        isbn: "9780735211292"
    },
    {
        id: 10,
        title: "Deep Work",
        author: "Cal Newport",
        price: 329,
        category: "Self-Help",
        isbn: "9781455586691"
    },
    {
        id: 11,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        price: 299,
        category: "Business",
        isbn: "9780857197689"
    },
    {
        id: 12,
        title: "Ikigai",
        author: "Hector Garcia",
        price: 279,
        category: "Self-Help",
        isbn: "9780143130727"
    },
    {
        id: 13,
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        price: 379,
        category: "Science",
        isbn: "9780553380163"
    },
    {
        id: 14,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        price: 499,
        category: "Science",
        isbn: "9780062316097"
    },
    {
        id: 15,
        title: "Think Like a Monk",
        author: "Jay Shetty",
        price: 349,
        category: "Self-Help",
        isbn: "9781982134488"
    }
];


// ---------- DOM Elements ----------

const booksGrid = document.getElementById("books-grid");
const searchInput = document.getElementById("search-input");
const categoryFilters = document.getElementById("category-filters");
const bookCount = document.getElementById("book-count");

const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");

const summaryItems = document.getElementById("summary-items");
const subtotalElement = document.getElementById("subtotal");
const deliveryElement = document.getElementById("delivery");
const totalElement = document.getElementById("total");

const checkoutBtn = document.getElementById("checkout-btn");


// ---------- Cart Data ----------

let cart = [];

try {
    const savedCart = JSON.parse(localStorage.getItem("bookNestCart"));

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(item =>
            books.some(book => book.id === item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            item.quantity <= 99
        );
    }
} catch (error) {
    cart = [];
}

let selectedCategory = "All";


// ---------- Display Books ----------

function displayBooks(bookList) {
    booksGrid.innerHTML = "";

    bookCount.textContent =
        `Showing ${bookList.length} ${bookList.length === 1 ? "book" : "books"}`;

    if (bookList.length === 0) {
        booksGrid.innerHTML = `
            <div class="no-books">
                <h3>No books found 📚</h3>
                <p>Try another search or category.</p>
            </div>
        `;
        return;
    }

    bookList.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.className = "book-card";

        bookCard.innerHTML = `
            <div class="book-cover">
                <img
                    src="https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg"
                    alt="${book.title} book cover"
                    onerror="this.onerror=null; this.src='https://placehold.co/200x280/e9dfd1/6f4e37?text=Book+Cover';"
                >
            </div>

            <div class="book-info">
                <span class="book-category">${book.category}</span>

                <h3>${book.title}</h3>

                <p class="book-author">By ${book.author}</p>

                <div class="book-bottom">
                    <span class="book-price">₹${book.price}</span>

                    <button class="add-btn" data-id="${book.id}">
                        + Add to Cart
                    </button>
                </div>
            </div>
        `;

        booksGrid.appendChild(bookCard);
    });
}


// ---------- Search and Category Filter ----------

function filterBooks() {
    const searchText = searchInput.value.toLowerCase().trim();

    const filteredBooks = books.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchText) ||
            book.author.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            book.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayBooks(filteredBooks);
}


// Search Event

searchInput.addEventListener("input", filterBooks);


// Category Filter Event

categoryFilters.addEventListener("click", function(event) {
    const button = event.target.closest(".filter-btn");

    if (!button) return;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    selectedCategory = button.dataset.category;

    filterBooks();
});


// ---------- Add to Cart ----------

booksGrid.addEventListener("click", function(event) {
    const button = event.target.closest(".add-btn");

    if (!button) return;

    const bookId = Number(button.dataset.id);

    addToCart(bookId);
});

function addToCart(bookId) {
    const existingItem = cart.find(item => item.id === bookId);

    if (existingItem) {
        if (existingItem.quantity >= 99) {
            alert("Maximum quantity reached.");
            return;
        }

        existingItem.quantity++;
    } else {
        cart.push({
            id: bookId,
            quantity: 1
        });
    }

    updateCart();
}


// ---------- Change Quantity ----------

function changeQuantity(bookId, change) {
    const item = cart.find(item => item.id === bookId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(bookId);
        return;
    }

    if (item.quantity > 99) {
        item.quantity = 99;
    }

    updateCart();
}


// ---------- Remove from Cart ----------

function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);

    updateCart();
}


// ---------- Cart Event Handling ----------

cartItems.addEventListener("click", function(event) {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const bookId = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "increase") {
        changeQuantity(bookId, 1);
    }

    if (action === "decrease") {
        changeQuantity(bookId, -1);
    }

    if (action === "remove") {
        removeFromCart(bookId);
    }
});


// ---------- Display Cart ----------

function displayCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div>📚</div>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any books yet.</p>
                <a href="#books">Explore Books</a>
            </div>
        `;
        return;
    }

    cart.forEach(item => {
        const book = books.find(book => book.id === item.id);

        if (!book) return;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img
                src="https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg"
                alt="${book.title}"
                onerror="this.onerror=null; this.src='https://placehold.co/200x280/e9dfd1/6f4e37?text=Book';"
            >

            <div class="cart-item-details">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
                <div class="cart-item-price">
                    ₹${book.price * item.quantity}
                </div>
            </div>

            <div class="quantity-controls">
                <button data-action="decrease" data-id="${book.id}">−</button>
                <span>${item.quantity}</span>
                <button data-action="increase" data-id="${book.id}">+</button>
            </div>

            <button
                class="remove-btn"
                data-action="remove"
                data-id="${book.id}">
                Remove
            </button>
        `;

        cartItems.appendChild(cartItem);
    });
}


// ---------- Calculate Total ----------

function updateCart() {
    displayCart();

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const subtotal = cart.reduce((sum, item) => {
        const book = books.find(book => book.id === item.id);

        return sum + (book ? book.price * item.quantity : 0);
    }, 0);

    const delivery = cart.length > 0 ? 40 : 0;
    const total = subtotal + delivery;

    cartCount.textContent = totalQuantity;
    summaryItems.textContent = totalQuantity;

    subtotalElement.textContent = `₹${subtotal}`;
    deliveryElement.textContent = `₹${delivery}`;
    totalElement.textContent = `₹${total}`;

    checkoutBtn.disabled = cart.length === 0;

    // Save cart in Local Storage
    localStorage.setItem("bookNestCart", JSON.stringify(cart));
}


// ---------- Checkout ----------

checkoutBtn.addEventListener("click", function() {
    if (cart.length === 0) return;

    const confirmed = confirm(
        `Your order total is ${totalElement.textContent}.\n\nProceed with this demo order?`
    );

    if (confirmed) {
        alert("Thank you for shopping at BookNest! 📚\nYour demo order has been placed.");

        cart = [];
        updateCart();

        window.location.href = "#books";
    }
});


// ---------- Footer Year ----------

document.getElementById("year").textContent =
    new Date().getFullYear();


// ---------- Initial Load ----------

displayBooks(books);
updateCart();
