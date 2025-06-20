//Multer takes image from frontend and stores it in the public folder
import multer from "multer";

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})


const upload=multer({storage})
export default upload