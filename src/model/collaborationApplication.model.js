import mongoose from "mongoose";

const collabrationApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collabId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collab",
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model(
  "CollaborationApplication",
  collabrationApplicationSchema,
);
