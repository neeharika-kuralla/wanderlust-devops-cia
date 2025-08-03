const Listing=require("./models/listing");
const Review=require("./models/review")
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to add listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        
    }
    next();
}
module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById (id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body, { abortEarly: false });
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(", ");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
}

module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body, { abortEarly: false });
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(", ");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,revid}=req.params;
    let review=await Review.findById (revid);
    console.log(id);
    console.log("Review ID:", revid);
console.log("Review found:", review);
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect("/listings");
    }

    if (!review.author || !res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
}

    next();
}