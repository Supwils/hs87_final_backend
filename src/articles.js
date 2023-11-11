const moongoose = require('mongoose');
const articleSchema = require('./articleSchema');
const e = require('express');
const articles = moongoose.model('articles', articleSchema);
const connectionString = 'mongodb+srv://huahaoshang2000:Soho7436..@hs87-rice.htqq8u4.mongodb.net/?retryWrites=true&w=majority'

//get the current logged in user articles by req.username
async function getArticles(req, res) {
    const id = req.params.id; // This could be undefined if no ID is specified
    const username = req.username; // Assuming this is somehow set, maybe through middleware

    try {
        await moongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

        // If an ID is provided, fetch a specific article
        if(id && /^\d+$/.test(id)) {
            const item = await articles.findOne({ id: id }).exec(); // Assuming _id is the MongoDB default primary key
            if (!item) {
                return res.status(404).send({ message: 'Article not found.' });
            }
            return res.send({ article: item });
        }
        else if (id) {
            const item = await articles.findOne({ author: id }).exec(); // Assuming _id is the MongoDB default primary key
            if (!item) {
                return res.status(404).send({ message: 'Article not found.' });
            }
            return res.send({ article: item }); 
        }


        // If no ID is provided, fetch all articles for the user
        const items = await articles.find({ author: username }).exec();
        return res.send({ articles: items });

    } catch (error) {
        console.error('Error getting articles:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}


async function addArticle(req, res){
    const username = req.username;
    const text = req.body.text;

    try {
        // Connect to MongoDB
        await moongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        // Find the article with the largest ID
        const lastArticle = await articles.findOne().sort({ id: -1 }).limit(1);
        const lastId = lastArticle ? lastArticle.id : 0;

        const newArticle = new articles({
            id: lastId + 1,
            author: username,
            text: text,
            date: new Date(),
            comments: []
        });

        // Save the new article
        await newArticle.save();

        res.status(201).send(newArticle);

    } catch (error) {
        console.error('Error adding article:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}
async function editArticle(req, res) {
    const id = parseInt(req.params.id); // Make sure to convert id to an integer if it's stored as a number
    const text = req.body.text;

    if (!text) {
        return res.status(400).send({ message: 'Text is required to update the article.' });
    }

    try {
        // Connect to MongoDB
        await moongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        // Update the article
        const updatedArticle = await articles.findOneAndUpdate(
            { id: id }, 
            { $set: { text: text } }, 
            { new: true } // Return the updated document
        );
        if (req.username !== updatedArticle.author) {
            return res.status(403).send({ message: 'Forbidden: You can only edit your own articles.' });
        }
        if (!updatedArticle) {
            return res.status(404).send({ message: 'Article not found.' });
        }

        res.status(200).send(updatedArticle);
    } catch (error) {
        console.error('Error editing article:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}


module.exports = (app) => {
    //app.get('/articles/', getArticles);
    app.get('/articles/:id?', getArticles);
    app.post('/articles/', addArticle);
    app.put('/articles/:id', editArticle);

}