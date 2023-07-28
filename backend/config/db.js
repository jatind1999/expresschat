const mongoose = require('mongoose');
const colors = require('colors')

const connectDB = async () => {
    try{
        // c stands for connection object
        const c = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB Connected: ${c.connection.host}`.green.bold);
    }catch(error){
        console.log(`Error: ${error}`.red.bold);
        process.exit();
    }
}

module.exports = connectDB;
