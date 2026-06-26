import collabModel from "../model/collab.model.js";
import collaborationApplicationModel from "../model/collaborationApplication.model.js";
import profileModel from "../model/profile.model.js";
import userModel from "../model/user.model.js";

export default {
  async addCollab(req, res) {
    try {
      const userId = req.user.id;

      const {
        title,
        description,
        requiredMember,
        mediaUrls,
        communicationUrl,
        skillsNeeded,
      } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
          data: null,
        });
      }

      if (
        !title ||
        !description ||
        requiredMember === undefined ||
        !communicationUrl ||
        !skillsNeeded
      ) {
        return res.status(400).json({
          success: false,
          message: "Seluruh Kolom wajib diisi.",
          data: null,
        });
      }

      const result = await collabModel.create({
        userId: userId,
        title,
        description,
        requiredMember,
        mediaUrls: mediaUrls || [],
        communicationUrl,
        skillsNeeded: skillsNeeded || [],
      });
      return res.status(200).json({
        success: true,
        message: "Collaboration created successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
      console.log(error);
    }
  },

  async showCollab(req, res) {
    try {
      const collabs = await collabModel.find().populate("userId", "username");
      // console.log(collabs[0]);
      const userIds = collabs.map((collab) => collab.userId._id);
      const profiles = await profileModel.find({
        userId: { $in: userIds },
      });
      const profileMap = {};
      profiles.forEach((profile) => {
        profileMap[profile.userId.toString()] = profile;
      });

      const dataComplete = collabs.map((collab) => {
        const collabObj = collab.toObject();
        const { userId, communicationUrl, ...collabData } = collabObj;
        const profile = profileMap[userId._id.toString()];

        return {
          ...collabData,
          ownerId: {
            _id: collab.userId._id,
            username: collab.userId.username,
            photo_profile_url: profile?.photo_profile_url || "profile.png",
          },
        };
      });

      res.status(200).json({
        success: true,
        message: "Get All Posts Collaboration!",
        data: dataComplete,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
      console.log(error);
    }
  },
  async yourCollabPost(req, res) {
    try {
      const { userId } = req.params;
      const collabMe = await collabModel
        .find({
          userId: userId,
        })
        .populate("userId", "username");

      const user = await userModel.findById(userId);
      if (!collabMe || collabMe.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Collaboration Post not found!",
          data: null,
        });
      }

      res.status(200).json({
        success: true,
        message: `Your Collaboration Post, ${user.username}`,
        data: collabMe,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },
  async getCollabDetail(req, res) {
    try {
      const { id } = req.params;
      const collab = await collabModel
        .findById(id)
        .populate("userId", "username")
        .populate("skillsNeeded");

      if (!collab) {
        return res.status(404).json({
          success: false,
          message: "Collaboration not found",
          data: null,
        });
      }

      const profile = await profileModel.findOne({
        userId: collab.userId._id,
      });

      const collabObj = collab.toObject();
      const { userId, communicationUrl, ...collabData } = collabObj;
      const dataComplete = {
        ...collabData,
        ownerId: {
          _id: collab.userId._id,
          username: collab.userId.username,
          photo_profile_url: profile?.photo_profile_url || "profile.png",
        },
      };
      res.status(200).json({
        success: true,
        message: "Detail collaboration",
        data: dataComplete,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },
  async updateCollab(req, res) {
    try {
      const userId = req.user.id;
      const collabId = req.params.id;
      const {
        title,
        description,
        requiredMember,
        mediaUrls,
        communicationUrl,
        skillsNeeded,
      } = req.body;

      const post = await collabModel.findById(collabId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Postingan kolaborasi tidak ditemukan!",
          data: null,
        });
      }

      if (post.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Bukan hak lu buat edit postingan ini!",
          data: null,
        });
      }

      const updateData = {};

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (requiredMember !== undefined)
        updateData.requiredMember = requiredMember;
      if (mediaUrls !== undefined) updateData.mediaUrls = mediaUrls;
      if (communicationUrl !== undefined)
        updateData.communicationUrl = communicationUrl;
      if (skillsNeeded !== undefined) updateData.skillsNeeded = skillsNeeded;

      const updatedPost = await collabModel.findByIdAndUpdate(
        collabId,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        },
      );

      return res.status(200).json({
        success: true,
        message: "Postingan kolaborasi berhasil diperbarui!",
        data: updatedPost,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },

  async deleteCollab(req, res) {
    try {
      const userId = req.user.id;
      const collabId = req.params.id;
      const collab = await collabModel.findById(collabId);

      if (!collab) {
        return res.status(404).json({
          success: false,
          message: "Collaboration Post not found!",
          data: null,
        });
      }

      if (collab.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Bukan hak lu buat edit postingan ini!",
          data: null,
        });
      }
      await collaborationApplicationModel.deleteMany({
        collabId,
      });
      await collab.deleteOne();
      res.status(200).json({
        success: true,
        message: "Postingan kolaborasi berhasil dihapus!",
        data: collab,
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
