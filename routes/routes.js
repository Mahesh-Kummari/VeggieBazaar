import { db} from '../index.js'; 
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const SECRET_KEY = 'my_secret_key_123';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

async function authenticateUser(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and Password are required.' });
    }
    try {
        let user = await db.get(`SELECT * FROM users WHERE email LIKE "${email}" ;`);
        if (user !== undefined){
            let isPasswordMatched = await bcrypt.compare(password, user.password);
            if( isPasswordMatched){
                req.user = email;
                next();
            }else{
                res.send("Incorrect username or password")
            }
        }
    } catch (error) {
        res.status(500).send('Internal Server Error - authenticateUser');
    }
}
async function isUser(email){
    let isUserRegisteredQuery = `SELECT * FROM users
                WHERE email LIKE "${email}" `;
    let isUserRegistered = await db.get(isUserRegisteredQuery);
    return isUserRegistered ? true : false ;
};
function generateJWTToken(user){
    jwt.sign({email : user.email}, SECRET_KEY, {expiresIn: '3d'});
};
async function verifyJWTToken(req, res, next){
    let jwtToken = req.headers.authorization;
    if(!jwtToken){
        res.status(401).send(`Provide Valid JWT token.`)
    }else{
        try {
            let result = await jwt.verify(jwtToken, SECRET_KEY);
            return result;
        } catch (error) {
            throw new Error(`Invalid token: ${error.message}`);
        }
    }
}
const deleteAllUsers = async ()=>{
    let deleteQ = `DELETE FROM users ;`;
    await db.run(deleteQ)
}

router.get('/', (req, res)=>{
    try{
        let filePath = path.join(__dirname,  "..", "/views", "index.html");
        res.sendFile(filePath);
    }catch(error){
        res.status(500).send(`Internal Server Error : ${error.message}`);
    }
    deleteAllUsers()
    
});
router.get('/getProducts', async (req, res)=>{
    try {
        let getProductsQuery = `SELECT * FROM products;`;
        let productsJson = await db.all(getProductsQuery);
        res.send(productsJson);
    } catch (error) {
        res.status(500).send(`Internal Server Error : ${error.message}`);
    }
});
router.get('/cart', async (req, res) => {
    try {
        const data = await db.all('SELECT * FROM cart');
        res.json(data);
    } catch (error) {
        console.error(`Database query error: ${error.message}`);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/users', async (req, res) => {
    try {
        const data = await db.all('SELECT * FROM users');
        res.json(data);
    } catch (error) {
        console.error(`Database query error: ${error.message}`);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/addUser', async (req, res)=>{
    let {email, password, full_name , mobile} = req.body;

    let isUserRegistered = await isUser(email);
    if (isUserRegistered){
        res.send("User already registered.");
    }else{
        let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        console.log("hashed: ", hashedPassword);
        try{
            let addUserQuery = `INSERT INTO 
            users("email", "password", "full_name", "mobile")
            values("${email}", "${hashedPassword}", "${full_name}", "${mobile}");`;
            await db.run(addUserQuery);
            res.send(`User : "${full_name}" added successfully.`)
        }catch(error){
            res.status(500).send(`Internal server error : ${error.message}`)
        }
    }
});
router.delete('/deleteUser', authenticateUser, async (req, res)=>{
    let {email} = req.body;

    let isUserRegistered = await isUser(email);
    if (!isUserRegistered){
        res.send("User does not exist.");
    }else{
        try{
            let deleteUserQuery = `DELETE FROM  users
                    WHERE email LIKE "${email}" ;`;
            await db.run(deleteUserQuery);
            res.send(`User : "${email}" removed successfully.`)
        }catch(error){
            res.status(500).send(`Internal server error : ${error.message}`)
        }
    }
});
router.put('/updateUser',authenticateUser, async (req, res)=>{
    let {email, password, full_name , mobile} = req.body;

    let isUserRegistered = await isUser(email);
    if (!isUserRegistered){
        res.send("User does not exist.");
    }else{
        try{
            let isFirst = true;
            let updateUserQuery = `UPDATE users SET  `
            if (password !== undefined){
                if (isFirst){
                    updateUserQuery += ``
                    isFirst = false
                }else{
                    updateUserQuery += `, `
                }
                updateUserQuery += `password = "${password}"`
            }
            if (full_name !== undefined){
                if (isFirst){
                    updateUserQuery += ``
                    isFirst = false
                }else{
                    updateUserQuery += `, `
                }
                updateUserQuery += `full_name = "${full_name}"`
            }
            if (mobile !== undefined){
                if (isFirst){
                    updateUserQuery += ``
                    isFirst = false
                }else{
                    updateUserQuery += `, `
                }
                updateUserQuery += `mobile = "${mobile}"`
            }
            updateUserQuery += ` WHERE email LIKE "${email}" ;`;

            await db.run(updateUserQuery);
            res.send(`User : "${email}" details updated successfully.`)
        }catch(error){
            res.status(500).send(`Internal server error : ${error.message}`)
        }
    }
});
router.post('/addProductToCart', async (req, res)=>{
    let {email, product_id, quantity } = req.body;
    let isUserRegistered = await isUser(email);
    if (!isUserRegistered){
        res.send("User does not exist.");
    }else{
        try {
            const getProductIdQuery = `SELECT * FROM cart WHERE product_id = ${product_id};` 
            let cartProductId = await db.get(getProductIdQuery);
            console.log(cartProductId);
        
            if (cartProductId === undefined){
                let addProductToCartQuery = `INSERT INTO 
                cart("email", "product_id", "quantity")
                values("${email}", ${product_id}, ${quantity});`;
                try{
                    await db.run(addProductToCartQuery);
                    res.send(`Product added successfully.`);
                }catch(error){
                    res.status(500).send(`Internal server error : ${error.message}`)
                }
            }
            else{
                let updateProductToCartQuery = `UPDATE cart
                SET quantity =  ${quantity}
                 WHERE email LIKE "${email}" 
                 AND product_id = ${product_id};`;
                try{
                    await db.run(updateProductToCartQuery);
                    res.send(`Product quantity updated to ${quantity}.`);
                }catch(error){
                    res.status(500).send(`Internal server error : ${error.message}`)
                }
            } 
        }catch(error) {
            res.status(500).send(`Internal server error : ${error.message}`)
        }
        
    }
});
router.delete('/deleteProductFromCart/:product_id&:email', async (req, res)=>{
    let {email, product_id } = req.params;
    console.log(req.params);

    try {
        const getProductIdQuery = `SELECT * FROM cart 
        WHERE product_id = ${product_id} 
        AND email LIKE "${email}";` ;
        let cartProductId = await db.get(getProductIdQuery);
    
        if (cartProductId === undefined){
                res.status(200).send(`Product not found in cart`)
        }else{
            let deleteProductFromCartQuery = `DELETE FROM cart
                WHERE email LIKE "${email}" 
                AND product_id = ${product_id};`;
            try{
                await db.run(deleteProductFromCartQuery);
                res.send(`Product deleted Successfully.`);
            }catch(error){
                res.status(500).send(`Internal server error : ${error.message}`)
            }
        } 
    }catch(error) {
        res.status(500).send(`Internal server error : ${error.message}`)
    }
});
router.get('/createProductTable', async (req, res)=>{
    try {
        let q = `CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        discounted_price INTEGER NOT NULL,
        description TEXT,
        rating REAL,
        stock INTEGER NOT NULL,
        category TEXT NOT NULL
        );`
        await db.run(q);
        res.send("createProductTable is successful")
    } catch (error) {
        res.status(500).send(`Internal server error : ${error.message}`)
    } 
});
router.post('/addProductsIntoProductsTable', async (req, res)=>{ 
    let q = `INSERT INTO 
    products ("name", "price", "discounted_price", "description", "rating", "stock", "category", "image") `
    let isFirst = true;
    for (let obj of cereals){
        let category = "Cereals";
        let rating = Math.round(Math.random() * 5 + 40) / 10;
        let stock =  Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
        // console.log(category, rating, stock)
        if(isFirst){
            q += `VALUES ("${obj.name}", ${obj.price}, ${obj.discounted_price}, "${obj.description}", ${rating}, ${stock}, "${category}", "${obj.image}")`
            isFirst = false;
        }else{
            q += `,  ("${obj.name}", ${obj.price}, ${obj.discounted_price}, "${obj.description}", ${rating}, ${stock}, "${category}", "${obj.image}")`
        }
        
    }
    q += `;`
    try {
        await db.run(q);
        res.send("vegis added to table")
    } catch (error) {
        res.status(500).send(`Internal server error : ${error.message}`)
    }
    
});
router.get('/showSingleProductPage/:productId',  (req, res)=>{
    
    try{
        let filePath = path.join(__dirname,  "../views", "singleProduct.html");
        res.sendFile(filePath);
    }catch(error){
        res.status(500).send(`Internal Server Error :${error.message}`);
    }
});
router.get('/getSingleProductDetails/:productId', async (req, res)=>{
    let {productId} = req.params;
    try {
        let getSingleProductDetailsQuery = 
        `SELECT * FROM products
        WHERE id = ${productId} ;`;
        let productDetails = await db.get(getSingleProductDetailsQuery);
        res.json(productDetails);
    } catch (error) {
        res.status(500).send(`Internal Server Error : ${error.message}`);
    }
});
router.get('/showRegistrationLoginPage',  (req, res)=>{
    try{
        let filePath = path.join(__dirname,  "../views", "registerLogin.html");
        res.sendFile(filePath);
    }catch(error){
        res.status(500).send(`Internal Server Error :${error.message}`);
    }
});

export {router};