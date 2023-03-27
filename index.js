const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connection = require('./db');
const userRouter = require('./Route/user.Router');
const postRouter = require('./Route/post.Router');
const { auth } = require('./Middleware/auth.middleware');


const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(cors())


app.use('/user', userRouter)
app.use(auth)
app.use("/post", postRouter)

app.listen(port, async () => {
    await connection;
    console.log('Connected to MongoDB')
    console.log('listening on port ' + port);
})