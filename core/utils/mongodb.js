let mongoose = require('mongoose');
const config = require('../config/config.json')

const server = config['mongodb']['host'] + ':' + config['mongodb']['port']
const database = config['mongodb']['db'];
const username = config['mongodb']['username'];
const password = config['mongodb']['password'];

class MongoDbConnection {
  constructor() {
    this._connect()
  }
  
_connect() {
  if ((username.trim() == "") || (username.trim() == undefined)) {
    // If no username specified, try to connect without authentication
    console.log('Trying to connect without using authentication')

    mongoose.connect(`mongodb://${server}/${database}`, {useNewUrlParser: true, useUnifiedTopology: true})
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
  else {
    // Try to connect using URI with authentication
    console.log('Trying to connect using username & password authentication')

    mongoose.connect(`mongodb://${username}:${password}@${server}/${database}?authSource=admin`, {useNewUrlParser: true, useUnifiedTopology: true})
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error: '+err)
       })
  }
  }
}

module.exports = new MongoDbConnection()