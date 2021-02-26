module.exports = {
    getAllCollection: async function(mongoModel) {
        return new Promise((resolve, reject) => {
            mongoModel.find({}, function(err, result) {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    },

    deleteAllFromCollection: async function(mongoModel) {
        return new Promise((resolve, reject) => {
            mongoModel.remove({}, function(err, result) {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    },

    getSubCollection: async function(mongoModel, key) {
        return new Promise((resolve, reject) => {
            mongoModel.find({}, function(err, result) {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(result[0][key]);
                }
            });
        });
    },

    insertRecord: async function(record) {
        return new Promise((resolve, reject) => {
            record.save()
                .then(doc => { resolve({ "success": "New record inserted!" }); })
                .catch(err => { reject({ "error": err }); })
        });
    },

    insertBatchRecords: async function(collection, records) {
        return new Promise((resolve, reject) => {
            collection.insertMany(records, function(err, docs) {
                if(err) {
                    reject({ "error": err });
                }
                else {
                    resolve({ "success": docs["insertedCount"] + " new records inserted!" });
                }
            });
        });
    },

    updateRecord: async function(mongoModel, recId, colName, colValue) {
        var updated = {};
        updated[colName] = colValue;

        return new Promise((resolve, reject) => {
            mongoModel
                .findOneAndUpdate( 
                    { _id: recId }, 
                    { $set: updated },
                    { new: true, runValidators: true }
                )
                .then(doc => { resolve({ "success": "Records updated!" }); })        
                .catch(err => { reject({ "error": err }); })
        });
    },

    getRecord: async function(mongoModel, recId) {
        return new Promise((resolve, reject) => {
            mongoModel
                .findOne( 
                    { _id: recId }
                )
                .then(doc => { resolve(doc); })        
                .catch(err => { reject({ "error": err }); })
        });
    }
}