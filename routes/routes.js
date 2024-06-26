import { db } from '../index.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { data } from '../api-data.mjs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function authenticateUser(req, res, next) {
	let jwtToken = req.headers['authorization']; // only taking token from " BEARER 'token' "
	if (jwtToken) {
		jwtToken = jwtToken.split(' ')[1];
	}
	try {
		if (!jwtToken) {
			return res.status(403).json({
				message: 'Token is required',
				warning: 'You are Not Authorized to Access This Content',
			});
		}
		// verifying jwt token
		let decoded = jwt.verify(jwtToken, process.env.SECRET_KEY);
		req.username = decoded.username;
		req.email = decoded.email;
		next();
	} catch (error) {
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ message: 'Invalid token' });
		}
		res
			.status(500)
			.send({ message: 'Internal Server Error - authenticateUser' });
	}
}
async function isUser(email) {
	let isUserRegisteredQuery = `SELECT * FROM users
                WHERE email LIKE "${email}" `;
	let isUserRegistered = await db.get(isUserRegisteredQuery);
	return isUserRegistered ? true : false;
}

const deleteAllUsers = async () => {
	let deleteQ = `DELETE FROM users ;`;
	await db.run(deleteQ);
};

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res
			.status(400)
			.json({ message: 'Email and Password are required.' });
	}
	try {
		let user = await db.get(
			`SELECT * FROM users WHERE email LIKE "${email}" ;`
		);
		if (user) {
			let isPasswordMatched = await bcrypt.compare(password, user.password);
			if (isPasswordMatched) {
				// generating JWT Token
				let payload = { username: user.full_name, email: user.email };
				const jwtToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '2d' });

				res.json({ token: jwtToken, message: 'login Successful' });
			} else {
				res.send({ message: 'Password Incorrect' });
			}
		} else {
			res.status(400).json({ message: 'User Does not Exist' });
		}
	} catch (error) {
		res.status(500).send({ message: 'Internal Server Error - login' });
	}
});
router.get('/', (req, res) => {
	try {
		let filePath = path.join(__dirname, '..', '/views', 'index.html');
		res.sendFile(filePath);
	} catch (error) {
		res.status(500).send({
			message: `Internal Server Error ${error.message} - get`,
		});
	}
});
router.get('/search', async (req, res) => {
	const { q } = req.query;
	const searchProductsQuery = `SELECT * FROM products WHERE name LIKE '%${q}%'
   OR description LIKE '%${q}%' ;`;
	try {
		let productsArray = await db.all(searchProductsQuery);
		res.send(productsArray);
	} catch (error) {
		res.status(500).send({
			message: `Internal Server Error ${error.message} - search`,
		});
	}
});
router.get('/categories/:category', async (req, res) => {
	const { category } = req.params;
	console.log(category);
	try {
		let getProductsQuery = `SELECT * FROM products WHERE category LIKE "${category}";`;
		let productsJson = await db.all(getProductsQuery);
		res.send(productsJson);
	} catch (error) {
		res.status(500).send({
			message: `Internal Server Error ${error.message} - category`,
		});
	}
});
router.get('/getProducts', async (req, res) => {
	try {
		let getProductsQuery = `SELECT * FROM products;`;
		let productsJson = await db.all(getProductsQuery);
		res.send(productsJson);
	} catch (error) {
		res.status(500).send({
			message: `Internal Server Error ${error.message} - getproducts`,
		});
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
		const data = await db.all('SELECT * FROM users;');
		res.json(data);
	} catch (error) {
		console.error(`Database query error: ${error.message}`);
		resstatus(500).send({ message: `Internal Server Error ${error.message}` });
	}
});
router.post('/addUser', async (req, res) => {
	let { email, password, full_name, mobile } = req.body;
	let isUserRegistered = await isUser(email);
	console.log(isUserRegistered);
	if (isUserRegistered) {
		res.status(409).send({ message: 'User already registered.' });
	} else {
		let hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);
		console.log('hashed: ', hashedPassword);
		try {
			let addUserQuery = `INSERT INTO 
            users("email", "password", "full_name", "mobile")
            values("${email}", "${hashedPassword}", "${full_name}", "${mobile}");`;
			await db.run(addUserQuery);
			res.send({ message: `${full_name} Registered successfully.` });
		} catch (error) {
			res
				.status(500)
				.send({ message: `Internal Server Error ${error.message}` });
		}
	}
});
router.delete('/deleteUser', authenticateUser, async (req, res) => {
	let { email } = req.body;

	let isUserRegistered = await isUser(email);
	if (!isUserRegistered) {
		res.send({ message: `User doest not Exist` });
	} else {
		try {
			let deleteUserQuery = `DELETE FROM  users
                    WHERE email LIKE "${email}" ;`;
			await db.run(deleteUserQuery);
			res.send(`User : "${email}" removed successfully.`);
		} catch (error) {
			res.status(500).send(`Internal server error : ${error.message}`);
		}
	}
});
router.put('/updateUser', authenticateUser, async (req, res) => {
	let { email, password, full_name, mobile } = req.body;

	let isUserRegistered = await isUser(email);
	if (!isUserRegistered) {
		res.send('User does not exist.');
	} else {
		try {
			let isFirst = true;
			let updateUserQuery = `UPDATE users SET  `;
			if (password !== undefined) {
				if (isFirst) {
					updateUserQuery += ``;
					isFirst = false;
				} else {
					updateUserQuery += `, `;
				}
				updateUserQuery += `password = "${password}"`;
			}
			if (full_name !== undefined) {
				if (isFirst) {
					updateUserQuery += ``;
					isFirst = false;
				} else {
					updateUserQuery += `, `;
				}
				updateUserQuery += `full_name = "${full_name}"`;
			}
			if (mobile !== undefined) {
				if (isFirst) {
					updateUserQuery += ``;
					isFirst = false;
				} else {
					updateUserQuery += `, `;
				}
				updateUserQuery += `mobile = "${mobile}"`;
			}
			updateUserQuery += ` WHERE email LIKE "${email}" ;`;

			await db.run(updateUserQuery);
			res.send(`User : "${email}" details updated successfully.`);
		} catch (error) {
			res.status(500).send(`Internal server error : ${error.message}`);
		}
	}
});
router.post('/addProductToCart', async (req, res) => {
	let { email, product_id, quantity } = req.body;
	let isUserRegistered = await isUser(email);
	if (!isUserRegistered) {
		res.send('User does not exist.');
	} else {
		try {
			const getProductIdQuery = `SELECT * FROM cart WHERE product_id = ${product_id};`;
			let cartProductId = await db.get(getProductIdQuery);
			console.log(cartProductId);

			if (cartProductId === undefined) {
				let addProductToCartQuery = `INSERT INTO 
                cart("email", "product_id", "quantity")
                values("${email}", ${product_id}, ${quantity});`;
				try {
					await db.run(addProductToCartQuery);
					res.send(`Product added successfully.`);
				} catch (error) {
					res.status(500).send(`Internal server error : ${error.message}`);
				}
			} else {
				let updateProductToCartQuery = `UPDATE cart
                SET quantity =  ${quantity}
                 WHERE email LIKE "${email}" 
                 AND product_id = ${product_id};`;
				try {
					await db.run(updateProductToCartQuery);
					res.send(`Product quantity updated to ${quantity}.`);
				} catch (error) {
					res.status(500).send(`Internal server error : ${error.message}`);
				}
			}
		} catch (error) {
			res.status(500).send(`Internal server error : ${error.message}`);
		}
	}
});
router.delete('/deleteProductFromCart/:product_id', async (req, res) => {
	let { email, product_id } = req.params;
	console.log(req.params);

	try {
		const getProductIdQuery = `SELECT * FROM cart 
        WHERE product_id = ${product_id} 
        AND email LIKE "${email}";`;
		let cartProductId = await db.get(getProductIdQuery);

		if (cartProductId === undefined) {
			res.status(200).send(`Product not found in cart`);
		} else {
			let deleteProductFromCartQuery = `DELETE FROM cart
                WHERE email LIKE "${email}" 
                AND product_id = ${product_id};`;
			try {
				await db.run(deleteProductFromCartQuery);
				res.send(`Product deleted Successfully.`);
			} catch (error) {
				res.status(500).send(`Internal server error : ${error.message}`);
			}
		}
	} catch (error) {
		res.status(500).send(`Internal server error : ${error.message}`);
	}
});
router.get('/createProductTable', async (req, res) => {
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
        );`;
		await db.run(q);
		res.send('createProductTable is successful');
	} catch (error) {
		res.status(500).send(`Internal server error : ${error.message}`);
	}
});
router.post('/addProductsIntoProductsTable', async (req, res) => {
	let q = `INSERT INTO 
    products ("name", "price", "discounted_price", "description", "rating", "stock", "category", "image") `;
	let isFirst = true;
	for (let obj of cereals) {
		let category = 'Cereals';
		let rating = Math.round(Math.random() * 5 + 40) / 10;
		let stock = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
		// console.log(category, rating, stock)
		if (isFirst) {
			q += `VALUES ("${obj.name}", ${obj.price}, ${obj.discounted_price}, "${obj.description}", ${rating}, ${stock}, "${category}", "${obj.image}")`;
			isFirst = false;
		} else {
			q += `,  ("${obj.name}", ${obj.price}, ${obj.discounted_price}, "${obj.description}", ${rating}, ${stock}, "${category}", "${obj.image}")`;
		}
	}
	q += `;`;
	try {
		await db.run(q);
		res.send('vegis added to table');
	} catch (error) {
		res.status(500).send(`Internal server error : ${error.message}`);
	}
});
router.get('/products/:productId', async (req, res) => {
	try {
		let { productId } = req.params;

		let getSingleProductDetailsQuery = `SELECT * FROM products
        WHERE id = ${productId} ;`;
		let productDetails = await db.get(getSingleProductDetailsQuery);
		res.json(productDetails);
	} catch (error) {
		res.status(500).send(`Internal Server Error :${error.message}`);
	}
});
router.get('/getSingleProductDetails/:productId', async (req, res) => {
	let { productId } = req.params;
	try {
		let getSingleProductDetailsQuery = `SELECT * FROM products
        WHERE id = ${productId} ;`;
		let productDetails = await db.get(getSingleProductDetailsQuery);
		res.json(productDetails);
	} catch (error) {
		res.status(500).send(`Internal Server Error : ${error.message}`);
	}
});
router.get('/showRegistrationLoginPage', (req, res) => {
	try {
		let filePath = path.join(__dirname, '../views', 'registerLogin.html');
		res.sendFile(filePath);
	} catch (error) {
		res.status(500).send(`Internal Server Error :${error.message}`);
	}
});

/// DONT USE IT BECAUSE PRODUCTS ALREADY ADDED
router.get('/addProducts', async (req, res) => {
	// const qe = `DELETE FROM products;`;
	// await db.run(qe);

	for (let product of data) {
		let {
			id,
			name,
			price,
			discounted_price,
			description,
			rating,
			stock,
			category,
			image,
		} = product;

		let q = `INSERT INTO 
    products ("id","name", "price", "discounted_price", "description", "rating", "stock", "category", "image")
	VALUES (${id},"${name}", ${price}, ${discounted_price}, "${description}", ${rating}, ${stock}, "${category}", "${image}"); `;

		try {
			await db.run(q);
			console.log(id, name, 'added');
		} catch (error) {
			res.status(500).send(`Internal server error : ${error.message}`);
		}
	}

	res.send('delete successful');

	// try {
	// 	await db.run(q);
	// 	res.send('vegis added to table');
	// } catch (error) {
	// 	res.status(500).send(`Internal server error : ${error.message}`);
	// }
});

export { router };
