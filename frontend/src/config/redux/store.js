import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./reducer/authReducer"
import postReducer from "./reducer/postReducer"

/**
 * STEPS for state Management
 * Submit Action
 * Handle action in it's reducer
 * Register here -> reducer
 */


export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
    }
})