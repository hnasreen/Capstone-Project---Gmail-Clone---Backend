import express from 'express';
import Connection from './database/db.js';
import routes from './routes/route.js';
import cors from 'cors';
import morgan from 'morgan'
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))

app.use(express.urlencoded({extended:true}))

app.use(express.json({extended:true}))

app.use(morgan('dev'));

app.use(cookieParser());

app.use('/',routes)

const PORT = process.env.PORT || 8000;

Connection();

app.listen(PORT,()=> console.log(`Server has started on PORT ${PORT}`))