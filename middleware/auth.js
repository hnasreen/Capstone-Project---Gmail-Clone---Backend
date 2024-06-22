// import jwt from 'jsonwebtoken'
// import User from '../model/user.js';

// const auth = async (request, response, next) => {
//         try {
//             // const token = request.cookies.token;
//             const token = request.headers.authorization?.split(' ')[1];
//             console.log(`AuthJS file Token:${token}`)
//             if (!token) {
//                 return response.status(401).json({ message: 'Unauthorized' });
//             }

//             try {
//                 const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//                 request.user = await User.findById(decodedToken.id).select('-password'); 
//                 next();
//             } catch (error) {
//                 return response.status(401).json({ message: 'Invalid token' });
//             }
//         } catch (error) {
//             response.status(500).json({ message: error.message });
//         }
//     }


// // export the auth object
// export default auth;

import jwt from 'jsonwebtoken';
import User from '../model/user.js';

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization.split(' ')[1];;

        console.log(`AuthJS file Token:${authHeader}`)

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Missing token' });
        }

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decodedToken.id).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }

            req.user = user; // Attach user object to request
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default auth;