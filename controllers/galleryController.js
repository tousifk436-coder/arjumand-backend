// import Gallery from "../models/Gallery.modal.js";
// import { apiResponse } from "../utils/apiResponse.js";
// import { asyncHandler } from "../utils/asynchandler.js";
// import mongoose from "mongoose";

// // URL ko clean array mein convert karne ke liye
// const normalizeImageUrls = (url) => {
//   const urls = Array.isArray(url) ? url : [url];

//   return [
//     ...new Set(
//       urls
//         .filter((item) => typeof item === "string")
//         .map((item) => item.trim())
//         .filter(Boolean),
//     ),
//   ];
// };

// // CREATE GALLERY ITEM
// const createGallery = asyncHandler(async (req, res) => {
//   try {
//     const { title, url, isActive } = req.body;

//     // if (!title || title.trim() === "") {
//     //   return res
//     //     .status(400)
//     //     .json(new apiResponse(400, null, "Gallery title is required"));
//     // }

//     const imageUrls = normalizeImageUrls(url);

//     if (imageUrls.length === 0) {
//       return res
//         .status(400)
//         .json(
//           new apiResponse(
//             400,
//             null,
//             "At least one image is required to create a gallery",
//           ),
//         );
//     }

//     // Check whether any supplied image already exists
//     const existingImages = await Gallery.findOne({
//       url: { $in: imageUrls },
//     }).select("title url");

//     if (existingImages) {
//       const duplicateUrls = existingImages.url.filter((item) =>
//         imageUrls.includes(item),
//       );

//       return res.status(409).json(
//         new apiResponse(
//           409,
//           {
//             duplicateUrls,
//             existingGalleryTitle: existingImages.title,
//           },
//           "One or more gallery images already exist. Please upload different images",
//         ),
//       );
//     }

//     const gallery = await Gallery.create({
//       title: title.trim(),
//       url: imageUrls,
//       isActive: isActive !== undefined ? isActive : true,
//     });

//     res
//       .status(201)
//       .json(new apiResponse(201, gallery, "Gallery added successfully"));
//   } catch (error) {
//     res
//       .status(500)
//       .json(
//         new apiResponse(
//           500,
//           null,
//           `Failed to create gallery: ${error.message}`,
//         ),
//       );
//   }
// });

// // GET ALL GALLERY ITEMS
// const getAllGallery = asyncHandler(async (req, res) => {
//   try {
//     const {
//       isPagination = "true",
//       page = 1,
//       limit = 10,
//       search,
//       isActive,
//       sortBy = "recent",
//     } = req.query;

//     const currentPage = Math.max(Number(page) || 1, 1);
//     const pageLimit = Math.max(Number(limit) || 10, 1);

//     const match = {};

//     if (isActive !== undefined) {
//       match.isActive = isActive === "true";
//     }

//     if (search && search.trim()) {
//       match.title = {
//         $regex: search.trim(),
//         $options: "i",
//       };
//     }

//     const pipeline = [{ $match: match }];

//     if (sortBy === "oldest") {
//       pipeline.push({ $sort: { createdAt: 1 } });
//     } else {
//       pipeline.push({ $sort: { createdAt: -1 } });
//     }

//     const totalArr = await Gallery.aggregate([
//       ...pipeline,
//       { $count: "count" },
//     ]);

//     const total = totalArr[0]?.count || 0;

//     if (isPagination === "true") {
//       pipeline.push(
//         {
//           $skip: (currentPage - 1) * pageLimit,
//         },
//         {
//           $limit: pageLimit,
//         },
//       );
//     }

//     const gallery = await Gallery.aggregate(pipeline);

//     res.status(200).json(
//       new apiResponse(
//         200,
//         {
//           gallery,
//           totalGallery: total,
//           totalPages:
//             isPagination === "true" ? Math.ceil(total / pageLimit) : 1,
//           currentPage,
//         },
//         "Gallery items fetched successfully",
//       ),
//     );
//   } catch (error) {
//     res.status(500).json(new apiResponse(500, null, error.message));
//   }
// });

// // GET SINGLE GALLERY ITEM
// const getGalleryById = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res
//         .status(400)
//         .json(new apiResponse(400, null, "Invalid gallery ID"));
//     }

//     const gallery = await Gallery.findById(id);

//     if (!gallery) {
//       return res
//         .status(404)
//         .json(new apiResponse(404, null, "Gallery item not found"));
//     }

//     res
//       .status(200)
//       .json(new apiResponse(200, gallery, "Gallery item fetched successfully"));
//   } catch (error) {
//     res.status(500).json(new apiResponse(500, null, `Error: ${error.message}`));
//   }
// });

// // UPDATE GALLERY ITEM
// const updateGallery = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, url, isActive } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res
//         .status(400)
//         .json(new apiResponse(400, null, "Invalid gallery ID"));
//     }

//     const existingGallery = await Gallery.findById(id);

//     if (!existingGallery) {
//       return res
//         .status(404)
//         .json(new apiResponse(404, null, "Gallery item not found"));
//     }

//     const updateData = {};

//     // if (title !== undefined) {
//     //   if (!title || title.trim() === "") {
//     //     return res
//     //       .status(400)
//     //       .json(new apiResponse(400, null, "Gallery title is required"));
//     //   }

//     //   updateData.title = title.trim();
//     // }

//     if (url !== undefined) {
//       const imageUrls = normalizeImageUrls(url);

//       if (imageUrls.length === 0) {
//         return res
//           .status(400)
//           .json(
//             new apiResponse(
//               400,
//               null,
//               "At least one gallery image is required",
//             ),
//           );
//       }

//       // Current gallery ko  duplicate image check
//       const duplicateGallery = await Gallery.findOne({
//         _id: { $ne: id },
//         url: { $in: imageUrls },
//       }).select("title url");

//       if (duplicateGallery) {
//         const duplicateUrls = duplicateGallery.url.filter((item) =>
//           imageUrls.includes(item),
//         );

//         return res.status(409).json(
//           new apiResponse(
//             409,
//             {
//               duplicateUrls,
//               existingGalleryTitle: duplicateGallery.title,
//             },
//             "One or more images already exist in another gallery",
//           ),
//         );
//       }

//       updateData.url = imageUrls;
//     }

//     if (isActive !== undefined) {
//       updateData.isActive = isActive;
//     }

//     const updatedGallery = await Gallery.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     res
//       .status(200)
//       .json(
//         new apiResponse(200, updatedGallery, "Gallery updated successfully"),
//       );
//   } catch (error) {
//     res.status(500).json(new apiResponse(500, null, `Error: ${error.message}`));
//   }
// });

// // DELETE GALLERY ITEM
// const deleteGallery = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res
//         .status(400)
//         .json(new apiResponse(400, null, "Invalid gallery ID"));
//     }

//     const deletedGallery = await Gallery.findByIdAndDelete(id);

//     if (!deletedGallery) {
//       return res
//         .status(404)
//         .json(new apiResponse(404, null, "Gallery item not found"));
//     }

//     res
//       .status(200)
//       .json(
//         new apiResponse(200, deletedGallery, "Gallery deleted successfully"),
//       );
//   } catch (error) {
//     res.status(500).json(new apiResponse(500, null, `Error: ${error.message}`));
//   }
// });

// export {
//   createGallery,
//   getAllGallery,
//   getGalleryById,
//   updateGallery,
//   deleteGallery,
// };


import Gallery from "../models/Gallery.modal.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import mongoose from "mongoose";

// Normalize media
const normalizeMedia = (media) => {
  if (!Array.isArray(media)) {
    media = media ? [media] : [];
  }

  return media
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      type: item.type,
      url: typeof item.url === "string" ? item.url.trim() : "",
      thumbnail:
        typeof item.thumbnail === "string"
          ? item.thumbnail.trim()
          : undefined,
    }))
    .filter(
      (item) =>
        (item.type === "image" || item.type === "video") &&
        item.url
    );
};

// Remove duplicate media URLs
const removeDuplicateMedia = (media) => {
  const seen = new Set();

  return media.filter((item) => {
    if (seen.has(item.url)) {
      return false;
    }

    seen.add(item.url);
    return true;
  });
};

// ======================================================
// CREATE GALLERY
// ======================================================

const createGallery = asyncHandler(async (req, res) => {
  try {
    const { title, media, isActive } = req.body;

    const normalizedMedia = removeDuplicateMedia(
      normalizeMedia(media)
    );

    if (normalizedMedia.length === 0) {
      return res.status(400).json(
        new apiResponse(
          400,
          null,
          "At least one gallery image or video is required"
        )
      );
    }

    const mediaUrls = normalizedMedia.map((item) => item.url);

    // Check duplicate media
    const existingGallery = await Gallery.findOne({
      "media.url": { $in: mediaUrls },
    }).select("title media");

    if (existingGallery) {
      const duplicateUrls = existingGallery.media
        .filter((item) => mediaUrls.includes(item.url))
        .map((item) => item.url);

      return res.status(409).json(
        new apiResponse(
          409,
          {
            duplicateUrls,
            existingGalleryTitle: existingGallery.title,
          },
          "One or more images/videos already exist"
        )
      );
    }

    const gallery = await Gallery.create({
      title: title?.trim() || "",
      media: normalizedMedia,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json(
      new apiResponse(
        201,
        gallery,
        "Gallery added successfully"
      )
    );
  } catch (error) {
    return res.status(500).json(
      new apiResponse(
        500,
        null,
        `Failed to create gallery: ${error.message}`
      )
    );
  }
});

// ======================================================
// GET ALL GALLERY
// ======================================================

const getAllGallery = asyncHandler(async (req, res) => {
  try {
    const {
      isPagination = "true",
      page = 1,
      limit = 10,
      search,
      isActive,
      sortBy = "recent",
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.max(Number(limit) || 10, 1);

    const match = {};

    if (isActive !== undefined) {
      match.isActive = isActive === "true";
    }

    if (search && search.trim()) {
      match.title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const pipeline = [
      {
        $match: match,
      },
    ];

    if (sortBy === "oldest") {
      pipeline.push({
        $sort: {
          createdAt: 1,
        },
      });
    } else {
      pipeline.push({
        $sort: {
          createdAt: -1,
        },
      });
    }

    const totalResult = await Gallery.aggregate([
      ...pipeline,
      {
        $count: "count",
      },
    ]);

    const total = totalResult[0]?.count || 0;

    if (isPagination === "true") {
      pipeline.push(
        {
          $skip: (currentPage - 1) * pageLimit,
        },
        {
          $limit: pageLimit,
        }
      );
    }

    const gallery = await Gallery.aggregate(pipeline);

    return res.status(200).json(
      new apiResponse(
        200,
        {
          gallery,
          totalGallery: total,
          totalPages:
            isPagination === "true"
              ? Math.ceil(total / pageLimit)
              : 1,
          currentPage,
        },
        "Gallery items fetched successfully"
      )
    );
  } catch (error) {
    return res.status(500).json(
      new apiResponse(
        500,
        null,
        `Failed to fetch gallery: ${error.message}`
      )
    );
  }
});

// ======================================================
// GET GALLERY BY ID
// ======================================================

const getGalleryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(
        new apiResponse(
          400,
          null,
          "Invalid gallery ID"
        )
      );
    }

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json(
        new apiResponse(
          404,
          null,
          "Gallery item not found"
        )
      );
    }

    return res.status(200).json(
      new apiResponse(
        200,
        gallery,
        "Gallery item fetched successfully"
      )
    );
  } catch (error) {
    return res.status(500).json(
      new apiResponse(
        500,
        null,
        `Failed to fetch gallery: ${error.message}`
      )
    );
  }
});

// ======================================================
// UPDATE GALLERY
// ======================================================

const updateGallery = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, media, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(
        new apiResponse(
          400,
          null,
          "Invalid gallery ID"
        )
      );
    }

    const existingGallery = await Gallery.findById(id);

    if (!existingGallery) {
      return res.status(404).json(
        new apiResponse(
          404,
          null,
          "Gallery item not found"
        )
      );
    }

    const updateData = {};

    // Update title
    if (title !== undefined) {
      updateData.title = title?.trim() || "";
    }

    // Update media
    if (media !== undefined) {
      const normalizedMedia = removeDuplicateMedia(
        normalizeMedia(media)
      );

      if (normalizedMedia.length === 0) {
        return res.status(400).json(
          new apiResponse(
            400,
            null,
            "At least one gallery image or video is required"
          )
        );
      }

      const mediaUrls = normalizedMedia.map(
        (item) => item.url
      );

      // Check duplicate media in other gallery
      const duplicateGallery = await Gallery.findOne({
        _id: { $ne: id },
        "media.url": { $in: mediaUrls },
      }).select("title media");

      if (duplicateGallery) {
        const duplicateUrls = duplicateGallery.media
          .filter((item) => mediaUrls.includes(item.url))
          .map((item) => item.url);

        return res.status(409).json(
          new apiResponse(
            409,
            {
              duplicateUrls,
              existingGalleryTitle: duplicateGallery.title,
            },
            "One or more images/videos already exist in another gallery"
          )
        );
      }

      updateData.media = normalizedMedia;
    }

    // Update active status
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json(
      new apiResponse(
        200,
        updatedGallery,
        "Gallery updated successfully"
      )
    );
  } catch (error) {
    return res.status(500).json(
      new apiResponse(
        500,
        null,
        `Failed to update gallery: ${error.message}`
      )
    );
  }
});

// ======================================================
// DELETE GALLERY
// ======================================================

const deleteGallery = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(
        new apiResponse(
          400,
          null,
          "Invalid gallery ID"
        )
      );
    }

    const deletedGallery = await Gallery.findByIdAndDelete(id);

    if (!deletedGallery) {
      return res.status(404).json(
        new apiResponse(
          404,
          null,
          "Gallery item not found"
        )
      );
    }

    return res.status(200).json(
      new apiResponse(
        200,
        deletedGallery,
        "Gallery deleted successfully"
      )
    );
  } catch (error) {
    return res.status(500).json(
      new apiResponse(
        500,
        null,
        `Failed to delete gallery: ${error.message}`
      )
    );
  }
});

// ======================================================
// EXPORT
// ======================================================

export {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
};