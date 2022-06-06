const { response } = require('../../../error/response');
const { imageService } = require('../../../service/services');

const uploadFile = async (req, res) => {
  try {
    const data = await imageService.upload(req.file);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

module.exports = { uploadFile };
