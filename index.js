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
    console.error("Error in Adding Product", error);
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
    return data
  } catch (error) {
    console.log("Error in founding Product");
  }
};
app.get("/product/:id", async (req, res) => {
  try {
    const data = await findById(req.params.id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Product Data not found" });
    }
    
  } catch (error) {
    console.error("Error in finding by Id Product", error);
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
    const data = await Product.findByIdAndUpdate(productId, { $set: productInfo }, { new: true });
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
}

app.put("/product/:productId", async (req, res) => {
  try {
    const updatedProduct = await editProduct(req.params.productId, req.body);
    if (updatedProduct) {
      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } else {
      res.status(404).json({ message: "Product not found or update failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Delete Product
const deleteProduct = async (id) => {
  try {
    const data = await Product.findByIdAndDelete(id)
    if(data){
      console.log("Product is deleted ");
    } else{
      console.log("Product is not deleted");
    }
    return data
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
    console.error("Error in Deleting Product");
  }
});

//User Api
const createUser = async (userInfo) => {
  try {
    const check =await User.findOne({email: userInfo.email});
    if (check) {
      console.log("User Already Created his Account");
      return null
    } else {
        const data = new User(userInfo)
      const saved =await data.save();
      if (saved) {
        console.log("User Created");
      } else {
        console.log("User not created");
      }
      return saved
    }
  } catch (error) {
    console.error("Error Occured in Creating User");
  }
};
app.post("/user", async (req, res) => {
  try {
    const data = await createUser(req.body);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json({ message: "User is not created" });
    }
  } catch (error) {
    console.error("Error in Creating user", error);
  }
});

//Edit Profile
const editUser = async (id,userInfo) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      userInfo,  
      { new: true } 
    );
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};
app.post("/user/:id",async(req,res)=>{
    try {
        const data=await editUser(req.params.id,req.body)
        if(data){
            res.status(201).json(data)
        }else{
            res.status(400).json({message:"User not found"})
        }
    } catch (error) {
        console.log("Error in Updating Data",error)
    }
})
//find by id
const findUserById=async(id)=>{
    try{
const data=await User.findOne({_id:id})
if(data){
    console.log("User Found")
}else{
    console.log("User not found")
}
return data
    }catch(error){
console.log("Error in Finding User",error)
    }
}
app.get("/user/:id",async(req,res)=>{
    try{
const data=await findUserById(req.params.id)
if(data){
    res.status(200).json(data)
}else{
    res.status(400).json({message:"User not found"})
}
    }catch(error){
console.error("Error in finding user by Id",error)
    }
})
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
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Wishlist not found" });
    }
  } catch (error) {
    console.log("Error in Fetching Wishlist", error);
  }
});
//remove wishlist
const deleteWishlistItem = async (userId, productId) => {
  try {
    const updated = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: { productId } } },
      { new: true }
    );
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
    const data = await deleteWishlistItem(req.params.userId, req.params.productId);
    if (data) {
      res.status(200).json({ message: "Item removed", wishlist: data });
    } else {
      res.status(404).json({ message: "Item not found in wishlist" });
    }
  } catch (error) {
    console.log("Error in removing wishlist item", error);
  }
});
//get cart
const getCart = async (userId) => {
  try {
    const user = await User.findById(userId).populate("cart.productId");
    if (user && user.cart.length > 0) {
      console.log("Cart Found");
    } else {
      console.log("Cart is empty or user not found");
    }
    return user?.cart;
  } catch (error) {
    console.error("Error in Getting Cart", error);
  }
};

app.get("/cart/:userId", async (req, res) => {
  try {
    const data = await getCart(req.params.userId);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.log("Error in Fetching Cart", error);
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
      const updatedUser = await user.save();
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
    res.status(500).json({ message: "Server error" });
  }
});

//delete cart
const deleteCartItem = async (userId, productId) => {
  try {
    const updated = await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: { productId } } },
      { new: true }
    );
    if (updated) {
      console.log("Cart Item Removed");
    } else {
      console.log("User not found or item not in cart");
    }
    return updated?.cart;
  } catch (error) {
    console.error("Error in Deleting Cart Item", error);
  }
};

app.delete("/cart/:userId/:productId", async (req, res) => {
  try {
    const data = await deleteCartItem(req.params.userId, req.params.productId);
    if (data) {
      res.status(200).json({ message: "Item removed", cart: data });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.log("Error in removing cart item", error);
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
    const existingProduct = user.cart.find(item => item.productId.toString() === productId);
    
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    const updatedUser = await user.save();
    console.log("Product added to cart");
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
  }
});

//reduce Cart
const reduceCart = async (userId, productId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return null;
    }
    const product = user.cart.find(item => item.productId.toString() === productId);
    if (!product) {
      console.log("Product not found in cart");
      return null;
    }
    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    }
    const updatedUser = await user.save();
    console.log("Product quantity reduced");
    return updatedUser?.cart;
  } catch (error) {
    console.error("Error in Reducing Cart", error);
  }
};
app.patch("/cart/:userId/:productId", async (req, res) => {
  try {
    const data = await reduceCart(req.params.userId, req.params.productId);
    if (data) {
      res.status(200).json({ message: "Item reduced or removed", cart: data });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log("Error in Reducing Item in Cart", error);
  }
});
//add address
const addAddress=async(userId,addressInfo)=>{
  try {
    const user=await User.findById(userId)
    if(!user){
      console.log("Please login to add Address")
      return null
    }
    const existingAddress=user.addressBook.find((add)=>add.add===addressInfo)
    if(existingAddress){
      console.log("Address Already Present")
      return null
    }else{
      user.addressBook.push({add:addressInfo,id:user.addressBook.length+1})
    }
    const updatedUser = await user.save();
    console.log("Address added to cart");
    return updatedUser?.addressBook;
  } catch (error) {
    console.error("Error in Adding Address to User", error);
  }
}
app.post("/add/:userId",async(req,res)=>{
  try {
    const data = await addAddress(req.params.userId, req.body.addressInfo);
    if (data) {
      res.status(200).json({ message: "Address added to User", addressBook: data });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error in Adding Address to User", error);
  }
})
//get all address
const getAddress=async(userId)=>{
  try {
    const user = await User.findById(userId)
    if (user && user.addressBook.length > 0) {
      console.log("Address Found");
    } else {
      console.log("Cart is empty or user not found");
    }
    return user?.addressBook;
  } catch (error) {
    console.error("Error in Getting Address", error);
  }
}
app.get("/add/:userId",async(req,res)=>{
   try {
    const data = await getAddress(req.params.userId);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    console.log("Error in Fetching Address", error);
  }
})

//Update the Address
const editAddress = async (userId, addressId, addressInfo) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("Please Login");
      return null;
    }

    
    const addressIndex = user.addressBook.findIndex(
      (addr) => addr.id.toString() === addressId
    );
    console.log(addressId)
    console.log(addressIndex)

    if (addressIndex === -1) {
      console.log("Address not found");
      return null;
    }

    user.addressBook[addressIndex].add = addressInfo;
    const updatedUser = await user.save();
    console.log("Address updated successfully");
    return updatedUser.addressBook;

  } catch (error) {
    console.error("Error updating address", error);
    throw error;
  }
};

app.put("/add/:userId/:addressId", async (req, res) => {
  try {
    const data = await editAddress(
      req.params.userId,
      req.params.addressId,
      req.body.addressInfo
    )

    if (data) {
      res.status(200).json({ message: "Address updated", addressBook: data });
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.listen(port, () => console.log("Server is running on Port:", port));
