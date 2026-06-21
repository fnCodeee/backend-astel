import mongoose from "mongoose";

const Schema = mongoose.Schema;
const profileSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  fullName: {
    type: String,
    default: "",
  },
  universitas: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  photo_profile_url: {
    type: String,
    required: true,
  },
  socialMedia: [
    {
      platform: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  skills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },
  ],
});

const profileModel = mongoose.model("Profile", profileSchema);
export default profileModel;
