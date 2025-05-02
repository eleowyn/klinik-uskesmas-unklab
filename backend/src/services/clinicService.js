const ClinicInfo = require('../models/ClinicInfo');

const getClinicInfo = async () => {
  let clinicInfo = await ClinicInfo.findOne();
  
  // If no clinic info exists, create default
  if (!clinicInfo) {
    clinicInfo = new ClinicInfo({
      name: 'KLINIK USKESMAS UNKLAB',
      address: 'Jl. Arnold Mononutu, Airmadidi, Minahasa Utara, Sulawesi Utara',
      phoneNumbers: ['+62 123 4567 890', '+62 987 6543 210'],
      email: 'info@uskemasklinik.unklab.ac.id',
      operatingHours: {
        Monday: '08:00 - 17:00',
        Tuesday: '08:00 - 17:00',
        Wednesday: '08:00 - 17:00',
        Thursday: '08:00 - 17:00',
        Friday: '08:00 - 17:00',
        Saturday: '08:00 - 12:00',
        Sunday: 'Closed',
      },
      services: [
        'General Medicine',
        'Dental Care',
        'Pediatrics',
        'Obstetrics and Gynecology',
        'Laboratory Tests',
        'Pharmacy',
      ],
      aboutUs: 'KLINIK USKESMAS UNKLAB is a university health clinic providing comprehensive healthcare services to students, faculty, and the surrounding community.',
      mission: 'To provide quality healthcare services with compassion and professionalism.',
      vision: 'To be a leading university health clinic in North Sulawesi.',
    });
    await clinicInfo.save();
  }
  
  return clinicInfo;
};

const updateClinicInfo = async (updateData) => {
  let clinicInfo = await ClinicInfo.findOne();
  
  if (!clinicInfo) {
    clinicInfo = new ClinicInfo(updateData);
  } else {
    clinicInfo = await ClinicInfo.findOneAndUpdate({}, updateData, { new: true });
  }
  
  await clinicInfo.save();
  return clinicInfo;
};

module.exports = {
  getClinicInfo,
  updateClinicInfo,
};