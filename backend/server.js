import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));

const start = async () =>{
    const connectDB = await mongoose.connect("mongodb+srv://abhivishwa012002:2blDn7vRegYW8NpQ@networxconnect.vzf73nj.mongodb.net/?retryWrites=true&w=majority&appName=Networxconnect")

    app.listen(9080, ()=>{
        console.log("Server is running on port 9080");
    })
}
start();