import express from 'express';
import { saveSentEmails, getEmails,moveEmailsToBin,toggleStarredEmails,deleteEmails } from '../controller/email-controller.js';
import userController from '../controller/user-controller.js'
import auth from '../middleware/auth.js';


const routes = express.Router()

routes.post('/register', userController.register);

routes.post('/login', userController.login); 

routes.post('/forgot-password', userController.forgotpassword); 

routes.post('/reset-password/:id', userController.updatepassword); 

routes.post('/save',auth, saveSentEmails)

routes.get('/emails/:type',auth,getEmails)

routes.post('/save-draft',auth,saveSentEmails)

routes.post('/bin',auth, moveEmailsToBin)

routes.post('/starred',auth,toggleStarredEmails)

routes.delete('/delete',auth,deleteEmails)

routes.post('/logout',auth,userController.logOut)

export default routes;