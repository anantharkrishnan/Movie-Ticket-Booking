const { cloudinaryInstance } = require("../config/cloudinary")
const movie = require("../models/movieModel")
const Rating =require("../models/ratingModel")


const createMovie = async (req, res) => {
  try {
    let posterUrl = null;
    let posterPublicId = null;
    let backdropUrl = null;
    let backdropPublicId = null;
    let castData = [];

    console.log("FILES:", req.files);
    console.log("BODY:", req.body);

   
    if (
      req.files &&
      req.files.posterUrl &&
      Array.isArray(req.files.posterUrl) &&
      req.files.posterUrl.length > 0
    ) {
      const file = req.files.posterUrl[0];

      const uploadResult = await cloudinaryInstance.uploader.upload(file.path, {
        folder: "movies/posters",
      });

      posterUrl = uploadResult.secure_url;
      posterPublicId = uploadResult.public_id;
    }

  
    if (!posterUrl && req.body.posterUrl) {
      posterUrl = req.body.posterUrl;
    }

  
    if (!posterUrl) {
      return res.status(400).json({
        error: "posterUrl is required — upload a file or send a URL",
      });
    }

   
    if (req.files && req.files["backdropUrl"] && req.files["backdropUrl"][0]) {
      const uploadBackdrop = await cloudinaryInstance.uploader.upload(
        req.files["backdropUrl"][0].path,
        { folder: "movies/backdrops" }
      );
      backdropUrl = uploadBackdrop.secure_url;
      backdropPublicId = uploadBackdrop.public_id;
    }

 
    if (req.files && req.files["castImages"] && req.body.cast) {
      const castArray = JSON.parse(req.body.cast);

      for (let i = 0; i < castArray.length; i++) {
        const castMember = castArray[i];
        const castImageFile = req.files["castImages"][i];

        let castImageUrl = "";
        let castImagePublicId = "";

        if (castImageFile) {
          const uploadCast = await cloudinaryInstance.uploader.upload(
            castImageFile.path,
            { folder: "movies/cast" }
          );
          castImageUrl = uploadCast.secure_url;
          castImagePublicId = uploadCast.public_id;
        }

        castData.push({
          name: castMember.name,
          role: castMember.role,
          image: castImageUrl,
          imagePublicId: castImagePublicId,
        });
      }
    }

    
    const newMovie = await movie.create({
      ...req.body,
      posterUrl,
      posterPublicId,
      backdropUrl,
      backdropPublicId,
      cast: castData,
    });

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: newMovie,
    });
  } catch (error) {
    console.error("Error in createMovie:", error);
    res.status(500).json({ error: error.message });
  }
};


const getAllMovies = async(req,res)=>{
    try {
    
  const movies = await movie.find();

  const result = [];

  for (let movie of movies) {
    const ratings = await Rating.find({ movie: movie._id });

    const count = ratings.length;
    const average =
      count === 0
        ? 0
        : Number(
            (
              ratings.reduce((sum, r) => sum + r.rating, 0) / count
            ).toFixed(1)
          );

    result.push({
      ...movie.toObject(),
      averageRating: average,
      ratingCount: count
    });
  }

  res.json({ success: true, data: result });
}

     catch (error) {
         console.log(error);
        res.status(error.status||500).json({error:error.message})
    }
}
const getMovieById = async(req,res)=>{
    try {
        const movieId = await movie.findById(req.params.id)
        if(!movie){
            return res.status(404).json({message:"movie not found"})

        }
        res.status(200).json({data:movieId})
    } catch (error) {
        console.log(error);
        res.status(error.status||500).json({error:error.message})
    }
}
const updateMovie = async (req, res) => {
  try {
    const existingMovie = await movie.findById(req.params.id);
    if (!existingMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    let posterUrl = existingMovie.posterUrl;
    let posterPublicId = existingMovie.posterPublicId;
    let backdropUrl = existingMovie.backdropUrl;
    let backdropPublicId = existingMovie.backdropPublicId;

    
    if (req.files?.posterUrl) {
      if (posterPublicId) {
        await cloudinaryInstance.uploader.destroy(posterPublicId);
      }

      const uploadPoster = await cloudinaryInstance.uploader.upload(
        req.files.posterUrl[0].path,
        { folder: "movies/posters" }
      );

      posterUrl = uploadPoster.secure_url;
      posterPublicId = uploadPoster.public_id;
    }

   
    if (req.files?.backdropUrl) {
      if (backdropPublicId) {
        await cloudinaryInstance.uploader.destroy(backdropPublicId);
      }

      const uploadBackdrop = await cloudinaryInstance.uploader.upload(
        req.files.backdropUrl[0].path,
        { folder: "movies/backdrops" }
      );

      backdropUrl = uploadBackdrop.secure_url;
      backdropPublicId = uploadBackdrop.public_id;
    }

    const updatedMovie = await movie.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        posterUrl,
        posterPublicId,
        backdropUrl,
        backdropPublicId,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedMovie,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

    const deleteMovie= async(req,res)=>{
        try {
            const movieDelete = await movie.findByIdAndDelete(req.params.id)
                     if(!movie){
            return res.status(404).json({message:"movie not found"})

        }
        res.status(200).json({message:"movie deleted succesfully",data:movieDelete})
        } catch (error) {
             console.log(error);
        res.status(error.status||500).json({error:error.message})
        }
    }

module.exports={createMovie,getAllMovies,getMovieById,updateMovie,deleteMovie}