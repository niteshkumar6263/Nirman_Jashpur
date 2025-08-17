const WorkProgress = require('../models/WorkProgress');
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
  
  if (queryParams.workAgency) {
    filter.workAgency = new RegExp(queryParams.workAgency, 'i');
  }
  
  return filter;
};

exports.getAllWorkProgress = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'entryDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    const filter = buildFilterQuery(req.query);
    
    const [workProgressRecords, total] = await Promise.all([
      WorkProgress.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      WorkProgress.countDocuments(filter)
    ]);
    
    res.json({
      data: workProgressRecords,
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

exports.getWorkProgressById = async (req, res) => {
  try {
    const workProgress = await WorkProgress.findById(req.params.id);
    
    if (!workProgress) {
      return res.status(404).json({ message: 'Work progress record not found' });
    }
    
    res.json({ data: workProgress });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid work progress ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createWorkProgress = async (req, res) => {
  try {
    const workProgress = new WorkProgress(req.body);
    await workProgress.save();
    
    res.status(201).json({
      message: 'Work progress record created successfully',
      data: workProgress
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

exports.updateWorkProgress = async (req, res) => {
  try {
    const workProgress = await WorkProgress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!workProgress) {
      return res.status(404).json({ message: 'Work progress record not found' });
    }
    
    res.json({
      message: 'Work progress record updated successfully',
      data: workProgress
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid work progress ID' });
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

exports.deleteWorkProgress = async (req, res) => {
  try {
    const workProgress = await WorkProgress.findByIdAndDelete(req.params.id);
    
    if (!workProgress) {
      return res.status(404).json({ message: 'Work progress record not found' });
    }
    
    res.json({ message: 'Work progress record deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid work progress ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
