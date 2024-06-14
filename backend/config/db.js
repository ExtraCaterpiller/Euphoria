const mongoose = require('mongoose')
const uri = process.env.MONGODB_URI;

const connectionDB = async () => {
    mongoose.connect(uri, {                        
        writeConcern: {
            w: 'majority',
            j: true,
            wtimeoutMS: 1,
        }
    })

    const connection = mongoose.connection
    connection.once('open', ()=>{
        console.log("MongoDB connected");
    })
}

module.exports = connectionDB;