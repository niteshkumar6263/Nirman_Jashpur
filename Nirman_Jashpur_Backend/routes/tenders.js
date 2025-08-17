const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const tenderController = require('../controllers/tenderController');

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

// Routes
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['entryDate', 'lastModified', 'workName', 'tenderDate']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], tenderController.getAllTenders);

router.get('/:id', tenderController.getTenderById);
router.post('/', validateTender, handleValidationErrors, tenderController.createTender);
router.put('/:id', validateTender, handleValidationErrors, tenderController.updateTender);
router.delete('/:id', tenderController.deleteTender);

module.exports = router;
