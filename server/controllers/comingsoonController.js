const { cloudinaryInstance } = require("../config/cloudinary")
const comingsoon = require("../models/comingSoonModel")



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

   
    const newMovie = await comingsoon.create({
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
        const movies= await comingsoon.find().sort({createdAt:-1})
        res.status(200).json({count:movies.length,data:movies})
    } catch (error) {
         console.log(error);
        res.status(error.status||500).json({error:error.message})
    }
}
const getMovieById = async(req,res)=>{
    try {
        const movieId = await comingsoon.findById(req.params.id)
        if(!comingsoon){
            return res.status(404).json({message:"movie not found"})

        }
        res.status(200).json({data:movieId})
    } catch (error) {
        console.log(error);
        res.status(error.status||500).json({error:error.message})
    }
}
const updateMovie= async(req,res)=>{
    try {
        const movieUpdate= await comingsoon.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
         if(!comingsoon){
            return res.status(404).json({message:"movie not found"})

        }
        res.status(200).json({data:movieUpdate})

    } catch (error) {
        console.log(error);
        res.status(error.status||400).json({error:error.message})
    }
    }
    const deleteMovie= async(req,res)=>{
        try {
            const movieDelete = await comingsoon.findByIdAndDelete(req.params.id)
                     if(!comingsoon){
            return res.status(404).json({message:"movie not found"})

        }
        res.status(200).json({message:"movie deleted succesfully",data:movieDelete})
        } catch (error) {
             console.log(error);
        res.status(error.status||500).json({error:error.message})
        }
    }

module.exports={createMovie,getAllMovies,getMovieById,updateMovie,deleteMovie}