const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const WorkType = require('../models/WorkType');

// Validation middleware
const validateWorkType = [
  body('workType')
    .trim()
    .notEmpty()
    .withMessage('Work type is required')
    .isLength({ max: 200 })
    .withMessage('Work type cannot exceed 200 characters'),
  
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required')
    .isLength({ max: 200 })
    .withMessage('Department cannot exceed 200 characters'),
  
  body('constituency')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Constituency cannot exceed 100 characters'),
  
  body('engineer')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Engineer name cannot exceed 200 characters'),
  
  body('scheme')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Scheme cannot exceed 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('area')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Area cannot exceed 100 characters'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City cannot exceed 100 characters'),
  
  body('ward')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Ward cannot exceed 50 characters'),
    
  body('estimatedCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated cost must be a positive number'),
    
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be Low, Medium, High, or Critical'),
    
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Helper function to build filter query
const buildFilterQuery = (queryParams) => {
  const filter = {};
  
  if (queryParams.workType) {
    filter.workType = new RegExp(queryParams.workType, 'i');
  }
  
  if (queryParams.department) {
    filter.department = new RegExp(queryParams.department, 'i');
  }
  
  if (queryParams.area) {
    filter.area = new RegExp(queryParams.area, 'i');
  }
  
  if (queryParams.city) {
    filter.city = new RegExp(queryParams.city, 'i');
  }
  
  if (queryParams.engineer) {
    filter.engineer = new RegExp(queryParams.engineer, 'i');
  }
  
  if (queryParams.scheme) {
    filter.scheme = new RegExp(queryParams.scheme, 'i');
  }
  
  if (queryParams.priority) {
    filter.priority = queryParams.priority;
  }
  
  if (queryParams.isActive !== undefined) {
    filter.isActive = queryParams.isActive === 'true';
  }
  
  return filter;
};

// GET /work-types - Get all work types
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['entryDate', 'lastModified', 'workType', 'department', 'priority']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  query('search').optional().isString().withMessage('Search must be a string')
], async (req, res) => {
  try {
    handleValidationErrors(req, res, () => {});
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'entryDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    let filter = buildFilterQuery(req.query);
    
    // Add text search if search query is provided
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    
    const [workTypes, total] = await Promise.all([
      WorkType.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      WorkType.countDocuments(filter)
    ]);
    
    res.json({
      data: workTypes,
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
});

// GET /work-types/:id - Get single work type
router.get('/:id', async (req, res) => {
  try {
    const workType = await WorkType.findById(req.params.id);
    
    if (!workType) {
      return res.status(404).json({ message: 'Work type not found' });
    }
    
    res.json({ data: workType });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid work type ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /work-types - Create new work type
router.post('/', validateWorkType, handleValidationErrors, async (req, res) => {
  try {
    const workType = new WorkType(req.body);
    await workType.save();
    
    res.status(201).json({
      message: 'Work type created successfully',
      data: workType
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
});

// PUT /work-types/:id - Update work type
router.put('/:id', validateWorkType, handleValidationErrors, async (req, res) => {
  try {
    const workType = await WorkType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!workType) {
      return res.status(404).json({ message: 'Work type not found' });
    }
    
    res.json({
      message: 'Work type updated successfully',
      data: workType
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid work type ID' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({ field: err.path, message: err.message }))
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /work-types/:id - Delete work type
router.delete('/:id', async (req, res) => {
  try {
    const workType = await WorkType.findByIdAndDelete(req.params.id);
    
    if (!workType) {
      return res.status(404).json({ message: 'Work type not found' });
    }
    
    res.json({ message: 'Work type deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid work type ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /work-types/department/:department - Get work types by department
router.get('/department/:department', async (req, res) => {
  try {
    const workTypes = await WorkType.find({ 
      department: new RegExp(req.params.department, 'i'),
      isActive: true 
    }).sort({ workType: 1 });
    
    res.json({ data: workTypes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
