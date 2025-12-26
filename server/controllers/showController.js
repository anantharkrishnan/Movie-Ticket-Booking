const show = require("../models/showModel");
const Theatre = require("../models/theatreModel");

// CREATE SHOW
const createShow = async (req, res) => {
  try {
    const { movie, theatre, screen, date, time, seatLayout } = req.body;

    if (!movie || !theatre || !screen || !date || !time || !seatLayout) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if show already exists
    const existingShow = await show.findOne({ movie, theatre, screen, date, time });
    if (existingShow) {
      return res.status(409).json({ message: "Show already exists for this date & time" });
    }

    // Save seatLayout from frontend directly
    const newShow = await show.create({
      movie,
      theatre,
      screen,
      date,
      time,
      seatLayout, 
    });

    res.status(201).json({
      message: "Show created successfully",
      data: newShow,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


const updateShow = async (req, res) => {
  try {
    const { screen, date, time, seatLayout } = req.body;

    const updatedFields = { screen, date, time };
    if (seatLayout) updatedFields.seatLayout = seatLayout; 

    const updatedShow = await show.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!updatedShow) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.status(200).json({
      message: "Show updated successfully",
      data: updatedShow,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};


const fetchShowById = async (req, res) => {
  try {
    const showById = await show.findById(req.params.id)
      .populate("movie")
      .populate("theatre");

    if (!showById) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.status(200).json({ data: showById });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const fetchAllShows = async (req, res) => {
  try {
    const shows = await show.find()
      .populate("movie", "title")
      .populate("theatre", "name location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


const fetchShowsByMovie = async (req, res) => {
  try {
    const shows = await show.find({ movie: req.params.movieId })
      .populate("theatre")
      .populate("movie");

    res.status(200).json({ data: shows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteShow = async (req, res) => {
  try {
    const showDelete = await show.findByIdAndDelete(req.params.id);

    if (!showDelete) {
      return res.status(404).json({ message: "Show not found" });
    }

    
    await Theatre.findByIdAndUpdate(showDelete.theatre, {
      $pull: { shows: showDelete._id },
    });

    res.status(200).json({
      message: "Show deleted successfully",
      data: showDelete,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createShow,
  fetchAllShows,
  fetchShowById,
  updateShow,
  fetchShowsByMovie,
  deleteShow,
};

