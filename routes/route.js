import express from 'express';
import { saveSentEmails, getEmails,moveEmailsToBin,toggleStarredEmails,deleteEmails } from '../controller/email-controller.js';
import userController from '../controller/user-controller.js'
// import auth from '../middleware/auth.js';


const routes = express.Router()

routes.post('/register', userController.register);

routes.post('/login', userController.login); 

routes.post('/forgot-password', userController.forgotpassword); 

routes.post('/reset-password/:id', userController.updatepassword); 

routes.post('/save', saveSentEmails)

routes.get('/emails/:type',getEmails)

routes.post('/save-draft',saveSentEmails)

routes.post('/bin', moveEmailsToBin)

routes.post('/starred',toggleStarredEmails)

routes.delete('/delete',deleteEmails)

export default routes;