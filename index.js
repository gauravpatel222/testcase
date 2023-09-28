const express=require("express")
const app=express();
const path=require("path");
const pathpublic=path.join(__dirname,'/public')
const view_path=path.join(__dirname+'/views')

/**
 * back end mongoos
 */

const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/quote", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
});

const quote_schema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    quote:{
        type:String,
        trim:true,
    }
})
const quote_model=new mongoose.model('quote_model',quote_schema);
/*
const quote1 = new quote_model({
    name: "Gaurav Guzzar",
    quote: "abb to bada admi ban jaunga"
  });
  
  // Create the second quote instance
  const quote2 = new quote_model({
    name: "Gaurav Guzzar",
    quote: "failure is orphan"
  });
quote1.save();
quote2.save();*/
const getDocument=async()=>{
    const result=await quote_model.find().select({name:1});
    console.log(result);
}
//getDocument();


/* --------------------- */

app.use(express.urlencoded({ extended: true }));

app.set("views engine","ejs");
app.set("views",view_path)
app.use(express.static(pathpublic));

app.get("/", async(req,res)=>{
   let quotesprinted = await quote_model.find({});
    //console.log(quotesprinted)
    res.render('home.ejs',{quotesprinted});
})

app.get("/add",(req,res)=>{
    res.render('add.ejs')
})
app.get("/all",async (req,res)=>{
    let quotesprinted = await quote_model.find({});
   // console.log(quotesprinted)
    res.render('all.ejs',{quotesprinted});
})

app.post('/',async (req,res)=>{
    console.log(req.body);
    let{name,quote} = req.body;
    await quote_model.create({name,quote});
    res.redirect('/');
})
// show
app.get('/show/:id',async (req,res)=>{
    let {id}=req.params;
    let found = await quote_model.findById(id)
    res.render("show.ejs",{found})
    console.log(found);
    
    
   // let found = await Quote.findById(id);
    //res.render('show',{found})
})

app.listen(3000,(err)=>{
console.log("connection successfullll")
})
