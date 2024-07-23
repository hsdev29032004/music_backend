const cloudinary = require("cloudinary").v2
const streamifier = require("streamifier")
const multer = require("multer")

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function uploadToCloudinary(buffer, folder) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: folder }, (error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
}

function getPublicId(url) {
    // Tách publicId từ URL Cloudinary
    const regex = /\/v\d+\/([^\/]+)\.(jpg|png|jpeg|mp3)$/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

async function addImage(buffer) {
    try {
        const result = await uploadToCloudinary(buffer, 'images');
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function addImages(files) {
    try {
        const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, 'images'));
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function addMp3(buffer) {
    try {
        const result = await uploadToCloudinary(buffer, 'mp3');
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function deleteImage(url) {
    try {
        const publicId = getPublicId(url)
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function deleteImages(urls) {
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

async function deleteMp3(url) {
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
