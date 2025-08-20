const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const { auth } = require('../middleware/auth');

const reportsController = require('../controllers/reportsController');
const {
  getDashboardStats,
  getDepartmentWiseReport,
  getStatusWiseReport,
  getFinancialReport,
  getProgressReport
} = reportsController;

// Validation middleware
const yearValidation = [
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year')
];

const financialYearValidation = [
  query('financialYear').optional().matches(/^\d{4}-\d{2}$/).withMessage('Financial year must be in format YYYY-YY')
];

// @route   GET /api/reports/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', auth, reportsController.getDashboardStats);

// @route   GET /api/reports/department-wise
// @desc    Get department-wise report
// @access  Private
router.get('/department-wise', auth, ...yearValidation, reportsController.getDepartmentWiseReport);

// @route   GET /api/reports/status-wise
// @desc    Get status-wise report
// @access  Private
router.get('/status-wise', auth, ...financialYearValidation, reportsController.getStatusWiseReport);

// @route   GET /api/reports/financial
// @desc    Get financial report
// @access  Private
router.get('/financial', auth, ...financialYearValidation, reportsController.getFinancialReport);

// @route   GET /api/reports/progress
// @desc    Get progress report
// @access  Private
router.get('/progress', auth, reportsController.getProgressReport);

module.exports = router;

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = require('express-validator').validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Routes
router.get('/agency-wise', auth,
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year'),
  query('agency').optional().isString().withMessage('Agency must be a string'),
  handleValidationErrors,
  reportsController.getAgencyWiseReport
);

router.get('/block-wise', auth,
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year'),
  query('block').optional().isString().withMessage('Block must be a string'),
  handleValidationErrors,
  reportsController.getBlockWiseReport
);

router.get('/scheme-wise', auth,
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year'),
  query('scheme').optional().isString().withMessage('Scheme must be a string'),
  handleValidationErrors,
  reportsController.getSchemeWiseReport
);

router.get('/pending', auth,
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year'),
  handleValidationErrors,
  reportsController.getPendingWorksReport
);

router.get('/final-status', auth,
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year'),
  handleValidationErrors,
  reportsController.getFinalStatusReport
);

router.get('/engineer-wise', auth,
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year'),
  query('engineer').optional().isString().withMessage('Engineer must be a string'),
  handleValidationErrors,
  reportsController.getEngineerWiseReport
);

router.get('/photo-missing', auth,
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year'),
  handleValidationErrors,
  reportsController.getPhotoMissingReport
);

module.exports = router;
