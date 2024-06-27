import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';
import User from '../model/user.js';

configDotenv();

const auth = async (request, response, next) => {
            console.log("All Cookies: ", request.cookies); 
            const token = request.cookies.jwt;
            console.log(token)

            try {

            if (!token) {
                return response.status(401).json({ message: 'Unauthorized' });
            }

                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

                const user = await User.findById(decodedToken.id);

                // const user = await User.findOne({
                //     email:decodedToken.email
                // })
                console.log(user)
                if(!user){
                    return response.status(401).json({message:"Invalid Token. User not found"})
                }

                request.user = user

                next();
            
        } catch (error) {
            console.log("Error:",error)
            response.status(500).json({ message: "Invalid Token"});
        }
    }


// export the auth object
export default auth