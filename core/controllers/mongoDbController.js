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

    updateSingleRecord: async function(mongoModel, recId, record) {
        return new Promise((resolve, reject) => {
            mongoModel
                .findOneAndUpdate( 
                    { _id: recId }, 
                    record,
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
    },

    getLastNRecords: async function(mongoModel, n, sortColumn, order) {
        // order = 1 ==> ASC
        // order = -1 ==> DESC

        var sortJson = {};
        sortJson[sortColumn] = order;
        
        return new Promise((resolve, reject) => {
            mongoModel
                .find()
                .sort(sortJson)
                .limit(n)
                .then(stats => { resolve(stats); })
                .catch(err => { reject({ "error": err }); })
        });
    },

    filterRecords: async function(mongoModel, criteria) {
        // Criteria must be an array containing criteria written in json.
        // supported criteria: greater (gt), greater equal (gte), equals (eq), less (lt), 
        //                     less equal (lte), included (in), not equals (ne), not included (nin)
        // Each json must have the following keys:
        //            -- field: the column/field name that will be filtered
        //            -- op: one of [gt, gte, eq, lt, lte, in, ne, nin]
        //            -- value: value that field will be filtered
        // included (in) & not included (nin) operations takes as value field an array with values


        var filteringJson = {};
        for (var i=0;i<criteria.length;i++) {
            const c = criteria[i]
            
            if(["eq", "ne", "gt", "gte", "lt", "lte", "in", "nin"].indexOf(c["op"]) > -1) {
                if(!(c["field"] in filteringJson)) {
                    filteringJson[c["field"]] = {};
                }
                filteringJson[c["field"]]["$"+c["op"]] = c["value"];
            }
            else {
                console.error("Cannot identify required operation. Ignoring criteria " + JSON.stringify(c));
            }
        }
        
        return new Promise((resolve, reject) => {
            mongoModel
                .find(filteringJson, function(err, result) {
                    if(err) {
                        console.error(err);
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
        });
    },

    filterLastNRecords: async function(mongoModel, criteria, n, sortColumn, order) {
        // Criteria must be an array containing criteria written in json.
        // supported criteria: greater (gt), greater equal (gte), equals (eq), less (lt), 
        //                     less equal (lte), included (in), not equals (ne), not included (nin)
        // Each json must have the following keys:
        //            -- field: the column/field name that will be filtered
        //            -- op: one of [gt, gte, eq, lt, lte, in, ne, nin]
        //            -- value: value that field will be filtered
        // included (in) & not included (nin) operations takes as value field an array with values

        // order = 1 ==> ASC
        // order = -1 ==> DESC

        var sortJson = {};
        sortJson[sortColumn] = order;

        var filteringJson = {};
        for (var i=0;i<criteria.length;i++) {
            const c = criteria[i]
            
            if(["eq", "ne", "gt", "gte", "lt", "lte", "in", "nin"].indexOf(c["op"]) > -1) {
                if(!(c["field"] in filteringJson)) {
                    filteringJson[c["field"]] = {};
                }
                filteringJson[c["field"]]["$"+c["op"]] = c["value"];
            }
            else {
                console.error("Cannot identify required operation. Ignoring criteria " + JSON.stringify(c));
            }
        }

        return new Promise((resolve, reject) => {
            mongoModel
                .find(filteringJson)
                .sort(sortJson)
                .limit(n)
                .then((records) => {
                    resolve(records);
                })
                .catch((err) => {
                    console.log(err);
                    reject({ "error": err });
                });
        });
    }
}