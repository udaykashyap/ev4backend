
const express = require('express');
const jwt = require('jsonwebtoken');
const PostModel = require('../Models/post.model');

const postRouter = express.Router()



//getting all posts from db
postRouter.get('/', async (req, res) => {
    let token = req.headers.authorization;
    const decoded = jwt.verify(token, "Random");


    let query = {}
    if (min && max) {
        query.no_of_comments = { $gte: parseInt(min), $lte: parseInt(max) }
    }


    try {
        if (decoded) {
            let data = await PostModel.find({ "userID": decoded.userID });
            res.status(200).send(data);
        } else {
            res.status(404).send({ msg: "No Post Avaliable" })
        }
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

//getting by pagination;

postRouter.get('/pagination', async (req, res) => {
    const { page, limit } = req.query;
    const pageNumber = +page || 1;
    const pageLimit = +limit || 3;

    const pagination = pageNumber * pageLimit - pageLimit || 0;

    let token = req.headers.authorization;
    const decoded = jwt.verify(token, "Random");

    try {
        if (decoded) {
            let data = await PostModel.find({ "userID": decoded.userID }).skip(pagination).limit(pageLimit);
            res.status(200).send(data);
        } else {
            res.status(404).send({ msg: "No Post Avaliable" })
        }
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})


//add notes to db

postRouter.post('/add', async (req, res) => {
    try {
        let data = PostModel(req.body);
        await data.save();
        res.status(200).send({ msg: 'Post added successfully' })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

// update notes

postRouter.patch('/update/:ID', async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "Random");
    const ID = req.params.ID;
    const mat1 = decoded.userID
    const result = await PostModel.findOne({ _id: ID });
    const mat2 = result.userID
    const payload = req.body;

    if (mat1 === mat2) {
        await PostModel.findByIdAndUpdate({ _id: result._id }, payload)
        res.status(200).send({ msg: "Updated successfully" })
    } else {
        res.status(400).send({ msg: "Update failed" })
    }
    // console.log(mat1, mat2)
    // console.log(result)
})

//delete the note


postRouter.delete('/delete/:ID', async (req, res) => {

    const ID = req.params.ID;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "Random");
    const mat1 = decoded.userID

    const result = await PostModel.findOne({ _id: ID });
    const mat2 = result.userID

    if (mat1 === mat2) {
        await PostModel.findByIdAndDelete({ _id: result._id })
        res.status(200).send({ msg: "Deleted successfully" })
    } else {
        res.status(400).send({ msg: "Deleted failed" })
    }
    //console.log(mat1, mat2)
})

module.exports = postRouter
