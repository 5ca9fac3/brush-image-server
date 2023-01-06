import { response } from '../../../error/response';
import { imageService } from '../../../service/services';

export const uploadFile = async (req, res) => {
  try {
    const data = await imageService.upload(req.file);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { name = '' } = req.body || {};

    await imageService.download(req.params.publicId, name);

    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};
