import collaborationApplicationModel from "../model/collaborationApplication.model.js";
import collabModel from "../model/collab.model.js";
import profileModel from "../model/profile.model.js";

export default {
  async applyCollab(req, res) {
    try {
      const { collabId } = req.params;
      const { message } = req.body;
      const userId = req.user.id;

      const collab = await collabModel.findById(collabId);

      if (!collab) {
        return res.status(404).json({
          success: false,
          message: "Collaboration Post not found!",
          data: null,
        });
      }

      if (collab.userId.toString() === userId) {
        return res.status(400).json({
          success: false,
          message: "You cannot apply for your own collaboration post.",
          data: null,
        });
      }

      const existingApplication = await collaborationApplicationModel.findOne({
        userId: req.user.id,
        collabId,
      });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: "You have already applied for this collaboration.",
          data: null,
        });
      }

      const application = await collaborationApplicationModel.create({
        userId: req.user.id,
        collabId,
        message,
      });
      res.status(200).json({
        success: true,
        message: "Success apply collab",
        data: application,
      });
    } catch (error) {}
  },

  async acceptApplicant(req, res) {
    const { applicationId } = req.params;
    const applicationFind =
      await collaborationApplicationModel.findById(applicationId);

    const collab = await collabModel.findById(applicationFind.collabId);

    if (collab.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not the owner of this collaboration",
      });
    }

    const application = await collaborationApplicationModel.findByIdAndUpdate(
      applicationId,
      {
        status: "accepted",
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Application accepted",
      data: application,
    });
  },

  async rejectApplicant(req, res) {
    const { applicationId } = req.params;
    const applicationFind =
      await collaborationApplicationModel.findById(applicationId);

    const collab = await collabModel.findById(applicationFind.collabId);

    if (collab.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not the owner of this collaboration",
      });
    }
    const application = await collaborationApplicationModel.findByIdAndUpdate(
      applicationId,
      {
        status: "rejected",
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Application rejected",
      data: application,
    });
  },

  async getApplicants(req, res) {
    try {
      // owner: lihat pelamar di setiap collaboration
      const { collabId } = req.params;
      const collab = await collabModel.findById(collabId);

      if (!collab || collab.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Collaboration not found",
          data: null,
        });
      }

      if (collab.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not the owner of this collaboration",
          data: null,
        });
      }

      const applicant = await collaborationApplicationModel
        .find({ collabId })
        .populate("userId", "username");

      res.status(200).json({
        success: true,
        message: "List of applicants",
        data: applicant,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },
  async myApplications(req, res) {
    try {
      //lihat lamaean kita di setiap collaboration
      const application = await collaborationApplicationModel
        .find({
          userId: req.user.id,
        })
        .populate({
          path: "collabId",
          select: {
            title: 1,
            description: 1,
            mediaUrls: 1,
            communicationUrl: 1,
          },
          populate: {
            path: "userId",
            select: {
              username: 1,
            },
          },
        });
      if (application.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
          data: null,
        });
      }
      const ownerIds = application.map((collab) => collab.userId._id);
      const profiles = await profileModel.find({
        userId: { $in: ownerIds },
      });

      const profileMap = {};
      profiles.forEach((profile) => {
        profileMap[profile.userId.toString()] = profile;
      });
      console.log(application);
      const dataComplete = application.map((app) => {
        const ownerId = app.collabId.userId._id.toString();

        const profile = profileMap[ownerId];
        return {
          applicationId: app._id,
          status: app.status,
          message: app.message,

          collab: {
            _id: app.collabId._id,
            title: app.collabId.title,
          },

          owner: {
            _id: ownerId,
            username: app.collabId.userId.username,
            photo_profile_url: profile?.photo_profile_url || "profile.png",
          },

          ...(app.status === "accepted" && {
            communicationUrl: app.collabId.communicationUrl,
          }),

          createdAt: app.createdAt,
          updatedAt: app.updatedAt,
        };
      });

      res.status(200).json({
        success: true,
        message: "My applications",
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

  async myApplicationDetail(req, res) {
    try {
      const { applicationId } = req.params;
      const application = await collaborationApplicationModel
        .findById(applicationId)
        .populate({
          path: "collabId",
          populate: {
            path: "userId",
            select: "username",
          },
        });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
          data: null,
        });
      }

      if (application.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
          data: null,
        });
      }

      const response = {
        application: {
          status: application.status,
          message: application.message,
        },

        collaboration: {
          _id: application.collabId._id,
          title: application.collabId.title,
          description: application.collabId.description,
          mediaUrls: application.collabId.mediaUrls,
          requiredMember: application.collabId.requiredMember,
          skillsNeeded: application.collabId.skillsNeeded,
        },

        owner: {
          _id: application.collabId.userId._id,
          username: application.collabId.userId.username,
        },
      };

      if (application.status === "accepted") {
        response.communicationUrl = application.collabId.communicationUrl;
      }

      res.status(200).json({
        success: true,
        data: response,
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
