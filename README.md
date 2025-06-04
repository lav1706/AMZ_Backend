# 🛒 E-Commerce App AMZ (Backend)

An end-to-end e-commerce backend with full feature support for cart, wishlist, address management, order placement, and user handling.

---

## 📦 Features

### 🛍️ Cart Management
- Add to cart
- Remove from cart
- Update quantity
- Clear entire cart

### ❤️ Wishlist
- Add to wishlist
- Remove from wishlist
- Move item from wishlist to cart

### 📬 Address Management
- Add multiple addresses
- Edit address
- Delete address
- Select delivery address during checkout

### 📦 Order History
- Place order with selected address
- View order history per user
- Clear cart on successful order

### 👤 User Management
- Fetch user by ID
- Store user orders
- Maintain addresses per user

---

## ⚙️ Tech Stack

| Layer   | Technology            |
|---------|------------------------|
| Backend | Node.js, Express       |
| DB      | MongoDB with Mongoose |

---

## 📂 Folder Structure

backend/
│
├── db/
│   └── db.connect.js        # MongoDB connection setup
│
├── models/
│   ├── product.model.js     # Product schema & model
│   ├── user.model.js        # User schema & model (including cart, wishlist, address, orders)
│
└── index.js                 # Main Express server file with routes 


---

## 🔗 API Overview

| Endpoint                            | Method               | Description                              |
|-------------------------------------|----------------------|------------------------------------------|
| `/product`                          | GET                  | Get all products                         |
| `/product`                          | POST                 | Add a new product                        |
| `/product/:id`                      | GET                  | Get product by ID                        |
| `/product/:id`                      | DELETE               | Delete product by ID                     |   
| `/product/:productId`               | PUT                  | Update product by ID                     |
| `/product/category/:category`       | GET                  | Get products by category                 |
|`/cart/:userId`	                    | GET	                 | Get all cart items for a user            |
|`/cart/:userId/:productId`	          | POST                 | Add a product to the user’s cart         |
|`/cart/:userId/:cartItemId`	        | DELETE               | Remove a product from the user’s cart    |
|`/cart/increase/:userId/:cartItemId`	| POST	               | Increment quantity of a product in cart  |
|`/cart/decrease/:userId/:cartItemId`	| POST	               | Decrement quantity of a product in cart  |
|`/wishlist/:userId`	                | GET	                 | Get all wishlist items for a user        |
|`/wishlist/:userId/:productId`	      | POST	               | Add a product to the user’s wishlist     |
|`/wishlist/:userId/:productId`	      | DELETE	             | Remove a product from the user’s wishlist|
| `/user`                             | POST                 | Create a new user                        |
| `/user/:id`                         | POST                 | Edit/update user by ID                   |
| `/user/:id`                         | GET                  | Get user details by ID                   |
| `/user/:id`                         | DELETE               | Delete user by ID                        |
| `/add/:userId`                      | POST                 | Add a new address for a user             |
| `/add/:userId`                      | GET                  | Get all addresses of a user              |
| `/add/:userId`                      | PUT                  | Edit/update an address for a user        |
| `/add/:userId/:addressId`           | DELETE               | Delete an address from a user by address ID|
| `/order/:userId`                    | POST                 | Place an order for the user (using user's current cart) |
| `/order/:userId`                    | GET                  | Get all orders of the user               |

---

## 🧪 Local Setup

```bash
# Clone the repo
git clone https://github.com/lav1706/AMZ_Backend.git

# Install dependencies
npm install

# Run server
npm run dev
