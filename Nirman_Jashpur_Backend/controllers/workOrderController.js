const WorkOrder = require('../models/WorkOrder');
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
    filter.orderStatus = queryParams.status;
  }
  
  if (queryParams.workAgency) {
    filter.workAgency = new RegExp(queryParams.workAgency, 'i');
  }
  
  return filter;
};

exports.getAllWorkOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'entryDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    const filter = buildFilterQuery(req.query);
    
    const [workOrders, total] = await Promise.all([
      WorkOrder.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      WorkOrder.countDocuments(filter)
    ]);
    
    res.json({
      data: workOrders,
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

exports.getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);
    
    if (!workOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }
    
    res.json({ data: workOrder });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid work order ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createWorkOrder = async (req, res) => {
  try {
    const workOrder = new WorkOrder(req.body);
    await workOrder.save();
    
    res.status(201).json({
      message: 'Work order created successfully',
      data: workOrder
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

exports.updateWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!workOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }
    
    res.json({
      message: 'Work order updated successfully',
      data: workOrder
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid work order ID' });
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

exports.deleteWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findByIdAndDelete(req.params.id);
    
    if (!workOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }
    
    res.json({ message: 'Work order deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid work order ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
