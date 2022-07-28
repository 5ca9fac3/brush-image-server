const { response } = require('../../../error/response');
const { imageProcessingService } = require('../../../service/services');

const resize = async (req, res) => {
  try {
    const { width = 0, height = 0 } = req.body || {};

    await imageProcessingService.resize(req.params.publicId, +width, +height);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const crop = async (req, res) => {
  try {
    const { left = 0, top = 0, width = 0, height = 0 } = req.body || {};
    const dimensions = { left: +left, top: +top, width: +width, height: +height };

    await imageProcessingService.crop(req.params.publicId, dimensions);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const grayscale = async (req, res) => {
  try {
    await imageProcessingService.grayscale(req.params.publicId);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const tint = async (req, res) => {
  try {
    const { red = 0, green = 0, blue = 0 } = req.body || {};
    const tintColor = { red: +red, green: +green, blue: +blue };

    await imageProcessingService.tint(req.params.publicId, tintColor);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const rotate = async (req, res) => {
  try {
    const { angle = 0 } = req.body;

    await imageProcessingService.rotate(req.params.publicId, +angle);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const blur = async (req, res) => {
  try {
    const { blurPoint = 0 } = req.body;

    await imageProcessingService.blur(req.params.publicId, +blurPoint);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const sharpen = async (req, res) => {
  try {
    const { sharpenPoint = 0 } = req.body;

    await imageProcessingService.sharpen(req.params.publicId, +sharpenPoint);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const format = async (req, res) => {
  try {
    const { formatType = null } = req.body;

    const data = await imageProcessingService.format(req.params.publicId, formatType);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

module.exports = { resize, crop, grayscale, tint, rotate, blur, sharpen, format };
