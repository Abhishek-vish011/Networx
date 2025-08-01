
import { createSlice } from "@reduxjs/toolkit"
import { getAllCommments, getAllPosts } from "../../action/postAction"


const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    comments: [],
    postId: "",
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: () => initialState,
        resetPostId: (state)=>{
            state.postId = ""
        },
    },
    extraReducers: (builder)=>{
        builder
        .addCase(getAllPosts.pending, (state)=>{
            state.isLoading = true
            state.message = "Fetching all the post.."
        })
        .addCase(getAllPosts.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.postFetched = true;
            state.posts = action.payload.posts.reverse()
        })
        .addCase(getAllPosts.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload
        })
        .addCase(getAllCommments.fulfilled, (state, action)=>{
            state.postId = action.payload.post_id;
            state.comments = action.payload.comments
        })
    }
})
export const { resetPostId } = postSlice.actions;
export default postSlice.reducer