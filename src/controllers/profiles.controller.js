import profileModel from "../model/profile.model.js";
import userModel from "../model/user.model.js";

export default {
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { fullName, bio, photo_profile_url, socialMedia, skills } =
        req.body;
      const profile = await profileModel.findOne({ userId: req.user.id });
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile Tidak di temukan!",
          data: null,
        });
      }
      if (fullName !== undefined && typeof fullName !== "string") {
        return res.status(400).json({
          success: false,
          message: "fullName harus berupa string",
        });
      }
      if (bio !== undefined && typeof bio !== "string") {
        return res.status(400).json({
          success: false,
          message: "bio harus berupa string",
        });
      }
      if (socialMedia && !Array.isArray(socialMedia)) {
        return res.status(400).json({
          success: false,
          message: "socialMedia harus array",
        });
      }
      if (skills && !Array.isArray(skills)) {
        return res.status(400).json({
          success: false,
          message: "skills harus array",
        });
      }


      const updateData = {};
      if (fullName !== undefined) updateData.fullName = fullName;

      if (bio !== undefined) updateData.bio = bio;

      if (photo_profile_url !== undefined)
        updateData.photo_profile_url = photo_profile_url;

      if (socialMedia !== undefined) updateData.socialMedia = socialMedia;

      if (skills !== undefined) updateData.skills = skills;
      const updateProfile = await profileModel.findOneAndUpdate(
        { userId },
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        },
      );

      res.status(200).json({
        success: true,
        message: "Profile berhasil diperbarui!",
        data: updateProfile,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },
};
