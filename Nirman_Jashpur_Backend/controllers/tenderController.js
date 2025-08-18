const Tender = require('../models/Tender');
const { validationResult } = require('express-validator');

// Helper function to build filter query
const buildFilterQuery = (queryParams) => {
  const filter = {};
  
  if (queryParams.area) {
    filter.area = new RegExp(queryParams.area, 'i');
  }
  
  if (queryParams.status) {
    filter.workProgressStage = queryParams.status;
  }
  
  if (queryParams.tenderStatus) {
    filter.tenderStatus = queryParams.tenderStatus;
  }
  
  if (queryParams.workAgency) {
    filter.workAgency = new RegExp(queryParams.workAgency, 'i');
  }
  
  if (queryParams.contractorName) {
    filter.contractorName = new RegExp(queryParams.contractorName, 'i');
  }
  
  return filter;
};

exports.getAllTenders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'entryDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    const filter = buildFilterQuery(req.query);
    
    const [tenders, total] = await Promise.all([
      Tender.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Tender.countDocuments(filter)
    ]);
    
    res.json({
      data: tenders,
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

exports.getTenderById = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);
    
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    
    res.json({ data: tender });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid tender ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createTender = async (req, res) => {
  try {
    const tender = new Tender(req.body);
    await tender.save();
    
    res.status(201).json({
      message: 'Tender created successfully',
      data: tender
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

exports.updateTender = async (req, res) => {
  try {
    const tender = await Tender.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    
    res.json({
      message: 'Tender updated successfully',
      data: tender
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid tender ID' });
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

exports.deleteTender = async (req, res) => {
  try {
    const tender = await Tender.findByIdAndDelete(req.params.id);
    
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    
    res.json({ message: 'Tender deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid tender ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
