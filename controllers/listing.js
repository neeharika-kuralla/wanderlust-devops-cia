
const Listing = require("../models/listing");

// Index route
module.exports.index = async (req, res) => {
    const { q } = req.query;
    let allListings;

    if (q && q.trim()) {
        const regex = new RegExp(escapeRegex(q.trim()), "i");

        allListings = await Listing.find({
            $or: [
                { title: regex },
                { location: regex },
                { category: regex },
                { country: regex }
            ]
        });

        if (allListings.length === 0) {
            req.flash("error", "No results found for your search.");
            return res.redirect("/listings");
        }
    } else {
        allListings = await Listing.find({});
    }

    res.render("listings/index", { allListings, q });
};

// Helper function to escape special regex characters
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// New listing form
module.exports.renderNewForm = (req, res) => {
    const categories = [
        "Trending",
        "Rooms",
        "Iconic Cities",
        "Mountains",
        "Castles",
        "Amazing Pools",
        "Camping",
        "Artic"
    ];

    res.render("listings/new.ejs", {
        category: categories,
        listing: {}
    });
};

// Show listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

// Create listing
module.exports.createListings = async (req, res) => {
    const url = req.file.path;
    const filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);

    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };

    await newlisting.save();

    req.flash("success", "New Listing Created!");
    return res.redirect("/listings");
};

// Edit listing form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let original = listing.image.url;
    original = original.replace("/upload", "/upload/w_150");

    const category = await Listing.schema.path("category").enumValues;

    res.render("listings/edit.ejs", {
        listing,
        original,
        category
    });
};

// Update listing
module.exports.updateListings = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing }
    );

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;

        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    return res.redirect(`/listings/${id}`);
};

// Delete listing
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;

    const deletedlisting = await Listing.findByIdAndDelete(id);

    if (!deletedlisting) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing Deleted!");
    return res.redirect("/listings");
};

// Helper function for category filters
async function filterListings(req, res, category, errorMessage) {
    const allListings = await Listing.find({ category })
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (allListings.length === 0) {
        req.flash("error", errorMessage);
        return res.redirect("/listings");
    }

    return res.render("listings/index.ejs", { allListings });
}

// Trending category
module.exports.trendingFilter = async (req, res) => {
    return filterListings(req, res, "Trending", "No Listings in Trending Category");
};

// Rooms category
module.exports.roomFilter = async (req, res) => {
    return filterListings(req, res, "Rooms", "No Listings in Rooms Category");
};

// Iconic cities category
module.exports.citiesFilter = async (req, res) => {
    return filterListings(req, res, "Iconic Cities", "No Listings in Iconic Cities Category");
};

// Mountains category
module.exports.mountainFilter = async (req, res) => {
    return filterListings(req, res, "Mountains", "No Listings in Mountains Category");
};

// Castles category
module.exports.castlesFilter = async (req, res) => {
    return filterListings(req, res, "Castles", "No Listings in Castles Category");
};

// Amazing pools category
module.exports.poolsFilter = async (req, res) => {
    return filterListings(req, res, "Amazing Pools", "No Listings in Amazing Pools Category");
};

// Camping category
module.exports.campingFilter = async (req, res) => {
    return filterListings(req, res, "Camping", "No Listings in Camping Category");
};

// Arctic category
module.exports.articFilter = async (req, res) => {
    return filterListings(req, res, "Artic", "No Listings in Artic Category");
};
