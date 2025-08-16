const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const Tender = require('../models/Tender');

// Validation middleware
const validateTender = [
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
  
  body('tenderApproval')
    .trim()
    .notEmpty()
    .withMessage('Tender approval is required')
    .isLength({ max: 100 })
    .withMessage('Tender approval cannot exceed 100 characters'),
  
  body('workProgressStage')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Work progress stage must be Pending, In Progress, or Completed'),
  
  body('workDetails')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Work details cannot exceed 1000 characters'),
    
  body('tenderAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tender amount must be a positive number'),
    
  body('tenderDate')
    .optional()
    .isISO8601()
    .withMessage('Tender date must be a valid date'),
    
  body('bidSubmissionDate')
    .optional()
    .isISO8601()
    .withMessage('Bid submission date must be a valid date'),
    
  body('tenderStatus')
    .optional()
    .isIn(['Draft', 'Published', 'Bid Submission', 'Under Evaluation', 'Awarded', 'Cancelled'])
    .withMessage('Invalid tender status'),
    
  body('contractorName')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Contractor name cannot exceed 200 characters'),
    
  body('awardedAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Awarded amount must be a positive number')
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

// GET /tenders - Get all tenders
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['entryDate', 'lastModified', 'workName', 'tenderDate']).withMessage('Invalid sort field'),
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
});

// GET /tenders/:id - Get single tender
router.get('/:id', async (req, res) => {
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
});

// POST /tenders - Create new tender
router.post('/', validateTender, handleValidationErrors, async (req, res) => {
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
});

// PUT /tenders/:id - Update tender
router.put('/:id', validateTender, handleValidationErrors, async (req, res) => {
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
});

// DELETE /tenders/:id - Delete tender
router.delete('/:id', async (req, res) => {
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
});

module.exports = router;
