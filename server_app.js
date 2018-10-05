
const http = require('http');
const Mongo = require('mongodb').MongoClient;
const urlQuery = require('url');

const url = "mongodb://gaurav:gaurav12345@ds025439.mlab.com:25439/mydb";
//const url = "mongodb://localhost:27017/mydb";

const dbName = "mydb";

const port = process.env.PORT || 3000;

const collection = "collection_123";

const server = http.createServer((req,res)=>{

    console.log(req.url);

    if(req.url==='/')
    {
        res.writeHead(200,{'Content-type':'text/html'});
        res.end("Welcome to Server App.....");

    }
    else if (req.url.match("^/create"))
    {
        console.log("requet to create collection");
        res.writeHead(200,{'Content-type':'text/html'});

        // create collection
        createColelction(collection)
        .then((message)=>{
            console.log(message);
            res.end("Done :New Colelction created");

        })
        .catch((error)=>{
            console.log(error);
            res.end("Error :New Colelction not created");

        });
                

    }
    else if (req.url.match("^/insert"))
    {
        console.log("requet to insert data");
        res.writeHead(200,{'Content-type':'text/html'});

        let query = urlQuery.parse(req.url,true).query;

        console.log(query);

        insertData(collection,{RTU:"8DO",Network:5,Status:"EN"})
        .then((message)=>{
            console.log(message);
            res.end("Done :Data Inserted");


        })
        .catch((error)=>{
            console.log(error);
            res.end("Error : Data Not Inserted");

        });
        

    }
    else if (req.url.match("^/find"))
    {
        console.log("requet to find data");
        res.writeHead(200,{'Content-type':'text/html'});

        findData(collection)
        .then((message)=>{
            console.log(message);
          //  res.end(message.length + " Record Found");
            res.end(JSON.stringify(message));

        })
        .catch((error)=>{
            console.log(error);
            res.end("Error : Data Not found");

        });

        

    }
    else if (req.url.match("^/favicon.ico"))
    {
        res.writeHead(204,{'Content-type':'text/html'});
        res.end();
    }
});

server.listen(port ,()=>{
    console.log(`Listening on port ${port} .....`);

});




//------------------ MongoDB -------------------------------


function ConenctDB(dbName)
{
    return new Promise((resolve,reject)=>{

        Mongo.connect(url,{ useNewUrlParser: true },(err,client)=>{

            if(err)
            {
                console.log("Error1: URL connect");
                reject(err);
            }
            else{
                console.log("Mongo URL Connected");

                const db = client.db("mydb");     

                

                resolve({db,client}); // send database object 

            }



        });

    });
 
}


function createColelction(collectionName)
{
  //----------------- Conenct to DB---------------------

  return new Promise((resolve,reject)=>{

        ConenctDB(dbName)
        .then((mongoObj)=>{

        console.log("DB Received");

        let db= mongoObj.db;

        db.createColelction(collection,(err, result)=>{
       
            if(err)
            {
                console.log("Error:Creating Collection " + err);
            }
            else
            {
                console.log("Collection Created");
                console.log(Object.toString(result));
                client.close();
            }

         });
      

        })
        .catch((err)=>{

        console.log("Error:Client Received " + err);
        reject("Error in Client Conenction");
        }); // catch end 


  }); // promise end 




}


function insertData(collectionName,dataObj){

    return new Promise((resolve,reject)=>{

        ConenctDB(dbName)
        .then((mongoObj)=>{

            let db= mongoObj.db;

            db.collection(collectionName).insertOne(dataObj,(err,result)=>{
                if(err)
            {
                console.log("Error:insert data " + err);
            }
            else
            {
                console.log("Inserted");
                console.log(result.result);
                console.log(result.ops); // ops is array of objects
                console.log("No of record inserted =" + result.insertedCount); 

                mongoObj.client.close();

                resolve("Data Inserted");
            }



            });

        })
        .catch((error)=>{

            console.log("Error:Client Received " + error);
            reject("Error in Client Conenction");
        });




    });




}


//-------------------------- Find -----------------------------

function findData(collectionName)
{
    return new Promise((resolve,reject)=>{

        ConenctDB(dbName)
        .then((mongoObj)=>{

            const db= mongoObj.db;
            // find returns array of objects ( of documents in collection) 
            db.collection(collectionName).find({},{projection:{_id:0}}).toArray((err,result)=>{

            if(err)
            {
                console.log("Error:find data" + err);
                reject("Error:find data");
            }
            else
            {
                console.log("Data Found ");
               // console.log(result);
                resolve(result);

            }


        });
    })
    
        .catch((error)=>{

            console.log("Error:Client Received " + err);
            reject("Error in Client Conenction");
        });





    });


}

function errorHandling(message,errObj){

    console.log(message + err);
    reject("Error in Client Conenction");
}