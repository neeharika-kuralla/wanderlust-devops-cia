if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");

const mongo_url=process.env.MONGO_URL ||"mongodb://127.0.0.1:27017/wanderlust";
const path=require("path");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const store=MongoStore.create({
    mongoUrl:mongo_url,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
})

store.on("error", (err) => {
    console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires:Date.now()+7*24*60*60* 1000,
        maxAge:7*24*60*60* 1000,
        httpOnly:true
    },
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

  
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null;
    next();
});

main().then(()=>{
    console.log("Connected to DB"); 
}).catch((err)=>{
    console.log(err);
}) 
    async function main() {
        await mongoose.connect(mongo_url);
    }


app.engine('ejs',ejsmate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        application: "Wanderlust"
    });
});

app.get("/", (req, res) => {
    res.redirect("/listings");
});
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.use((req, res, next) => {
    res.status(404).render("404");
});
app.use((err,req,res,next)=>{
    let{status=500,message="Something went Wrong!"}=err;
    res.status(status).render("error.ejs",{message});
    // res.status(status).send(message);
})
app.listen (3000,()=>{
    console.log("Server is listening to port 8080"); 
})