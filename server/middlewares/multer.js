const multer = require("multer")
const storage= multer.diskStorage({
    filename:function(req,file,cb){
        console.log(file);
        cb(null,file.originalname)
        
    }
})

const upload= multer({storage:storage})
const movieUpload = upload.fields([
  { name: "posterUrl", maxCount: 1 },
  { name: "backdropUrl", maxCount: 1 },
  { name: "castImages", maxCount: 20 }, 
]);
module.exports=movieUpload