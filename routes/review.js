const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validatereview,isloggedin,isReviewAuthor}=require("../middleware.js");
const reviewcontroller=require("../controllers/reviews.js")

//review 
// post route
router.post("/",isloggedin,validatereview,wrapAsync(reviewcontroller.postReview));

//delete review route
router.delete("/:revid",isloggedin,isReviewAuthor,wrapAsync(reviewcontroller.deleteReview));

module.exports=router;