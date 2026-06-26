import bcrypt from "bcryptjs/dist/bcrypt.js";
import userModel from "../model/user.model.js";
import { bcryptPassword, comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import profileModel from "../model/profile.model.js";
import skillModel from "../model/skill.model.js";

export default {
  async register(req, res) {
    try {
      const { email, password, username } = req.body;
      if (!email || !username || !password) {
        return res.status(400).json({
          success: false,
          message: "Mohon isi semua kolom!",
          data: null,
        });
      }

      const exitingUserEmail = await userModel.findOne({ email });
      if (exitingUserEmail) {
        return res.status(400).json({
          success: false,
          message: "Email tersebut telah terdaftar!",
          data: null,
        });
      }
      const exitingUsername= await userModel.findOne({ username });
      if (exitingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username tersebut telah terdaftar!",
          data: null,
        });
      }
      
      const passwordHashed = await bcryptPassword(password);

      const user = await userModel.create({
        email,
        username,
        password: passwordHashed,
      });
      const profile = await profileModel.create({
        userId: user._id,
        fullName: "",
        bio: "",
        photo_profile_url: "https://res.cloudinary.com/df9jelnu7/image/upload/v1782362663/profile_zngu0l.png",
        socialMedia: [],
        skills: [],
      });
      return res.status(200).json({
        success: true,
        message: "Akun Berhasil didaftarkan!!",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: true,
        message: error.message,
        data: null,
      });
    }
  },
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Mohon Isi Seluruh Kolom!",
          data: null,
        });
      }

      const user = await userModel.findOne({ username });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Pengguna Tidak Ditemukan!",
          data: null,
        });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Password Salah",
          data: null,
        });
      }

      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        message: "Yeayy.. Login Berhasil!",
        data: {
          _id: user._id,
          name: user.username,
          email: user.email,
          token,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Internal Server error: ${error.message}`,
        data: null,
      });
    }
  },
  async me(req, res) {
    try {
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User tidak ditemukan!" });
      }
      const profile = await profileModel
        .findOne({ userId: user._id })
        // .findOne({ userId: req.user.id })
        .populate("skills");
      const result = await userModel.findById(req.user.id);
      const responseData = {
        userId: user._id,
        username: user.username,
        email: profile.email,
        fullName: profile.fullName,
        bio: profile.bio,
        photo_profile_url: profile.photo_profile_url,
        skills: profile.skills
          ? profile.skills.map((skill) => ({
              _id: skill._id,
              skillName: skill.skillName,
            }))
          : [],
        socialMedia: profile.socialMedia || [],
        institusi: profile.institusi,
        
      };

      res.status(200).json({
        success: true,
        message: "Berhasil Mendapatkan Data!",
        data: responseData,
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
