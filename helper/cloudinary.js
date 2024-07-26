const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadToCloudinary = async (buffer, folder, resourceType = 'auto') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: folder, resource_type: resourceType }, (error, result) => {
            if (result) {
                resolve(result.url);;
            } else {
                reject(error);
            }
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
}


const getPublicId = (url) => {
    const regex = /\/(?:v\d+\/)?([^\/]+)\.[a-zA-Z]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const addImage = async (buffer) => {
    try {
        const result = await uploadToCloudinary(buffer, 'images', 'image');
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const addImages = async (files) => {
    try {
        const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, 'images'));
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const addMp3 = async (buffer) => {
    try {
        const result = await uploadToCloudinary(buffer, 'mp3', 'video');
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteImage = async (url) => {
  try {
    let publicId = getPublicId(url);
    if (!publicId) {
      throw new Error('Public ID không hợp lệ hoặc không được trích xuất');
    }
    publicId = `images/` + publicId 
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const deleteImages = async (urls) => {
    try {
        const publicIds = getPublicId(urls)
        const deletePromises = publicIds.map(publicId => cloudinary.uploader.destroy(publicId));
        const results = await Promise.all(deletePromises);
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteMp3 = async (url) => {
    try {
        const publicId = getPublicId(url)
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    addImage,
    addImages,
    addMp3,
    deleteImage,
    deleteImages,
    deleteMp3
};
