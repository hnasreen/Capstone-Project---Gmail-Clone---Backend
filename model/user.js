
import mongoose from "mongoose";

// create a schema
const userSchema = new mongoose.Schema({
    username:{ type: String,required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String }
});

// create a model and export it

const user = mongoose.model('users', userSchema);

export default user