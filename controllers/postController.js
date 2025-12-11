const Post = require("../models/Post");
const Student = require("../models/Student");

const addPost = async (req, res) => {
  try {
    const { userId } = req.params;
    const { postName, description, tags } = req.body;

    if (!userId || !postName || !description || !tags) {
      return res.status(400).json({
        status: false,
        message: "all field are required",
      });
    }

    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({
        status: false,
        message: "student not found",
      });
    }

    const post = new Post({
      userId,
      postName,
      description,
      tags,
    });

    await post.save();
    return res.status(201).json({
      status: true,
      message: "post added successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "error while adding post",
      error: error.message,
    });
  }
};

const getPostsByUserId = async (req,res) =>{

  try {
    const {userId} =req.params;
    if (!userId){
      return res.status(400).json({
        status:false,
        message:"userId is required"
      });
    }

    const post =await Post.find({userId});
    if (!post){
      return res.status(404).json({
        status:false,
        message:"post not found"
      });
    }
   
    return res.status(200).json({
      status:true,
      message:"post fetched successfully",
      post
    });
  }
  catch (error){
    return res.status(500).json({
      status:false,
      message:"error while fetching data",
      error: error.message
    })
  }

}

const getAllPosts = async (req, res) =>{

  try{
    const posts = await Post.find();

    if(posts.length===0){
      return res.status(404).json({
        status:false,
        message:"no posts found"
      });
    }

    return res.status(200).json({
      status:true,
      message:"posts fetched successfully",
      posts
    });

  }
  catch (error){
    return res.status(500).json({
      status:false,
      message:"error while fetching all posts",
      error: error.message
    })
  }
}

const deletePost = async(req, res) =>{

  try{

    const {postId} = req.params;

    if (!postId){
      return res.status(400).json({
        status:false,
        message:"postId is required"
      });
    }

    const post = await Post.findByIdAndDelete(postId);

    if (!post){
      return res.status(404).json({
        status:false,
        message:"post not found"
      });
    }
    return res.status(200).json({
      status:true,
      message:"post deleted successfully",
      post
    });

  }catch (error){
    return res.status(500).json({
      status:false,
      message:"error while deleting post",
      error: error.message
    })
  }
}

const editPost = async (req, res) => {

  try {
    const { postId } = req.params;
    const { postName, description, tags } = req.body;

    if (!postId) {
      return res.status(400).json({
        status: false,
        message: "postId is required",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        status: false,
        message: "post not found",
      });
    }

    // update fields if provided
    if (postName) post.postName = postName;
    if (description) post.description = description;
    if (tags) post.tags = tags;

    await post.save();

    return res.status(200).json({
      status: true,
      message: "post updated successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "error while editing post",
      error: error.message,
    });
  }
}
module.exports = { addPost, 
  getPostsByUserId, 
  getAllPosts, 
  deletePost, 
  editPost 
  


  
};
