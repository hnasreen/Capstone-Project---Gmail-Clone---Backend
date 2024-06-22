import Email from "../model/email.js"


export const saveSentEmails=async (request, response)=>{
    try{
        const userId = request.user._id;
       const email =  new Email({ ...request.body, user: userId })
       await email.save()
       response.status(200).json('email saved successfully');
    }catch(error){
        response.status(500).json(error.message)
    }
}

export const getEmails = async(request,response)=>{
    try{

        const userId = request.user._id;
        let emails;

        if(request.params.type === 'bin'){
            emails = await Email.find({bin:true, user: userId })
        }else if(request.params.type === 'allmail'){
            emails = await Email.find({ user: userId })
        }else if (request.params.type === 'starred'){
            emails = await Email.find({starred:true,bin:false, user: userId})
        }
        else{  
        emails = await Email.find({type:request.params.type, user: userId})
        }
        return response.status(200).json(emails);
    }catch(error){
        console.log(error);
        response.status(500).json(error.message)
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