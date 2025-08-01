import { Router } from "express";
import { acceptUserConnectionRequest, downloadProfile, getAllUserProfile, getMyConnectionRequests, getUserAndProfile, getUserGotConnectionRequest, getUserProfileAndUserBasedOnUsername, login, register, sendConnectionRequest, updateProfileData, uploadProfilePicture, uploadUserProfile } from "../controllers/user.controller.js";
import multer from 'multer'
import path from 'path'

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname).toLowerCase();
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'application/pdf', 'application/zip',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});


router.route("/update_profile_picture").post(upload.single('profile_picture'), uploadProfilePicture)

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(uploadUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/get_all_user").get(getAllUserProfile);
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnectionRequests").get(getMyConnectionRequests);
router.route("/user/user_connection_request").get(getUserGotConnectionRequest);
router.route("/user/accept_connection_request").post(acceptUserConnectionRequest);
router.route("/user/get_profile_based_on_username").get(getUserProfileAndUserBasedOnUsername);

export default router;