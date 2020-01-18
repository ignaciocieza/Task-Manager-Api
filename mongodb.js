
/**CRUD: create read update delete
 * 
 * Create: insertOne | insertMany
 * read: findOne | find
 * update: updateOne | updateMany
 * delete: deleteOne | deleteMany
 */


const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://localhost:27017';
const databaseName = 'task-manager';
const id = new ObjectID();//generador de id

MongoClient.connect(connectionURL, { useUnifiedTopology: true , useNewUrlParser:true }, (error, client) => {
    if (error) {
        return console.log("unable to connect to database")
    };

    const db = client.db(databaseName);
    db.collection('users').insertOne({
        _id: id,
        name:'pablix',
        age:29
    },(error,result)=>{
        if(error){
            return console.error('unable to insert user')
        }

        console.log(result.ops);
    });

    // db.collection('users').insertMany([
    //     {
    //         name: 'nacho',
    //         age: 27
    //     },
    //     {
    //         name: 'pablo',
    //         age: 28
    //     },
    //     {
    //         name: 'francisco',
    //         age: 29
    //     },
    // ], (error, result) => {
    //     if (error) {
    //         return console.error('unable to insert user')
    //     }
    //     console.log(result.ops);
    // });

});