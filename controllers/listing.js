const Listing=require("../models/listing");

module.exports.index=async(req,res)=>{
    // const allListings=await Listing.find({});
    // res.render("listings/index.ejs",{allListings});
    const { q } = req.query;
    let allListings;
    if (q) {
        const regex = new RegExp(escapeRegex(q), 'i'); // case-insensitive match
        allListings = await Listing.find({
            $or: [
                { title: regex },
                { location: regex },
                { category: regex },
                { country: regex },
            ]
        });
        if (allListings.length === 0) {
            req.flash("error", "No results found for your search.");
            return res.redirect("/listings");
        }
    } else {
        req.flash("error", "No such place exists.");
        allListings = await Listing.find({});
    }

    res.render("listings/index", { allListings, q });
};

// Helper to escape special regex characters in user input
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports.renderNewForm = (req, res) => {
    const categories = ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Artic"];
    res.render("listings/new.ejs", { category: categories, listing: {} });
};
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");    
        res.redirect("/listings");
    }
    else{
        console.log(listing); 
        res.render("listings/show.ejs",{listing});
    }
};
module.exports.createListings=async(req,res,next)=>{

    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id; 
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");    
        res.redirect("/listings");
    }
    else{
        let original=listing.image.url;
        original=original.replace("/upload","/upload/w_150");
        let category=await Listing.schema.path("category").enumValues;
        res.render("listings/edit.ejs",{listing,original,cate});
    } 
    
};



module.exports.updateListings=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

module.exports.trendingFilter=async(req,res)=>{
    let allListings=await Listing.find({category:"Trending"}).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!allListings){
        req.flash("error","No Listings in Trending Category");    
        res.redirect("/listings");
    }
    else{
        console.log(allListings); 
        res.render("listings/index.ejs", {allListings});
    };

}

module.exports.roomFilter=async(req,res)=>{
    let allListings=await Listing.find({category:"Rooms"}).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!allListings){
        req.flash("error","No Listings in Rooms Category");    
        res.redirect("/listings");
    }
    else{
        console.log(allListings); 
        res.render("listings/index.ejs", {allListings});
    };

}

module.exports.citiesFilter=async(req,res)=>{
    let allListings=await Listing.find({category:"Iconic Cities"}).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!allListings){
        req.flash("error","No Listings in Iconic Cities Category");    
        res.redirect("/listings");
    }
    else{
        console.log(allListings); 
        res.render("listings/index.ejs", {allListings});
    };

}
module.exports.mountainFilter=async(req,res)=>{
    let allListings=await Listing.find({category:"Mountains"}).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!allListings){
        req.flash("error","No Listings in Mountains Category");    
        res.redirect("/listings");
    }
    else{
        console.log(allListings); 
        res.render("listings/index.ejs", {allListings});
    };

}
module.exports.castlesFilter=async(req,res)=>{
    let allListings=await Listing.find({category:"Castles"}).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!allListings){
        req.flash("error","No Listings in Castles Category");    
        res.redirect("/listings");
    }
    else{
        console.log(allListings); 
        res.render("listings/index.ejs", {allListings});
    };

}
module.exports.poolsFilter=async(req,res)=>{
    let allListings=await Listing.find({category:"Amazing Pools"}).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!allListings){
        req.flash("error","No Listings in Amazing Pools Category");    
        res.redirect("/listings");
    }
    else{
        console.log(allListings); 
        res.render("listings/index.ejs", {allListings});
    };

}
module.exports.campingFilter=async(req,res)=>{
    let allListings=await Listing.find({category:"Camping"}).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!allListings){
        req.flash("error","No Listings in Camping Category");    
        res.redirect("/listings");
    }
    else{
        console.log(allListings); 
        res.render("listings/index.ejs", {allListings});
    };

}
module.exports.articFilter=async(req,res)=>{
    let allListings=await Listing.find({category:"Artic"}).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!allListings){
        req.flash("error","No Listings in Artic Category");    
        res.redirect("/listings");
    }
    else{
        console.log(allListings); 
        res.render("listings/index.ejs", {allListings});
    };

}
