
const mongo = require('mongodb').MongoClient;

// Conenction url
const url = 'mongodb://localhost:27017'; 

const dbName = 'mydb'; // Db name

const dbCollection = 'MyCollection1'; // database collection

/*
    for mongo V 3.1.0 + , use folllowing parameter in connection 

    MongoClient.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true })
*/
mongo.connect(url, { useNewUrlParser: true },(err,client)=>{

    if(err){
        console.log("Error in DB connection : "+ err );

    }
    else{
        console.log("DB Conenction successful !");

        const db = client.db(dbName);

        db.collection(dbCollection).findOne({},(err,result)=>{

            if(err){
                console.log("Error in find: "+ err );
        
            }
            else{
                console.log("Data found : "+ result._id);
                console.log((result));
                console.log(Object.entries(result));
                console.log(Object.values(result));

            }
        })

    //    createCollection(db,()=>{
    //        client.close();

    //    });

        client.close();

    }

});


function createCollection(db,callback){

    db.createCollection('MyCollection1',()=>{

        console.log("Collection Created ...");

        db.collection(dbCollection).insertOne({
            "RTU": "Tiny",
            "Status":"En",
            "Network": 12

        },(err,res)=>{

            if(err){

                console.log("Error In data insert" + err);
            }
            else{

                console.log("Data Inserted Successfully :"+ res.insertedCount + " " + res);

            }

        });






        callback();
    })

}