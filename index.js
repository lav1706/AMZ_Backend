const express = require("express");
require("dotenv").config();
const app = express();
const User = require("./models/user.model");
const cors = require("cors");
const { initializeConnection } = require("./db/db.connect");
const Product = require("./models/product.models");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

initializeConnection();
const port = process.env.PORT || 3000;

//Add Product
const addProduct = async (productInfo) => {
  try {
    const nameToCheck = productInfo.name.toLowerCase();
    const products = await Product.find();
    const check = products.find(
      (product) => product.name.toLowerCase() === nameToCheck
    );

    if (check) {
      console.log("Product already exists");
      return null;
    }

    const newProduct = new Product(productInfo);
    const saved = await newProduct.save();

    if (saved) {
      console.log("Product added");
      return saved;
    } else {
      console.log("Product not added");
      return null;
    }
  } catch (error) {
    console.log("Error in Adding Data", error);
    return null;
  }
};

app.post("/product", async (req, res) => {
  try {
    const data = await addProduct(req.body);

    if (data) {
      res.status(201).json(data);
    } else {
      res.status(404).json({ message: "Product Already Exist" });
    }
  } catch (error) {
    console.error("Error in Adding Product", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//show Product
const showProduct = async () => {
  try {
    const data = await Product.find();
    if (data) {
      console.log("Product are found");
    } else {
      console.log("Product not found");
    }
    return data;
  } catch (error) {
    console.log("Error in founding Product");
  }
};
app.get("/product", async (req, res) => {
  try {
    const data = await showProduct(req.body);
    if (data) {
      res.status(201).json(data);
    } else {
      res.status(404).json({ message: "Product Data not found" });
    }
  } catch (error) {
    console.error("Error in Showing Product", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//findById
const findById = async (id) => {
  try {
    const data = await Product.findById(id);
    if (data) {
      console.log("Product found By Id");
    } else {
      console.log("Product not found By Id");
    }
    return data;
  } catch (error) {
    console.log("Error in founding Product");
  }
};
app.get("/product/:id", async (req, res) => {
  try {
    const data = await findById(req.params.id);
    if (data) {
      res.status(200).json({ message: "Product Data found by ID", data });
    } else {
      res.status(404).json({ message: "Product Data not found" });
    }
  } catch (error) {
    console.error("Error in finding by Id Product", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//findByCategory
const findByCategory = async (category) => {
  try {
    const data = await Product.find({ category: category });

    if (data && data.length) {
      console.log("Product find by Category");
    } else {
      console.log("Product not find by Category");
    }
    return data;
  } catch (error) {
    console.error("Product not found");
    throw error;
  }
};
app.get("/product/category/:category", async (req, res) => {
  try {
    const data = await findByCategory(req.params.category);
    if (data && data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Product Data not found" });
    }
  } catch (error) {
    console.error("Error in finding by Category Product", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//edit Product
const editProduct = async (productId, productInfo) => {
  try {
    const data = await Product.findByIdAndUpdate(
      productId,
      { $set: productInfo },
      { new: true }
    );
    if (data) {
      console.log("Product is Updated");
    } else {
      console.log("Product not updated");
    }
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

app.put("/product/:productId", async (req, res) => {
  try {
    const updatedProduct = await editProduct(req.params.productId, req.body);
    if (updatedProduct) {
      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } else {
      res.status(404).json({ message: "Product not found or update failed" });
    }
  } catch (error) {
    console.error("Error in Editing Product", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Delete Product
const deleteProduct = async (id) => {
  try {
    const data = await Product.findByIdAndDelete(id);
    if (data) {
      console.log("Product is deleted ");
    } else {
      console.log("Product is not deleted");
    }
    return data;
  } catch (error) {
    console.error("Error in deleting Product", error);
  }
};
app.delete("/product/:id", async (req, res) => {
  try {
    const data = await deleteProduct(req.params.id);
    if (data) {
      res.status(201).json(data);
    } else {
      res.status(404).json({ message: "Product Data not found" });
    }
  } catch (error) {
    console.error("Error in Deleting Product", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//User Api
const createUser = async (userInfo) => {
  try {
    const check = await User.findOne({ email: userInfo.email });
    if (check) {
      console.log("User Already Created his Account");
      return null;
    } else {
      const data = new User(userInfo);
      const saved = await data.save();
      if (saved) {
        console.log("User Created");
      } else {
        console.log("User not created");
      }
      return saved;
    }
  } catch (error) {
    console.error("Error Occured in Creating User");
  }
};
app.post("/user", async (req, res) => {
  try {
    const data = await createUser(req.body);
    if (data) {
      res.status(200).json({ message: "User is Created", data });
    } else {
      res.status(400).json({ message: "User is not created" });
    }
  } catch (error) {
    console.error("Error in Creating user", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Edit Profile
const editUser = async (id, userInfo) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: userInfo },
      {
        new: true,
      }
    );
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};
app.post("/user/:id", async (req, res) => {
  try {
    const data = await editUser(req.params.id, req.body);
    if (data) {
      res.status(201).json(data);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error in Updating Data", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//find by id
const findUserById = async (id) => {
  try {
    const data = await User.findById(id);
    if (data) {
      console.log("User Found");
    } else {
      console.log("User not found");
    }
    return data;
  } catch (error) {
    console.log("Error in Finding User", error);
  }
};
app.get("/user/:id", async (req, res) => {
  try {
    const data = await findUserById(req.params.id);
    if (data) {
      res.status(200).json({ message: "User is found by Id", data });
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in finding user by Id", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//Delete User
const deleteUser = async (id) => {
  try {
    const deleted = await User.findByIdAndDelete(id);
    if (deleted) {
      console.log("User Deleted");
    } else {
      console.log("User not found");
    }
    return deleted;
  } catch (error) {
    console.error("Error in Deleting User", error);
  }
};

app.delete("/user/:id", async (req, res) => {
  try {
    const data = await deleteUser(req.params.id);
    if (data) {
      res.status(200).json({ message: "User deleted", data });
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error in deleting user", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//Add to WishList
const addToWishlist = async (userId, productId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return null;
    }
    const alreadyExists = user.wishlist.some(
      (item) => item.productId.toString() === productId.toString()
    );
    if (alreadyExists) {
      console.log("Product Already in Wishlist");
      return user.wishlist;
    } else {
      user.wishlist.push({ productId });
      await user.save();

      const updatedUser = await User.findById(userId).populate(
        "wishlist.productId"
      );

      console.log("Product Added to Wishlist");
      return updatedUser.wishlist;
    }
  } catch (error) {
    console.error("Error in Adding to Wishlist", error);
  }
};
app.post("/wishlist/:userId/:productId", async (req, res) => {
  try {
    const data = await addToWishlist(req.params.userId, req.params.productId);
    if (data) {
      res.status(200).json({ message: "Added to wishlist", wishlist: data });
    } else {
      res.status(400).json({ message: "Wishlist update failed" });
    }
  } catch (error) {
    console.log("Error in Adding Wishlist", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Get WishList
const getWishlist = async (userId) => {
  try {
    const user = await User.findById(userId).populate("wishlist.productId");
    if (user && user.wishlist.length > 0) {
      console.log("Wishlist Found");
    } else {
      console.log("Wishlist is empty or user not found");
    }

    return user?.wishlist;
  } catch (error) {
    console.error("Error in Getting Wishlist", error);
  }
};

app.get("/wishlist/:userId", async (req, res) => {
  try {
    const data = await getWishlist(req.params.userId);
    const wishlistArray = Array.isArray(data) ? data : [];
    if (wishlistArray) {
      res
        .status(200)
        .json({ message: "Wishlist is found", wishlist: wishlistArray });
    } else {
      res.status(404).json({ message: "Wishlist not found" });
    }
  } catch (error) {
    console.log("Error in Fetching Wishlist", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//remove wishlist
const deleteWishlistItem = async (userId, productId) => {
  try {
    const updated = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { wishlist: { productId: productId } },
      },
      { new: true }
    ).populate("wishlist.productId");
    if (updated) {
      console.log("Wishlist Item Removed");
    } else {
      console.log("User not found or item not in wishlist");
    }
    return updated?.wishlist;
  } catch (error) {
    console.error("Error in Deleting Wishlist Item", error);
  }
};

app.delete("/wishlist/:userId/:productId", async (req, res) => {
  try {
    const data = await deleteWishlistItem(
      req.params.userId,
      req.params.productId
    );
    if (data) {
      res.status(200).json({ message: "Item removed", wishlist: data });
    } else {
      res.status(404).json({ message: "Item not found in wishlist" });
    }
  } catch (error) {
    console.log("Error in removing wishlist item", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//get cart
const getCart = async (userId) => {
  try {
    const data = await User.findById(userId).populate("cart.productId");
    if (!data) {
      return null;
    } else {
      return data?.cart || [];
    }
  } catch (error) {
    console.error("Error in Getting Cart Item", error);
  }
};
app.get("/cart/:userId", async (req, res) => {
  try {
    const data = await getCart(req.params.userId);
    if (data) {
      res.status(201).json({ message: "Cart Found", data: data });
    } else {
      res.status(400).json({ message: "Cart is Empty" });
    }
  } catch (error) {}
});
const getItemById = async (userId, id) => {
  try {
    const user = await User.findById(userId);
    const IsExist = user?.cart.findIndex((data) => data._id.toString() === id);
    if (user.cart[IsExist].quantity) {
      return user.cart[IsExist];
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error in finding data by id");
  }
};
app.get("/cart/:userId/:id", async (req, res) => {
  try {
    const data = await getItemById(req.params.userId, req.params.id);

    if (data) {
      res.status(201).json({ message: "Data found", data });
    } else {
      res.status(400).json("data not found");
    }
  } catch (error) {
    res.status(404).json({ message: "Internal error" });
  }
});
//delete cart
const deleteCartItem = async (userId, cartItemId) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: { _id: cartItemId } } },
      { new: true }
    ).populate("cart.productId");
    return updatedUser?.cart;
  } catch (error) {
    console.error("Error in Deleting Cart Item", error);
  }
};

app.delete("/cart/:userId/:cartItemId", async (req, res) => {
  try {
    const data = await deleteCartItem(req.params.userId, req.params.cartItemId);
    if (data) {
      res.status(200).json({ message: "Item removed", cart: data });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//Add Quantity to Cart
const addToCart = async (userId, productId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return null;
    }

    const existingProduct = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }
    await user.save();

    const updatedUser = await User.findById(userId).populate("cart.productId");

    return updatedUser?.cart;
  } catch (error) {
    console.error("Error in Adding Product to Cart", error);
  }
};
app.post("/cart/:userId/:productId", async (req, res) => {
  try {
    const data = await addToCart(req.params.userId, req.params.productId);
    if (data) {
      res.status(200).json({ message: "Item added to cart", cart: data });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error in Adding Item to Cart", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//reduce Cart
const reduceCart = async (userId, cartItemId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const item = user.cart.find((entry) => entry._id.toString() === cartItemId);

    if (!item) return null;

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      user.cart = user.cart.filter(
        (entry) => entry._id.toString() !== cartItemId
      );
    }
    await user.save();

    const updatedUser = await User.findById(userId).populate("cart.productId");

    return updatedUser?.cart;
  } catch (error) {
    console.error("Error in Reducing Cart", error);
  }
};

app.patch("/cart/decrease/:userId/:cartItemId", async (req, res) => {
  try {
    const data = await reduceCart(req.params.userId, req.params.cartItemId);
    if (data) {
      res.status(200).json({ message: "Item reduced or removed", cart: data });
    } else {
      res.status(404).json({ message: "Cart item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
//increase Quantity
const increaseCartQuantity = async (userId, cartItemId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const item = user.cart.find((entry) => entry._id.toString() === cartItemId);

    if (!item) return null;

    item.quantity += 1;
    await user.save();

    const updatedUser = await User.findById(userId).populate("cart.productId");

    return updatedUser?.cart;
  } catch (error) {
    console.error("Error in Increasing Cart Quantity", error);
  }
};
app.patch("/cart/increase/:userId/:cartItemId", async (req, res) => {
  try {
    const data = await increaseCartQuantity(
      req.params.userId,
      req.params.cartItemId
    );
    if (data) {
      res.status(200).json({ message: "Quantity increased", cart: data });
    } else {
      res.status(404).json({ message: "Cart item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//add Address
const addAddress = async (userId, addressInfo) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("Please Login");
      return null;
    }

    const existingAddress = user.addressBook.find(
      (add) =>
        add.city === addressInfo.city &&
        add.state === addressInfo.state &&
        add.pincode === addressInfo.pincode
    );

    if (!existingAddress) {
      user.addressBook.push(addressInfo);
      const savedUser = await user.save();
      return savedUser.addressBook;
    } else {
      console.log("Address Already Exists");
      return null;
    }
  } catch (error) {
    console.error("Error in adding Address", error);
    return null;
  }
};
app.post("/add/:userId", async (req, res) => {
  try {
    const data = await addAddress(req.params.userId, req.body);

    if (data) {
      res.status(201).json({ message: "Address added", addressBook: data });
    } else {
      res
        .status(400)
        .json({ message: "Address already exists or user not found" });
    }
  } catch (error) {
    console.log("Error in Adding address", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//show all Address
const showAddress = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("Please Login");
      return null;
    }
    if (user && user.addressBook.length > 0) {
      console.log("Address Found");
    } else {
      console.log("Address is empty or user not found");
    }
    return user?.addressBook;
  } catch (error) {
    console.log("Error in showing Address", error);
    throw error;
  }
};
app.get("/add/:userId", async (req, res) => {
  try {
    const data = await showAddress(req.params.userId);
    if (data) {
      res.status(201).json({ message: "Address found", addressBook: data });
    } else {
      res.status(400).json({ message: "User not found or Address not found" });
    }
  } catch (error) {
    console.log("Error in showing address", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//Edit Address
const editAddress = async (userId, addressInfo) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("Please Login");
      return null;
    }

    const index = user.addressBook.findIndex(
      (addr) => String(addr._id) === String(addressInfo._id)
    );

    if (index === -1) {
      console.log("Address not found");
      return null;
    }
    console.log(index);

    user.addressBook[index] = {
      ...user.addressBook[index]._doc,
      ...addressInfo,
    };

    const data = await user.save();
    return data?.addressBook;
  } catch (error) {
    console.error("Error updating Address:", error);
    throw error;
  }
};

app.put("/add/:userId", async (req, res) => {
  try {
    const updatedAddress = await editAddress(req.params.userId, req.body);
    if (updatedAddress) {
      res.status(200).json({
        message: "Address updated successfully",
        addressBook: updatedAddress,
      });
    } else {
      res.status(404).json({ message: "Address not found or update failed" });
    }
  } catch (error) {
    console.log("Error in Editing address", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//Delete Address
const deleteAddress = async (userId, addressId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("Please login");
      return null;
    }
    const prevLength = user.addressBook.length;
    user.addressBook = user.addressBook.filter(
      (addr) => addr._id.toString() !== addressId
    );
    if (user.addressBook.length === prevLength) {
      console.log("Address not found");
      return null;
    }
    const updatedUser = await user.save();
    return updatedUser.addressBook;
  } catch (error) {
    console.error("Error Deleting Address:", error);
    throw error;
  }
};

app.delete("/add/:userId/:addressId", async (req, res) => {
  try {
    const data = await deleteAddress(req.params.userId, req.params.addressId);
    if (data) {
      res
        .status(200)
        .json({ message: "Address deleted Successfully", addressBook: data });
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    console.log("Error in Deleting address", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//Place order
const placeOrder = async (userId, orderData) => {
  try {
    const user = await User.findById(userId);
    if (!user || user.cart.length === 0) {
      return console.log("Invalid user or empty cart.");
    }
    const newOrder = {
      ...orderData,
      items: user.cart,
      date: new Date(),
    };

    user.order.push(newOrder);
    user.cart = [];
    await user.save();

    return user;
  } catch (error) {
    console.log("Error placing order", error);
  }
};

app.post("/order/:userId", async (req, res) => {
  try {
    const updatedUser = await placeOrder(req.params.userId, req.body);
    if (updatedUser) {
      res.status(201).json(updatedUser);
    } else {
      res.status(400).json({ message: "Order not saved" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

//get order
const getOrder = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || user.order.length === 0) {
      return console.log("Invalid user or empty cart.");
    }
    console.log(user.order);
    return user.order;
  } catch (error) {
    console.log("Error placing order", error);
  }
};
app.get("/order/:userId", async (req, res) => {
  try {
    const data = await getOrder(req.params.userId);
    if (data) {
      res.status(201).json({ message: "Order found", order: data });
    } else {
      res.status(400).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(404).json({ message: "Internal Error in getting order", error });
  }
});
app.listen(port, () => console.log("Server is running on Port:", port));
