

// // import multer from 'multer';

// // const storage = multer.memoryStorage();

// // const fileFilter = (req, file, cb) => {
// //   const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/bmp'];
// //   if (allowedMimeTypes.includes(file.mimetype)) {
// //     cb(null, true);
// //   } else {
// //     cb(new Error('Invalid file type. Only image files (JPG, PNG, WEBP, GIF, SVG, BMP) are allowed'), false);
// //   }
// // };

// // const upload = multer({ storage, fileFilter });

// // export default upload;

// import multer from "multer";

// const storage = multer.memoryStorage();

// const allowedMimeTypes = [
//   // Images
//   "image/jpeg",
//   "image/png",
//   "image/webp",
//   "image/gif",
//   "image/svg+xml",
//   "image/bmp",

//   // Videos
//   "video/mp4",
//   "video/webm",
//   "video/quicktime",
//   "video/x-msvideo",
//   "video/mpeg",
// ];

// const fileFilter = (req, file, cb) => {
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error(
//         "Invalid file type. Only JPG, PNG, WEBP, GIF, SVG, BMP, MP4, WEBM, MOV, AVI and MPEG files are allowed"
//       ),
//       false
//     );
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,

//   // Optional: 100 MB maximum file size
//   limits: {
//     fileSize: 100 * 1024 * 1024,
//   },
// });

// export default upload;

import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/bmp",

  // Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "video/mpeg",
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, PNG, WEBP, GIF, SVG, BMP, MP4, WEBM, MOV, AVI and MPEG files are allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,

  // Optional: 100 MB maximum file size
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

export default upload;