import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const Connection = () => {
    try{

        const MONGODB_URI = `mongodb+srv://hnasreen1993:${process.env.DB_PASSWORD}@mongodb1.mqllmd1.mongodb.net/gmailclone?`
        mongoose.connect(MONGODB_URI)

        console.log('database connected successfully')
    }catch(error){
        console.log('Error while connecting with the database',error.message)
    }
}

export default Connection;