const AdministrativeApproval = require('../models/AdministrativeApproval');
const { validationResult } = require('express-validator');

// Helper function to build filter query
const buildFilterQuery = (queryParams) => {
  const filter = {};
  
  if (queryParams.area) {
    filter.area = new RegExp(queryParams.area, 'i');
  }
  
  if (queryParams.scheme) {
    filter.scheme = new RegExp(queryParams.scheme, 'i');
  }
  
  if (queryParams.status) {
    filter.workProgressStage = queryParams.status;
  }
  
  if (queryParams.approvalStatus) {
    filter.approvalStatus = queryParams.approvalStatus;
  }
  
  if (queryParams.workAgency) {
    filter.workAgency = new RegExp(queryParams.workAgency, 'i');
  }
  
  if (queryParams.approvalAuthority) {
    filter.approvalAuthority = new RegExp(queryParams.approvalAuthority, 'i');
  }
  
  return filter;
};

exports.getAllApprovals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'entryDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    const filter = buildFilterQuery(req.query);
    
    const [approvals, total] = await Promise.all([
      AdministrativeApproval.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      AdministrativeApproval.countDocuments(filter)
    ]);
    
    res.json({
      data: approvals,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getApprovalById = async (req, res) => {
  try {
    const approval = await AdministrativeApproval.findById(req.params.id);
    
    if (!approval) {
      return res.status(404).json({ message: 'Administrative approval not found' });
    }
    
    res.json({ data: approval });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid administrative approval ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createApproval = async (req, res) => {
  try {
    const approval = new AdministrativeApproval(req.body);
    await approval.save();
    
    res.status(201).json({
      message: 'Administrative approval created successfully',
      data: approval
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({ field: err.path, message: err.message }))
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateApproval = async (req, res) => {
  try {
    const approval = await AdministrativeApproval.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!approval) {
      return res.status(404).json({ message: 'Administrative approval not found' });
    }
    
    res.json({
      message: 'Administrative approval updated successfully',
      data: approval
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid administrative approval ID' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({ field: err.path, message: err.message }))
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteApproval = async (req, res) => {
  try {
    const approval = await AdministrativeApproval.findByIdAndDelete(req.params.id);
    
    if (!approval) {
      return res.status(404).json({ message: 'Administrative approval not found' });
    }
    
    res.json({ message: 'Administrative approval deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid administrative approval ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
