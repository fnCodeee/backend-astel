import collaborationApplicationModel from "../model/collaborationApplication.model.js";
import collabModel from "../model/collab.model.js";

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
    try { // owner: lihat pelamar di setiap collaboration
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
    try { //lihat lamaean kita di setiap collaboration
      const application = await collaborationApplicationModel
        .find({
          userId: req.user.id,
        })
        .populate("collabId");
        if (application.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Application not found",
            data: null,
          });
        } 
      res.status(200).json({
        success: true,
        message: "My applications",
        data: application,
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
        .populate("collabId");

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
        status: application.status,
        message: application.message,
        collaboration: application.collabId.title,
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
