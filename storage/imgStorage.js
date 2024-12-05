const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './upload');
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + '-' + file.originalname;
      cb(null, filename);
    }
  });
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

  module.exports=upload;