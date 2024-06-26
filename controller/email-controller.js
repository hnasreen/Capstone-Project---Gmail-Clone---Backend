import Email from "../model/email.js"
import mongoose from "mongoose"

export const saveSentEmails=(request, response)=>{
    try{
        let user = {...request.body,userID:new mongoose.Types.ObjectId(request.body.userID)}
        console.log(user)
       const email =  new Email(user)
       email.save()
       response.status(200).json('email saved successfully');
    }catch(error){
        response.status(500).json(error.message)
    }
}

export const getEmails = async(request,response)=>{
    try{
        let emails;
        let userID=new mongoose.Types.ObjectId(request.query.userID)
        if(request.params.type === 'bin'){
            emails = await Email.find({bin:true,userID})
        }else if(request.params.type === 'allmail'){
            emails = await Email.find({userID})
        }else if (request.params.type === 'starred'){
            emails = await Email.find({starred:true,bin:false,userID})
        }else if (request.params.type === 'sent'){
            emails = await Email.find({ type: 'sent',userID });
        }else if(request.params.type === 'inbox'){
            emails = await Email.find({ type: 'sent' ,userID}); //Changed the type to sent to show the sent emails in the inbox.
            await markEmailsAsRead(emails);
        }
        else{  
        emails = await Email.find({type:request.params.type})
        }
        return response.status(200).json(emails);
    }catch(error){
        console.log(error);
        response.status(500).json(error.message)
    }
}

async function markEmailsAsRead(emails) {
    try {
        await Promise.all(emails.map(async (email) => {
            if (!email.read) {
                email.read = true;
                await email.save();
            }
        }));
    } catch (error) {
        console.error('Error marking emails as read:', error);
    }
}

export const moveEmailsToBin = async(request,response)=>{
    try{
        await Email.updateMany({_id:{$in: request.body}},{$set:{bin:true, starred:false,type:''}})
        return response.status(200).json('emails deleted successfully');
    }catch(error){
        console.log(error);
        response.status(500).json(error.message)
    }
}

export const toggleStarredEmails = async (request,response)=>{
    try{
        await Email.updateOne({_id:request.body.id},{$set:{starred:request.body.value}})
        return response.status(200).json('emails is starred mark');
    }catch(error){
        console.log(error);
        response.status(500).json(error.message)
    }
}

export const deleteEmails = async(request,response)=>{
    try{
        await Email.deleteMany({_id:{$in:request.body}})
        return response.status(200).json('emails deleted successfully');
    }catch(error){
        console.log(error);
        response.status(500).json(error.message)
    }
}
