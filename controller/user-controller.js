import User from '../model/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const userController = {
    register: async (request, response) => {
        try {
            const { username, email, password } = request.body;
            const user = await User.findOne({ username });

            if (user) {
                return response.status(400).json({ message: 'Username already exists' });
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = new User({
                username: username,
                password: passwordHash,
                email: email
            });

            const savedUser = await newUser.save();
            response.json({ success: true, message: 'User registered', user: savedUser });
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    },

    login: async (request, response) => {
        try {
            const { email, password } = request.body;
            const user= await User.findOne({ email });
            console.log(user._id)

            if (!user) {
                return response.status(400).json({ message: 'User not found' });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (!isPasswordCorrect) {
                return response.status(400).json({ message: 'Invalid password' });
            }

            const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '24h' });
            // user.resetToken = token;
            await user.save();

            const cookieOptions = {
                httpOnly: true,
                // sameSite: true,
                maxAge:  24 * 60 * 60 * 1000, // 24 hours from now
                // domain:"localhost"
            };
            // console.log(`userresetTokenLogin ${user.resetToken}`)
            response.status(200).cookie('jwt', token, cookieOptions).json({ message: 'User login successful.',userId: user._id} );
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    },

    forgotpassword: async (req, res) => {
        try {
            const token = req.cookies.jwt;
            const { email } = req.body;
            const user = await User.findOne({ email });
            console.log(`Token in forgotpassword: ${token}`)

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await user.save();

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'hnasreen1993@gmail.com',
                    pass: process.env.PASS
                }
            });

            var mailOptions = {
                from: 'hnasreen1993@gmail.com',
                to: email,
                subject: 'Reset Password Link',
                text: `http://localhost:3000/reset-password/${user._id}/${token}`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Error sending email' });
                } else {
                    return res.json({ success: true, message: 'Reset password link sent' });
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updatepassword: async (req, res) => {

        // const token = req.headers.authorization.split(' ')[1];
        const token = req.cookies.jwt;
        const { password } = req.body;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const passwordHash = await bcrypt.hash(password, 10);

            await User.findByIdAndUpdate(decoded.id, { password: passwordHash });
            res.json({ success: true, message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating password' });
            console.log(error)
        }},

    // logOut: async (request,response)=>{

    //     try {
    //         // Clear the JWT cookie by setting an expired cookie
    //         response.cookie('jwt', '', {
    //             httpOnly: true,
    //             expires: new Date(0), // Set expiration date to a past date
    //             // sameSite: true, // Adjust as per your requirements
    //             // domain: 'localhost', // Optionally specify domain
    //         });
    
    //         response.status(200).json({ message: 'Logged out successfully' });
    //     } catch (error) {
    //         response.status(500).json({ message: error.message });
    //     }

    // }
       
    
};

export default userController;