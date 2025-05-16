const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  { _id: false } 
);


const wishlistItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },
  },
  { _id: false } 
);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  role: {
  type: String,
  enum: ["Admin", "User"],
  default: "User"
}

,
  cart: [cartItemSchema ],
   wishlist: [wishlistItemSchema],
  addressBook: [
     {
    id: String,
    add: String,
  }
  ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;

