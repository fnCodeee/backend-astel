import mongoose from "mongoose";

const Schema = mongoose.Schema;

const skillSchema = new Schema({
  skillName: {
    type: String,
    required: true,
  },
});

const skillModel = mongoose.model("Skill", skillSchema);
export default skillModel;
