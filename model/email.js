import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema({
    to:{
        type: String,
        required:true
    },
    from:{
        type: String,
        required:true
    },
    subject: String,
    body:String,
    date:{
        type:Date,
        required:true
    },
    image:String,
    name:{
        type: String,
        required:true
    },
    starred:{
        type: Boolean,
        required:true,
        default:false
    },
    bin:{
        type:Boolean,
        required:true,
        default:false
    },
    type:{
        type:String,
        required:true
    },
    read: { 
        type: Boolean, 
        default: false
    } ,
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
})

const email = mongoose.model('emails',EmailSchema)

export default email;