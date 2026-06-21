import mongoose from "mongoose";

const Schema = mongoose.Schema;

const collabSchema = new Schema({
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
  requiredMember: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  mediaUrls: {
    type: [String],
    default: [],
  },
  communicationUrl: {
    type: String,
    required: true,
  },
  skillsNeeded: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },
  ],
});
const collabModel = mongoose.model("Collab", collabSchema);

export default collabModel;
