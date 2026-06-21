import likeModel from "../model/like.model.js";
import postModel from "../model/post.model.js";
import profileModel from "../model/profile.model.js";
import userModel from "../model/user.model.js";
import commentModel from "../model/comment.model.js";

export default {
  async createPost(req, res) {
    try {
      const userId = req.user.id;

      const { title, description, portfolioType, mediaUrls, externalUrl } =
        req.body;
      if (!title || !description || !mediaUrls || !externalUrl) {
        return res.status(400).json({
          success: false,
          message: "Tolong Isi Bagian yang wajib diisi!",
          data: null,
        });
      }

      const result = await postModel.create({
        userId,
        title,
        description,
        mediaUrls,
        externalUrl,
      });

      res.status(200).json({
        success: true,
        message: "Postingan Berhasil dibuat",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },
  async showCase(req, res) {
    try {
      const posts = await postModel
        .find()
        .sort({ createdAt: -1 })
        .populate("userId", "username");

      if (!posts || posts.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Belum ada postingan saat ini!",
          data: [],
        });
      }
      const dataComplete = await Promise.all(
        posts.map(async (post) => {
          const userProfile = await profileModel.findOne({
            userId: post.userId._id,
          });

          const postObj = post.toObject();

          if (postObj.userId) {
            postObj.userId.photo_profile_url = userProfile
              ? userProfile.photo_profile_url
              : "profile.png";
          }
          const likeCount = await likeModel.countDocuments({
            postId: post._id,
          });
          const commentCount = await commentModel.countDocuments({
            postId: post._id,
          });

          postObj.commentCount = commentCount;
          postObj.likeCount = likeCount;
          return postObj;
        }),
      );
      res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan semua Postingan!",
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

  async getPostDetail(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.user.id;
      const post = await postModel
        .findById(postId)
        .populate("userId", "username");

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post Not found!",
          data: null,
        });
      }

      const profile = await profileModel.findOne({
        userId: post.userId._id,
      });

      const likeCount = await likeModel.countDocuments({
        postId,
      });

      const commentCount = await commentModel.countDocuments({
        postId,
      });

      const isLiked = await likeModel.exists({
        postId,
        userId,
      });

      const comments = await commentModel
        .find({ postId })
        .populate("userId", "username")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        message: "Post Detail added!",
        data: {
          ...post.toObject(),

          ownerId: {
            _id: post.userId._id,
            username: post.userId.username,
            photo_profile_url: profile?.photo_profile_url || "profile.png",
          },
          likeCount,
          commentCount,
          isLiked: !!isLiked,
          comments,
        },
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
  async updatePosts(req, res) {
    try {
      const userId = req.user.id;
      const postId = req.params.postId;
      const post = await postModel.findById({ _id: postId });
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Postingan tidak ditemukan!",
          data: null,
        });
      }
      const { title, description, externalUrl, mediaUrls, portfolioType } =
        req.body;
      if (post.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Bukan hak lu buat edit postingan ini!",
          data: null,
        });
      }

      if (!title || !description || !externalUrl) {
        return res.status(400).json({
          success: false,
          message: "Tiap kolom wajib di isi!",
          data: null,
        });
      }

      post.title = title;
      post.description = description;
      post.externalUrl = externalUrl;
      post.portfolioType = portfolioType || post.portfolioType;

      if (mediaUrls) {
        post.mediaUrls = mediaUrls;
      }
      const updatePost = await post.save();
      res.status(200).json({
        success: true,
        message: "Berhasil diupdate!",
        data: updatePost,
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

  async deletePost(req, res) {
    try {
      const postId = req.params.postId;
      const userId = req.user.id;
      const post = await postModel.findById(postId);
      if (!postId) {
        return (
          res.status(404),
          json({
            success: false,
            message: "Postingan Tidak ditemukan!",
            data: null,
          })
        );
      }

      if (post.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message:
            "You don't have permission to delete this post. You can only delete your own posts.",
          data: null,
        });
      }

      await post.deleteOne();
      res.status(200).json({
        success: true,
        message: "Postingan Berhasil dihapus!",
        data: post,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },

  // LIKE
  async likePost(req, res) {
    try {
      const { postId } = req.params;
      const post = await postModel.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
      const existingLike = await likeModel.findOne({
        postId,
        userId: req.user.id,
      });

      if (existingLike) {
        return res.status(400).json({
          success: false,
          message: "Sudah like postingan ini",
        });
      }

      await likeModel.create({
        postId,
        userId: req.user.id,
      });

      res.status(201).json({
        success: true,
        message: "Post berhasil di-like",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async unlikePost(req, res) {
    try {
      const { postId } = req.params;
      const post = await postModel.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
      await likeModel.deleteOne({
        postId,
        userId: req.user.id,
      });

      res.status(200).json({
        success: true,
        message: "Like berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // COMMENT
  async createComment(req, res) {
    try {
      const { postId } = req.params;
      const { content } = req.body;

      const comment = await commentModel.create({
        userId: req.user.id,
        postId,
        content,
      });

      res.status(200).json({
        success: true,
        message: "Success create comment!",
        data: comment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  async getComments(req, res) {
    try {
      const { postId } = req.params;

      const comments = await commentModel
        .find({ postId })
        .populate("userId", "username")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;
      const comment = await commentModel.findById(commentId);
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: "Comment not found!",
          data: null,
        });
      }
      if (comment.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Bukan komentar milikmu",
        });
      }

      await comment.deleteOne();
      res.status(200).json({
        success: true,
        message: "Comment berhasil dihapus!",
        data: comment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
