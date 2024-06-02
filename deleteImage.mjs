const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const cloudName = process.env.cloud_name;
const apiKey = process.env.api_key;
const apiSecret = process.env.api_secret;

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

// Define the route handler for deleting an image
const deleteImage = (req, res) => {
  const { public_id } = req.body;

  // Delete the image from Cloudinary
  cloudinary.uploader.destroy(public_id, { invalidate: true })
    .then(result => {
      // Image deletion successful
      res.json({ message: 'Image deleted successfully' });
    })
    .catch(error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.log(error.response.data); // Response data from the server
            console.log(error.response.status); // Status code of the response
            console.log(error.response.headers); // Headers sent by the server
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request); // XMLHttpRequest instance
          } else {
            // Something happened in setting up the request that triggered an error
            console.log('Error', error.message);
          }
          console.log(error.config); // Config used to make the request
    });
};

module.exports = deleteImage;
