import mongoose from "mongoose";

const { Schema } = mongoose;

const MetaSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema({
  title: { type: String, required: true },
  publishedOn: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
  relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
  slug: { type: String, required: true },
  brand: { type: String, required: false },
  meta: MetaSchema,
  _status: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  __v: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
