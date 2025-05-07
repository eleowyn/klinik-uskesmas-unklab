const staffService = require('../services/staffService');
const jwt = require('jsonwebtoken');

class StaffController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const staff = await staffService.login(username, password);
      if (!staff) {
        return res.status(401).json({ message: 'Invalid credentials astaga' });
      }
      const token = jwt.sign({ id: staff._id, role: staff.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, staff: { id: staff._id, username: staff.username, role: staff.role } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async register(req, res) {
    try {
      const staffData = req.body;
      const staff = await staffService.create(staffData);
      res.status(201).json(staff);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const staffs = await staffService.findAll();
      res.json(staffs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const staff = await staffService.findById(req.params.id);
      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const staff = await staffService.update(req.params.id, req.body);
      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }
      res.json(staff);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const staff = await staffService.delete(req.params.id);
      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }
      res.json({ message: 'Staff deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new StaffController();