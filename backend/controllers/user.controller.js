
import User from "../models/user.model.js"
import Profile from "../models/profile.model.js"
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import PDFDocument from 'pdfkit'
import fs from "fs";
import ConnectionRequest from "../models/connection.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import path from "path";


const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(16).toString("hex") + ".pdf";
  const fullPath = path.join("uploads", outputPath);
  const stream = fs.createWriteStream(fullPath);
  doc.pipe(stream);

  try {
    const profilePic = userData?.userId?.profilePicture;
    const imagePath = profilePic ? path.join("uploads", profilePic) : null;

    if (
      imagePath &&
      fs.existsSync(imagePath) &&
      [".jpg", ".jpeg", ".png"].includes(path.extname(imagePath).toLowerCase())
    ) {
      try {
        doc.image(imagePath, { align: "center", width: 100 });
      } catch (imageErr) {
        console.warn("⚠️ Image could not be loaded into PDF:", imageErr.message);
        // Continue without crashing
      }
    } else {
      console.warn("⚠️ Image not found or unsupported, skipping...");
    }

    doc.moveDown();
    // doc.fontSize(14).text(`Name: ${userData.userId.name || "N/A"}`);
    // doc.text(`Username: ${userData.userId.username || "N/A"}`);
    // doc.text(`Email: ${userData.userId.email || "N/A"}`);


     doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

    doc.fontSize(14).text("Past Work:");
    userData.pastWork.forEach((work) => {
        doc.fontSize(14).text(`  Company: ${work.company}`);
        doc.fontSize(14).text(`  Position: ${work.position}`);
        doc.fontSize(14).text(`  Years: ${work.years}`);
    });


    doc.end();

    return outputPath;
  } catch (err) {
    console.error("❌ PDF generation error:", err.message);
    throw new Error("Failed to generate PDF.");
  }
};


export const register = async (req, res)=>{
    try {
        const {name, email, password, username} = req.body;
        if(!name || !email || !password || !username) return res.status(400).json({message: "All field are required"});

        const user = await User.findOne({
            email
        });

        if(user) return res.status(400).json({message: "User already exists"});

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();

        const profile = new Profile({ userId: newUser._id});

        await profile.save();

        return res.json({message: "User Created"});

        
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

export const login = async(req, res)=>{
    try{
        const {email, password}  = req.body;

        if(!email || !password) return res.status(400).json({message: "All field required"});

        const user = await User.findOne({
            email
        });

        if(!user) return res.status(404).json({message: "User does not exist"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(404).json({message: "Invalid Credentials"});

        const token =  crypto.randomBytes(32).toString("hex");
        await User.updateOne({_id: user._id}, { token })

        return res.json({ token });

    }catch(error){
          return res.status(500).json({message: error.message});
    }
}

export const uploadProfilePicture = async(req, res)=>{
    const { token } = req.body;


    console.log("User token: ", token);
    try{

        const user = await User.findOne({token: token});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        user.profilePicture = req.file.filename;
        
        await user.save();

        return res.json({message: "Profile Picture Updated"})

    }catch(error){
        return res.status(500).json({message: error.message})
    }
}

export const uploadUserProfile = async (req, res) => {
    console.log("upload file", req.file);
    console.log("Body token", req.body.token);
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = newUserData;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: user._id }, // only find if it's a different user
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username or Email already exists" });
    }

    // Update user fields
    Object.assign(user, newUserData);

    await user.save();

    return res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("UploadUserProfile error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserAndProfile = async(req, res)=>{
    try{
       const { token } = req.query;

       console.log(`Token: ${token}`);

       const user = await User.findOne({token: token});


       if(!user){
        return res.status(404).json({message: "User not found"});   
        }

        console.log(user);

        const userProfile = await Profile.findOne({ userId: user._id})
        .populate('userId', 'name email username profilePicture');
           console.log(userProfile);
        return res.json({profiles: userProfile});
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

export const updateProfileData = async(req, res)=>{
    try{
        const {token, ...newProfileUpdate} = req.body;
        
        const userProfile = await User.findOne({token: token});
        if(!userProfile){
            return res.status(404).json({message: "User not found"})
        }

        const profile_to_update = await Profile.findOne({userId: userProfile._id})

        Object.assign(profile_to_update, newProfileUpdate);

        await profile_to_update.save();

        return res.json({message: "Profile Updated"});
    }catch(error){
        return res.status(500),json({message: error.mesaage});
    }
}

export const getAllUserProfile = async (req, res)=>{
    try{
        const profiles = await Profile.find().populate('userId', 'name username email profilePicture');

        return res.json({profiles})
    }catch(error){
        return res.status(500).json({message: error.mesaage});
    }
}

export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;
    console.log("📥 userId:", user_id);

    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      'userId',
      'name username email profilePicture'
    );

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found." });
    }

    const outputPath = await convertUserDataToPDF(userProfile);

    return res.json({ message: outputPath });
  } catch (err) {
    console.error("❌ Error generating PDF:", err.message);
    return res.status(500).json({ error: "Failed to generate PDF." });
  }
};


export const sendConnectionRequest = async(req, res)=>{
    const { token, connectionId} = req.body;

    try{
        const user = await User.findOne({ token });
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const connectionUser = await User.findOne({ _id: connectionId});

        if(!connectionUser){
            return res.status(404).json({message: "Connection User not found"});
        }
        
        const existingRequest = await ConnectionRequest.findOne(
            {
                userId: user._id,
                connectionId: connectionUser._id
            }
        )
        if(existingRequest){
            return res.status(400).json({message: "Request already sent"})
        }

        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id
        });

        await request.save();

        return res.json({message: "Request sent"});

    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

export const getMyConnectionRequests = async (req, res)=>{
    const { token } = req.query;

    try{
        const user = await User.findOne({ token });

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const connections = await ConnectionRequest.findOne({ userId: user._id}).populate("connectionId", 'name username email profilePicture');

        return res.json({ connections });
    }catch(error){
         return res.status(500).json({message: error.message});
    }
}

export const getUserGotConnectionRequest = async(req, res)=>{
    const { token } = req.query;

    try{
        const user = await User.findOne({token});
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        const connections = await ConnectionRequest.find({connectionId: user._id}).populate("userId", 'name username email profilePicture');

        return res.json({ connections });
    }catch(error){
         return res.status(500).json({message: error.message});
    }
}

export const acceptUserConnectionRequest = async(req, res)=>{
    const {token, requestId, action_type} = req.body;

    try{

        const user = await User.findOne({token});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }
         const connection = await ConnectionRequest.findOne({_id: requestId});

         if(!connection){
            return res.status(404).json({message: "Connection not found"});
         }

         if(action_type === "accept"){
            connection.status_accepted = true;
         }else{
            connection.status_accepted = false;
         }

         await connection.save();

         return res.json({message: "Request updated"})

    }catch(error){
         return res.status(500).json({message: error.message});
    }
}
export const commentPost = async(req, res)=>{
     const { token, post_id, commentBody} = req.body;

     try{
         const user = await User.findOne({ token: token}).select("_id");
          console.log(user);
         if(!user){
            return res.status(404).json({message: "User not found"});
         }

         console.log("Post ", req.body);

         const post = await Post.findOne({_id: post_id});
         if(!post){
            return res.status(404).json({ message: "Post not found"});
         }

         const comment = new Comment({
             userId: user._id,
             postId: post_id,
             body: commentBody
            });

            console.log(comment);

         await comment.save();

         return res.status(200).json({ message: "Comment Added"});
     }catch(err){
        return res.status(500).json({message: err.message});
         }
}

export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id })
    .populate(
      "userId",
      "name username email profilePicture"
    );

     if (!userProfile) return res.status(404).json({ message: "Profile not found" });

    return res.json({ profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


