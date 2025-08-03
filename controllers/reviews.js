const Review=require("../models/review");
const Listing=require("../models/listing");
module.exports.postReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview =new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing.id}`)
};

module.exports.deleteReview=async(req,res)=>{
    let{id,revid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:revid}});
    await Review.findByIdAndDelete(revid);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};