const mongoose2 = require('mongoose')
require('dotenv').config();

const uri =`mongodb+srv://${process.env.USERBD}:${process.env.PASSWORDBD}@clusteradso2669734.kgcnjnc.mongodb.net/${process.env.BD}?retryWrites=true&w=majority`;

mongoose2.connect(uri);

module.exports= mongoose2;