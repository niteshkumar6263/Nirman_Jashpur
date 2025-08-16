const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const WorkProgress = require('../models/WorkProgress');

// Validation middleware
const validateWorkProgress = [
  body('workName')
    .trim()
    .notEmpty()
    .withMessage('Work name is required')
    .isLength({ max: 500 })
    .withMessage('Work name cannot exceed 500 characters'),
  
  body('area')
    .trim()
    .notEmpty()
    .withMessage('Area is required')
    .isLength({ max: 100 })
    .withMessage('Area cannot exceed 100 characters'),
  
  body('workAgency')
    .trim()
    .notEmpty()
    .withMessage('Work agency is required')
    .isLength({ max: 200 })
    .withMessage('Work agency cannot exceed 200 characters'),
  
  body('scheme')
    .trim()
    .notEmpty()
    .withMessage('Scheme is required')
    .isLength({ max: 200 })
    .withMessage('Scheme cannot exceed 200 characters'),
  
  body('technicalApproval')
    .trim()
    .notEmpty()
    .withMessage('Technical approval is required')
    .isLength({ max: 100 })
    .withMessage('Technical approval cannot exceed 100 characters'),
  
  body('administrativeApproval')
    .trim()
    .notEmpty()
    .withMessage('Administrative approval is required')
    .isLength({ max: 100 })
    .withMessage('Administrative approval cannot exceed 100 characters'),
  
  body('workProgressStage')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Work progress stage must be Pending, In Progress, or Completed'),
  
  body('workDetails')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Work details cannot exceed 1000 characters'),
  
  body('tenderApproval')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Tender approval cannot exceed 100 characters')
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

// GET /work-progress - Get all work progress records
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['entryDate', 'lastModified', 'workName']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], async (req, res) => {
  try {
    handleValidationErrors(req, res, () => {});
    
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
});

// GET /work-progress/:id - Get single work progress record
router.get('/:id', async (req, res) => {
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
});

// POST /work-progress - Create new work progress record
router.post('/', validateWorkProgress, handleValidationErrors, async (req, res) => {
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
});

// PUT /work-progress/:id - Update work progress record
router.put('/:id', validateWorkProgress, handleValidationErrors, async (req, res) => {
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
});

// DELETE /work-progress/:id - Delete work progress record
router.delete('/:id', async (req, res) => {
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
});

module.exports = router;
