const express = require('express');
const router = express.Router();
const RegisterDonateBlood = require('../models/BloodDonation');
const GroupBlood = require('../models/GroupBlood');

// GET: Lịch sử hiến máu
router.get('/api/donation-history/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const history = await RegisterDonateBlood.findAll({
      where: { IDUser: userId },
      include: [{
        model: GroupBlood,
        attributes: ['BloodType']
      }],
      order: [['DonateBloodDate', 'DESC']],
    });

    // Chuyển sang định dạng đơn giản để dễ frontend xài
    const result = history.map(item => ({
      IDRegister: item.IDRegister,
      DonateBloodDate: item.DonateBloodDate,
      BloodTypeName: item.GroupBlood?.BloodType || 'Không rõ',
      IdentificationNumber: item.IdentificationNumber,
      Note: item.Note,
      Status: item.Status,
    }));

    res.json(result);
  } catch (error) {
    console.error('❌ Lỗi lấy lịch sử hiến máu:', error);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

module.exports = router;
