const {MongoClient, ObjectId} = require("mongodb")
const multer = require("multer")
const upload = multer();
let db
const express = require("express")
const sannitizeHtml = require("sanitize-html");

function passwordProtection(req, res, next){
    res.set("WWW-Authenticate", "Basic realm='My Mern App'");

    if(req.headers.authorization == "Basic YWRtaW46YWRtaW4="){
        next();
    }else{
            console.log(req.headers.authorization)
            res.status(401).send("Try Again");

    }
}

const app = express()
app.set("view engine", "ejs")
app.set("views" , "./views")
app.use(express.static("public"))

app.use(express.json());
app.use(express.urlencoded({extended : false}))

app.get("/",async (req,res) =>{
    const allAnimals = await db.collection("Animals").find().toArray()
    res.render("home", {allAnimals})
})

app.use(passwordProtection)

app.get("/admin", (req,res) =>{
    res.render("admin")
})

app.get("/api/animal", async (req,res)=>{
    const allAnimals = await db.collection("Animals").find().toArray();
    res.json(allAnimals)

})

app.post("/create-animal", upload.single("photo"), ourCleanup, async(res, req) =>{
    console.log(req.body);
    const info = await db.collection("Animals").insertOne(req.cleanData);
    const newAnimal = await db.collection("Animals").findOne({_id: new ObjectId(info.insertId)})
    res.send(newAnimal)
})

function ourCleanup( res, req, next){
    if(typeof req.body.name != "string") req.body.name = ""
    if(typeof req.body.species != "string") req.body.species = ""
    if(typeof req.body._id != "string") req.body._id = ""

    req.cleanData = {
        name : sannitizeHtml(req.body.name.trim(), {allowedTags : [], allowedAttributes : {}}),
        species : sannitizeHtml(req.body.species.trim(), {allowedTags : [], allowedAttributes : {}}),
    }

    next()
}


async function start(){
    const client = new MongoClient("mongodb://localhost:27017/MyMernApp?&authSource=admin");

    await client.connect();
    db = client.db();
    app.listen(3000)

}
start()
