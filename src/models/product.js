import mongoose from "mongoose";

const { Schema } = mongoose;

const MetaSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: Schema.Types.ObjectId, ref: "Image", required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema({
  title: { type: String, required: true },
  publishedOn: { type: Date, required: true },
  categories: [
    { type: Schema.Types.ObjectId, ref: "Category", required: true },
  ],
  relatedProducts: [
    { type: Schema.Types.ObjectId, ref: "Product", required: true },
  ],
  slug: { type: String, required: true },
  meta: MetaSchema,
  _status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  __v: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
