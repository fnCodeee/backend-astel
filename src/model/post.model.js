import mongoose from "mongoose";

const Schema = mongoose.Schema;

const publicPostSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    portfolioType: {
      type: String,
      enum: ["link", "images"],
      default: "link",
    },
    externalUrl: {
      type: String,
      required: true,
    },
    mediaUrls: {
      type: [String],
      dafault: [],
    },
  },
  { timestamps: true },
);

const postModel = mongoose.model("Post", publicPostSchema);
export default postModel;
