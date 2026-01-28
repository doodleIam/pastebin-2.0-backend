import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

const connectionOption = {}

mongoose
    .connect(uri,connectionOption)
    .then(()=>{
        console.log("mongodb connected successfully")
    })
    .catch((err)=>{
        console.error("mongodb connect error:",err)
    })

export default mongoose.connection