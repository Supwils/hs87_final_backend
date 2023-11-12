const mongoose = require('mongoose');
const User = mongoose.model('user');
const Profile = mongoose.model('profile');

async function getHeadline(req, res) {
    try {

        const username = req.params.user || req.username;
        // Find the logged in user
        const user = await Profile.findOne({ username: username});
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        // Send the user's headline
        res.send({ username: username, headline: user.headline });
    } catch (error) {
        console.error('Failed to get headline:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

async function updateHeadline(req, res) {
    const newHeadline = req.body.headline;
    if (typeof newHeadline !== 'string' || newHeadline.trim() === '') {
        return res.status(400).send({ message: 'Bad Request: Non-empty headline required.' });
    }

    try {
        // Find the logged in user
        const user = await Profile.findOne({ username: req.username });
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        // Update the user's headline
        user.headline = newHeadline.trim();
        await user.save();

        // Send success response
        res.send({ username: req.username, headline: user.headline });
    } catch (error) {
        console.error('Failed to update headline:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

async function getEmail(req,res) {
    try{
        const username = req.params.user || req.username;
        const user = await Profile.findOne({username: username});
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        res.send({username: username, email: user.email});
    }
    catch(error){
        console.error('Failed to get email:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

async function updateEmail(req,res){
    try{
        const user = await Profile.findOne({username: req.username});
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        user.email = req.body.email;
        await user.save();
        res.send({username: req.username, email: user.email});
    }
    catch(error){
        console.error('Failed to update email:', error);
        res.status(500).send({ error: 'Internal Server Error' });
}
}

async function getDob(req,res){
    try{
        const username = req.params.user || req.username;
        const user = await Profile.findOne({username: username});
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        res.send({username: username , dob: user.dob});
    }
    catch(error){
        console.error('Failed to get dob:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

async function getZipcode(req,res){
    try{
        const username = req.params.user || req.username;
        const user = await Profile.findOne({username: username});
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        res.send({username: username, zipcode: user.zipcode});     
    }
    catch(error){
        console.error('Failed to get zipcode:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

async function changeZipcode(req,res){
    try{
        const user = await Profile.findOne({username:req.username});
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        user.zipcode = req.body.zipcode;
        await user.save();
        res.send({username: req.username, zipcode: user.zipcode});
    }
    catch(error){
        console.error('Failed to update zipcode:', error);
        res.status(500).send({ error: 'Internal Server Error' });
}
}
async function getAvatar(req,res){
    try{
        const username = req.params.user || req.username;
        const user = await Profile.findOne({username: username});
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        res.send({username: username, avatar: user.avatar});
    }
    catch(error){
        console.error('Failed to get avatar:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

async function changeAvatar(req,res){
    try{
        const user = await Profile.findOne({username:req.username});
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        user.avatar = req.body.avatar;
        await user.save();
        res.send({username: req.username, avatar: user.avatar});
    }
    catch(error){
        console.error('Failed to update avatar:', error);
        res.status(500).send({ error: 'Internal Server Error' });
}
}
async function getPhone(req,res){
    try{
        const username = req.params.user || req.username;
        const user = await Profile.findOne({username: username});
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        res.send({username: username, phone: user.phone});
    }
    catch(error){
        console.error('Failed to get phone:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

async function updatePhone(req,res){
    try{
        const user = await Profile.findOne({username:req.username});
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        user.phone = req.body.phone;
        await user.save();
        res.send({username: req.username, phone: user.phone});
    }
    catch(error){
        console.error('Failed to update phone:', error);
        res.status(500).send({ error: 'Internal Server Error' });
} 
}




module.exports = (app) => {
    app.get('/headline/:user?', getHeadline);
    app.put('/headline', updateHeadline);
    app.get('/email/:user?', getEmail);
    app.put('/email', updateEmail)
    app.get('/phone/:user?', getPhone)
    app.put('/phone', updatePhone)
    app.get('/dob/:user?', getDob)
    app.get('/zipcode/:user?', getZipcode)
    app.put('/zipcode', changeZipcode)
    app.get('/avatar/:user?', getAvatar)
    app.put('/avatar', changeAvatar)
    //app.put('/avatar1', uploadImage('avatar'), uploadAvatar)
};
