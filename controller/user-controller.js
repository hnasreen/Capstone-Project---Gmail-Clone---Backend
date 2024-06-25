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
            const user = await User.findOne({ email });

            if (!user) {
                return response.status(400).json({ message: 'User not found' });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (!isPasswordCorrect) {
                return response.status(400).json({ message: 'Invalid password' });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            user.resetToken = token;
            await user.save();

            const cookieOptions = {
                httpOnly: true,
                sameSite: 'none',
                maxAge:  24 * 60 * 60 * 1000 // 24 hours from now
            };
            console.log(`userresetTokenLogin ${user.resetToken}`)
            response.status(200).cookie('jwt', token, cookieOptions).json({ message: 'User login successful.' });
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    },

    forgotpassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            user.resetToken = token;
            await user.save();

            console.log(`userresetTokenForgotPassword ${user.resetToken}`)

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
                text: `https://capstone-project-gmail-clone-backend.onrender.com/reset-password/${user._id}`
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

        const token = req.headers.authorization.split(' ')[1];
        const { password } = req.body;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const passwordHash = await bcrypt.hash(password, 10);

            await User.findByIdAndUpdate(decoded.id, { password: passwordHash });
            res.json({ success: true, message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating password' });
            console.log(error)
        }}
       
    
};

export default userController;