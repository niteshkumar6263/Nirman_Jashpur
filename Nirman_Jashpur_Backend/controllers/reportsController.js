
const WorkProposal = require('../models/WorkProposal');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get dashboard statistics
// @route   GET /api/reports/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const totalProposals = await WorkProposal.countDocuments();
    const pendingTechnical = await WorkProposal.countDocuments({ currentStatus: 'Pending Technical Approval' });
    const pendingAdministrative = await WorkProposal.countDocuments({ currentStatus: 'Pending Administrative Approval' });
    const inProgress = await WorkProposal.countDocuments({ currentStatus: 'Work In Progress' });
    const completed = await WorkProposal.countDocuments({ currentStatus: 'Work Completed' });
    
    // Financial statistics
    const financialStats = await WorkProposal.aggregate([
      {
        $group: {
          _id: null,
          totalSanctionAmount: { $sum: '$sanctionAmount' },
          totalApprovedAmount: { $sum: '$administrativeApproval.approvedAmount' },
          totalReleasedAmount: { $sum: '$workProgress.totalAmountReleasedSoFar' }
        }
      }
    ]);

    const stats = {
      proposals: {
        total: totalProposals,
        pendingTechnical,
        pendingAdministrative,
        inProgress,
        completed
      },
      financial: financialStats[0] || {
        totalSanctionAmount: 0,
        totalApprovedAmount: 0,
        totalReleasedAmount: 0
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get department-wise report
// @route   GET /api/reports/department-wise
// @access  Private
const getDepartmentWiseReport = async (req, res) => {
  try {
    const { year, department } = req.query;
    
    let matchStage = {};
    
    if (year) {
      matchStage.financialYear = year;
    }
    
    if (department) {
      matchStage.workDepartment = new RegExp(department, 'i');
    }

    const report = await WorkProposal.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$workDepartment',
          totalProposals: { $sum: 1 },
          totalSanctionAmount: { $sum: '$sanctionAmount' },
          completed: {
            $sum: { $cond: [{ $eq: ['$currentStatus', 'Work Completed'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$currentStatus', 'Work In Progress'] }, 1, 0] }
          },
          pending: {
            $sum: { 
              $cond: [
                { 
                  $in: ['$currentStatus', ['Pending Technical Approval', 'Pending Administrative Approval']] 
                }, 
                1, 
                0
              ] 
            }
          }
        }
      },
      { $sort: { totalSanctionAmount: -1 } }
    ]);

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching department report:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching department-wise report',
      error: error.message
    });
  }
};

// @desc    Get status-wise report
// @route   GET /api/reports/status-wise
// @access  Private
const getStatusWiseReport = async (req, res) => {
  try {
    const { year, financialYear } = req.query;
    
    let matchStage = {};
    
    if (financialYear) {
      matchStage.financialYear = financialYear;
    }

    const report = await WorkProposal.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$currentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$sanctionAmount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching status report:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching status-wise report',
      error: error.message
    });
  }
};

// @desc    Get financial report
// @route   GET /api/reports/financial
// @access  Private
const getFinancialReport = async (req, res) => {
  try {
    const { financialYear, department } = req.query;
    
    let matchStage = {};
    
    if (financialYear) {
      matchStage.financialYear = financialYear;
    }
    
    if (department) {
      matchStage.workDepartment = new RegExp(department, 'i');
    }

    const report = await WorkProposal.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$financialYear',
          totalProposals: { $sum: 1 },
          totalSanctionAmount: { $sum: '$sanctionAmount' },
          totalApprovedAmount: { $sum: '$administrativeApproval.approvedAmount' },
          totalReleasedAmount: { $sum: '$workProgress.totalAmountReleasedSoFar' },
          completedWorks: {
            $sum: { $cond: [{ $eq: ['$currentStatus', 'Work Completed'] }, 1, 0] }
          }
        }
      }
    ]);
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get progress report
// @route   GET /api/reports/progress
// @access  Private
const getProgressReport = async (req, res) => {
  try {
    const { status, department } = req.query;
    
    let matchStage = {
      currentStatus: { $in: ['Work Order Created', 'Work In Progress', 'Work Completed'] }
    };
    
    if (status) {
      matchStage.currentStatus = status;
    }
    
    if (department) {
      matchStage.workDepartment = new RegExp(department, 'i');
    }

    const report = await WorkProposal.find(matchStage)
      .populate('submittedBy', 'fullName department')
      .populate('workProgress.lastUpdatedBy', 'fullName')
      .select('serialNumber nameOfWork workDepartment currentStatus workProgress workOrder.dateOfWorkOrder completionDate')
      .sort({ 'workProgress.updatedAt': -1 });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching progress report:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress report',
      error: error.message
    });
  }
};


// ...existing code...

// ...existing code...


// ...existing code...


// Helper function to get year filter
const getYearFilter = (year) => {
  if (!year) return {};
  
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
  
  return {
    entryDate: {
      $gte: startDate,
      $lte: endDate
    }
  };
};

exports.getAgencyWiseReport = async (req, res) => {
  try {
    const { year, agency } = req.query;
    let filter = getYearFilter(year);
    
    if (agency) {
      filter.workAgency = new RegExp(agency, 'i');
    }
    
    // Aggregate data from all relevant collections
    const [workProgressData, workOrderData, tenderData] = await Promise.all([
      WorkProgress.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$workAgency',
            totalWorks: { $sum: 1 },
            pendingWorks: {
              $sum: { $cond: [{ $eq: ['$workProgressStage', 'Pending'] }, 1, 0] }
            },
            inProgressWorks: {
              $sum: { $cond: [{ $eq: ['$workProgressStage', 'In Progress'] }, 1, 0] }
            },
            completedWorks: {
              $sum: { $cond: [{ $eq: ['$workProgressStage', 'Completed'] }, 1, 0] }
            }
          }
        },
        { $sort: { totalWorks: -1 } }
      ]),
      
      WorkOrder.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$workAgency',
            totalOrders: { $sum: 1 },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ['$orderStatus', 'Pending'] }, 1, 0] }
            },
            issuedOrders: {
              $sum: { $cond: [{ $eq: ['$orderStatus', 'Issued'] }, 1, 0] }
            },
            completedOrders: {
              $sum: { $cond: [{ $eq: ['$orderStatus', 'Completed'] }, 1, 0] }
            }
          }
        }
      ]),
      
      Tender.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$workAgency',
            totalTenders: { $sum: 1 },
            avgTenderAmount: { $avg: '$tenderAmount' },
            totalTenderValue: { $sum: '$tenderAmount' }
          }
        }
      ])
    ]);
    
    // Combine data from all sources
    const agencyMap = new Map();
    
    workProgressData.forEach(item => {
      agencyMap.set(item._id, { ...item, agency: item._id });
    });
    
    workOrderData.forEach(item => {
      const existing = agencyMap.get(item._id) || { agency: item._id };
      agencyMap.set(item._id, { ...existing, ...item });
    });
    
    tenderData.forEach(item => {
      const existing = agencyMap.get(item._id) || { agency: item._id };
      agencyMap.set(item._id, { ...existing, ...item });
    });
    
    const result = Array.from(agencyMap.values()).map(item => ({
      agency: item.agency,
      totalWorks: item.totalWorks || 0,
      pendingWorks: item.pendingWorks || 0,
      inProgressWorks: item.inProgressWorks || 0,
      completedWorks: item.completedWorks || 0,
      totalOrders: item.totalOrders || 0,
      pendingOrders: item.pendingOrders || 0,
      issuedOrders: item.issuedOrders || 0,
      completedOrders: item.completedOrders || 0,
      totalTenders: item.totalTenders || 0,
      avgTenderAmount: item.avgTenderAmount || 0,
      totalTenderValue: item.totalTenderValue || 0
    }));
    
    res.json({
      data: result,
      summary: {
        totalAgencies: result.length,
        reportYear: year,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBlockWiseReport = async (req, res) => {
  try {
    const { year, block } = req.query;
    let filter = getYearFilter(year);
    
    if (block) {
      filter.area = new RegExp(block, 'i');
    }
    
    const blockWiseData = await WorkProgress.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$area',
          totalWorks: { $sum: 1 },
          pendingWorks: {
            $sum: { $cond: [{ $eq: ['$workProgressStage', 'Pending'] }, 1, 0] }
          },
          inProgressWorks: {
            $sum: { $cond: [{ $eq: ['$workProgressStage', 'In Progress'] }, 1, 0] }
          },
          completedWorks: {
            $sum: { $cond: [{ $eq: ['$workProgressStage', 'Completed'] }, 1, 0] }
          },
          agencies: { $addToSet: '$workAgency' },
          schemes: { $addToSet: '$scheme' }
        }
      },
      {
        $project: {
          block: '$_id',
          totalWorks: 1,
          pendingWorks: 1,
          inProgressWorks: 1,
          completedWorks: 1,
          completionRate: {
            $multiply: [
              { $divide: ['$completedWorks', '$totalWorks'] },
              100
            ]
          },
          totalAgencies: { $size: '$agencies' },
          totalSchemes: { $size: '$schemes' }
        }
      },
      { $sort: { totalWorks: -1 } }
    ]);
    
    res.json({
      data: blockWiseData,
      summary: {
        totalBlocks: blockWiseData.length,
        reportYear: year,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSchemeWiseReport = async (req, res) => {
  try {
    const { year, scheme } = req.query;
    let filter = getYearFilter(year);
    
    if (scheme) {
      filter.scheme = new RegExp(scheme, 'i');
    }
    
    const schemeWiseData = await WorkProgress.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$scheme',
          totalWorks: { $sum: 1 },
          pendingWorks: {
            $sum: { $cond: [{ $eq: ['$workProgressStage', 'Pending'] }, 1, 0] }
          },
          inProgressWorks: {
            $sum: { $cond: [{ $eq: ['$workProgressStage', 'In Progress'] }, 1, 0] }
          },
          completedWorks: {
            $sum: { $cond: [{ $eq: ['$workProgressStage', 'Completed'] }, 1, 0] }
          },
          areas: { $addToSet: '$area' },
          agencies: { $addToSet: '$workAgency' }
        }
      },
      {
        $project: {
          scheme: '$_id',
          totalWorks: 1,
          pendingWorks: 1,
          inProgressWorks: 1,
          completedWorks: 1,
          completionRate: {
            $multiply: [
              { $divide: ['$completedWorks', '$totalWorks'] },
              100
            ]
          },
          totalAreas: { $size: '$areas' },
          totalAgencies: { $size: '$agencies' }
        }
      },
      { $sort: { totalWorks: -1 } }
    ]);
    
    res.json({
      data: schemeWiseData,
      summary: {
        totalSchemes: schemeWiseData.length,
        reportYear: year,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPendingWorksReport = async (req, res) => {
  try {
    const { year } = req.query;
    let filter = getYearFilter(year);
    filter.workProgressStage = 'Pending';
    
    const pendingWorks = await WorkProgress.find(filter)
      .sort({ entryDate: -1 })
      .lean();
    
    const summary = await WorkProgress.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalPendingWorks: { $sum: 1 },
          agencyWise: {
            $push: {
              agency: '$workAgency',
              area: '$area',
              scheme: '$scheme'
            }
          }
        }
      },
      {
        $project: {
          totalPendingWorks: 1,
          agencyWiseCount: {
            $size: {
              $setUnion: {
                $map: {
                  input: '$agencyWise',
                  as: 'item',
                  in: '$$item.agency'
                }
              }
            }
          },
          areaWiseCount: {
            $size: {
              $setUnion: {
                $map: {
                  input: '$agencyWise',
                  as: 'item',
                  in: '$$item.area'
                }
              }
            }
          }
        }
      }
    ]);
    
    res.json({
      data: pendingWorks,
      summary: summary[0] || {
        totalPendingWorks: 0,
        agencyWiseCount: 0,
        areaWiseCount: 0
      },
      reportYear: year,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getFinalStatusReport = async (req, res) => {
  try {
    const { year } = req.query;
    const filter = getYearFilter(year);
    
    const finalStatus = await WorkProgress.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$workProgressStage',
          count: { $sum: 1 },
          works: {
            $push: {
              workName: '$workName',
              area: '$area',
              workAgency: '$workAgency',
              scheme: '$scheme',
              entryDate: '$entryDate',
              lastModified: '$lastModified'
            }
          }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          percentage: {
            $multiply: [
              {
                $divide: [
                  '$count',
                  { $sum: '$count' }
                ]
              },
              100
            ]
          },
          works: 1
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const totalWorks = finalStatus.reduce((sum, item) => sum + item.count, 0);
    
    // Calculate correct percentages
    const statusWithPercentages = finalStatus.map(item => ({
      ...item,
      percentage: totalWorks > 0 ? ((item.count / totalWorks) * 100).toFixed(2) : 0
    }));
    
    res.json({
      data: statusWithPercentages,
      summary: {
        totalWorks,
        reportYear: year,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getEngineerWiseReport = async (req, res) => {
  try {
    const { year, engineer } = req.query;
    let filter = getYearFilter(year);
    
    if (engineer) {
      filter.engineer = new RegExp(engineer, 'i');
    }
    
    const engineerWiseData = await WorkType.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$engineer',
          totalAssignedWorks: { $sum: 1 },
          departments: { $addToSet: '$department' },
          areas: { $addToSet: '$area' },
          schemes: { $addToSet: '$scheme' },
          workTypes: {
            $push: {
              workType: '$workType',
              department: '$department',
              area: '$area',
              priority: '$priority',
              estimatedCost: '$estimatedCost'
            }
          }
        }
      },
      {
        $project: {
          engineer: '$_id',
          totalAssignedWorks: 1,
          totalDepartments: { $size: '$departments' },
          totalAreas: { $size: '$areas' },
          totalSchemes: { $size: '$schemes' },
          workTypes: 1
        }
      },
      { $sort: { totalAssignedWorks: -1 } }
    ]);
    
    res.json({
      data: engineerWiseData,
      summary: {
        totalEngineers: engineerWiseData.length,
        reportYear: year,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPhotoMissingReport = async (req, res) => {
  try {
    const { year } = req.query;
    const filter = getYearFilter(year);
    
    // This is a placeholder implementation
    // In a real application, you would have a photos field or separate photos collection
    const worksWithoutPhotos = await WorkProgress.find({
      ...filter,
      // Assuming photos field exists and is empty or null
      $or: [
        { photos: { $exists: false } },
        { photos: { $size: 0 } },
        { photos: null }
      ]
    }).sort({ entryDate: -1 }).lean();
    
    res.json({
      data: worksWithoutPhotos,
      summary: {
        totalWorksWithoutPhotos: worksWithoutPhotos.length,
        reportYear: year,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export the const functions
exports.getDashboardStats = getDashboardStats;
exports.getDepartmentWiseReport = getDepartmentWiseReport;
exports.getStatusWiseReport = getStatusWiseReport;
exports.getFinancialReport = getFinancialReport;
exports.getProgressReport = getProgressReport;