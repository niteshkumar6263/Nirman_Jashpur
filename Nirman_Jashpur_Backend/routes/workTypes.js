const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const workTypeController = require('../controllers/workTypeController');

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

// Routes
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['entryDate', 'lastModified', 'workType', 'department', 'priority']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  query('search').optional().isString().withMessage('Search must be a string')
], workTypeController.getAllWorkTypes);

router.get('/:id', workTypeController.getWorkTypeById);
router.post('/', validateWorkType, handleValidationErrors, workTypeController.createWorkType);
router.put('/:id', validateWorkType, handleValidationErrors, workTypeController.updateWorkType);
router.delete('/:id', workTypeController.deleteWorkType);
router.get('/department/:department', workTypeController.getWorkTypesByDepartment);

module.exports = router;
