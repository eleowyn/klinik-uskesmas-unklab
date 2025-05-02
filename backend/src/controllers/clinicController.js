const { getClinicInfo, updateClinicInfo } = require('../services/clinicService');
const { responseFormatter } = require('../utils/responseFormatter');

const getInfo = async (req, res, next) => {
  try {
    const clinicInfo = await getClinicInfo();
    
    res.status(200).json(responseFormatter({
      status: 'success',
      data: clinicInfo,
    }));
  } catch (err) {
    next(err);
  }
};

const updateInfo = async (req, res, next) => {
  try {
    const clinicInfo = await updateClinicInfo(req.body);
    
    res.status(200).json(responseFormatter({
      status: 'success',
      data: clinicInfo,
    }));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getInfo,
  updateInfo,
};