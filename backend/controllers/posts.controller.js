import Comment from "../models/comments.model.js"
import Post from "../models/posts.model.js"
import User from "../models/user.model.js"


export const activeCheck = async (req, res) =>{

    return res.status(200).json({message: "RUNNING"})
}


export const createPost = async (req, res)=>{
    const { token } = req.body;

    try{
        const user = await User.findOne({token: token});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        console.log("Post ", req.file)

        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file != undefined ? req.file.filename: "",
            fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : ""
        })
     console.log(req.file);
        await post.save();

        return res.status(200).json({message: "Post created"})
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}


export const getAllPosts = async(req, res)=>{
    try{
        const posts = await Post.find().populate('userId', 'name username email profilePicture');
        return res.json({ posts });
    }catch(err){
        return res.status(500).json({message: err.message})
    }
}

export const deletePost = async(req, res)=>{
    const { token, post_id} = req.body;

    try{
        const user = await User.findOne({ token: token}).select("_id");

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const post = await Post.findOne({ _id: post_id });

        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        if(post.userId.toString() !== user._id.toString()){
            return res.status(401).json({ message: "Unauthorized"})
        }
        await Post.deleteOne({ _id: post_id});
        
        return res.json({ message: "Post Deleted"});

    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

export const get_comments_by_post = async(req, res)=>{
    const { post_id } = req.query;
    try{
        const post = await Post.findById(post_id);

        if(!post){
            return res.status(404).json({message: "Post not found"});
        }

        const comments = await Comment
        .find({postId: post_id})
        .populate("userId", "username name");

        return res.json(comments.reverse())
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
}

export const delete_comment_of_user = async(req, res)=>{
    const { token, comment_id } = req.body;
    
    try{
        const user = await User.findOne({token: token}).select("_id");

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const comment = await Comment.findOne({"_id": comment_id});

        if(!comment){
            return res.status(404).json({message: "comment not found"});
        }

        if(comment.userId.toString() != user._id.toString()){
            return res.status(401).json({message: "Unauthorized"});
        }

        await Comment.deleteOne({"_id": comment_id});

        return res.json({message: "Comment Deleted"});
    }catch(err){
        return res.status(500).json({message: err.message});
    }

}

export const increment_likes = async(req, res)=>{
    const { post_id } = req.body;

    console.log("Recieved ID", post_id);

    try{
        const post = await Post.findById(post_id);

        if(!post){
            return res.status(404).json({message: "Post not found"});
        }

        post.likes = post.likes + 1;
        
        await post.save();

        return res.json({message: "Liked increments", updatedLikes: post.likes});
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}