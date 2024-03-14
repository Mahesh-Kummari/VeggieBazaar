import express from 'express';
import  sqlite3  from 'sqlite3';
import {open} from 'sqlite';
import path , {dirname} from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import router from './routes/routes.js'; 

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

let dbPath = path.join(__dirname, "database.db");
let db = null;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const  initializeDBandServer = async ()=>{
    try{
        db = await open({
            filename : dbPath,
            driver : sqlite3.Database
        });
        app.use('/', router);
        app.listen(3000, ()=>{
            console.log("Server running at http://localhost:3000");
        });
    }catch(error){
        console.log(`DB Error : ${error.message}`);
        process.exit(1);
    }
    
};
initializeDBandServer();


export {db, __dirname, path} ;



