const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isloggedin,isOwner,validatelisting}=require("../middleware.js");
const listingController=require("../controllers/listing.js")
const multer =require('multer');
const{storage}=require("../cloudConfig.js");
const upload=multer({storage });


router.route("/")
.get(wrapAsync(listingController.index))//Index route;
.post(isloggedin,upload.single ('listing[image]'),validatelisting,wrapAsync(listingController.createListings));//craete route

router.route("/trending")
.get(wrapAsync(listingController.trendingFilter));

router.route("/rooms")
.get(wrapAsync(listingController.roomFilter));
router.route("/artic")
.get(wrapAsync(listingController.articFilter));

router.route("/iconiccities")
.get(wrapAsync(listingController.citiesFilter));
router.route("/mountains")
.get(wrapAsync(listingController.mountainFilter));

router.route("/castles")
.get(wrapAsync(listingController.castlesFilter));
router.route("/pools")
.get(wrapAsync(listingController.poolsFilter));

router.route("/camping")
.get(wrapAsync(listingController.campingFilter));
//new route
router.get("/new",isloggedin,listingController.renderNewForm);
 
router.route("/:id")
.get(wrapAsync(listingController.showListing))//show route
.put(isloggedin,isOwner,upload.single ('listing[image]'),validatelisting,wrapAsync(listingController.updateListings))//Update Route
.delete(isloggedin,isOwner,wrapAsync(listingController.deleteListing));//Delete route

//Edit route
router.get("/:id/edit",isloggedin,isOwner,wrapAsync(listingController.renderEditForm));
 
module.exports=router;
