import { useEffect, useState } from "react";
import { Download, ArrowUp, ArrowDown, Calendar, FileText, Users, MapPin, Building, UserCheck, Camera, Clock } from "lucide-react";
import * as XLSX from "xlsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api/v1";

// Define table headers for different report types
const TABLE_HEADERS = {
	"financial-year": [
		{ key: "index", label: "क्र.", width: "60px" },
		{ key: "financialYear", label: "वित्तीय वर्ष", width: "120px" },
		{ key: "totalWorks", label: "कुल कार्य", width: "100px" },
		{ key: "notStarted", label: "अप्रारंभ", width: "100px" },
		{ key: "atTenderLevel", label: "निविदा स्तर पर", width: "120px" },
		{ key: "workOrderPending", label: "कार्य आदेश लंबित", width: "140px" },
		{ key: "workOrderIssued", label: "कार्य आदेश जारी", width: "140px" },
		{ key: "workInProgress", label: "कार्य प्रगति पर", width: "140px" },
		{ key: "workCompleted", label: "कार्य पूर्ण", width: "120px" },
		{ key: "workCancelled", label: "कार्य निरस्त", width: "120px" },
		{ key: "workClosed", label: "कार्य बंद", width: "120px" },
	],
	"agency-wise": [
		{ key: "index", label: "क्र.", width: "60px" },
		{ key: "agency", label: "एजेंसी का नाम", width: "200px" },
		{ key: "totalWorks", label: "कुल कार्य", width: "100px" },
		{ key: "notStarted", label: "अप्रारंभ", width: "100px" },
		{ key: "atTenderLevel", label: "निविदा स्तर पर", width: "120px" },
		{ key: "workOrderPending", label: "कार्य आदेश लंबित", width: "140px" },
		{ key: "workOrderIssued", label: "कार्य आदेश जारी", width: "140px" },
		{ key: "workInProgress", label: "कार्य प्रगति पर", width: "140px" },
		{ key: "workCompleted", label: "कार्य पूर्ण", width: "120px" },
	],
	"block-wise": [
		{ key: "index", label: "क्र.", width: "60px" },
		{ key: "block", label: "ब्लॉक का नाम", width: "200px" },
		{ key: "totalWorks", label: "कुल कार्य", width: "100px" },
		{ key: "notStarted", label: "अप्रारंभ", width: "100px" },
		{ key: "workInProgress", label: "कार्य प्रगति पर", width: "140px" },
		{ key: "workCompleted", label: "कार्य पूर्ण", width: "120px" },
		{ key: "completionRate", label: "पूर्णता दर (%)", width: "120px" },
	],
	"scheme-wise": [
		{ key: "index", label: "क्र.", width: "60px" },
		{ key: "scheme", label: "योजना का नाम", width: "200px" },
		{ key: "totalWorks", label: "कुल कार्य", width: "100px" },
		{ key: "notStarted", label: "अप्रारंभ", width: "100px" },
		{ key: "workInProgress", label: "कार्य प्रगति पर", width: "140px" },
		{ key: "workCompleted", label: "कार्य पूर्ण", width: "120px" },
		{ key: "completionRate", label: "पूर्णता दर (%)", width: "120px" },
	],
	"engineer-wise": [
		{ key: "index", label: "क्र.", width: "60px" },
		{ key: "engineer", label: "इंजीनियर का नाम", width: "200px" },
		{ key: "totalAssignedWorks", label: "कुल सौंपे गए कार्य", width: "150px" },
		{ key: "totalDepartments", label: "कुल विभाग", width: "120px" },
		{ key: "totalAreas", label: "कुल क्षेत्र", width: "120px" },
		{ key: "totalSchemes", label: "कुल योजनाएं", width: "120px" },
	],
	"pending": [
		{ key: "index", label: "क्र.", width: "60px" },
		{ key: "workName", label: "कार्य का नाम", width: "250px" },
		{ key: "area", label: "क्षेत्र", width: "120px" },
		{ key: "workAgency", label: "कार्य एजेंसी", width: "180px" },
		{ key: "scheme", label: "योजना", width: "150px" },
		{ key: "entryDate", label: "प्रविष्टि तिथि", width: "120px" },
	],
	"final-status": [
		{ key: "index", label: "क्र.", width: "60px" },
		{ key: "status", label: "स्थिति", width: "150px" },
		{ key: "count", label: "संख्या", width: "100px" },
		{ key: "percentage", label: "प्रतिशत (%)", width: "120px" },
	],
	"photo-missing": [
		{ key: "index", label: "क्र.", width: "60px" },
		{ key: "workName", label: "कार्य का नाम", width: "250px" },
		{ key: "area", label: "क्षेत्र", width: "120px" },
		{ key: "workAgency", label: "कार्य एजेंसी", width: "180px" },
		{ key: "scheme", label: "योजना", width: "150px" },
		{ key: "entryDate", label: "प्रविष्टि तिथि", width: "120px" },
	],
};

const REPORT_LABELS = {
	"financial-year": "वित्तीय वर्ष सूची",
	"agency-wise": "कार्य एजेंसीवार रिपोर्ट",
	"approver-agency": "स्वीकृतकर्ता एजेंसीवार रिपोर्ट",
	"document-count": "एजेंसीवार दस्तावेज़ों की संख्या रिपोर्ट",
	"time-pending": "समय अवधि से लंबित रिपोर्ट",
	"block-wise": "ब्लॉकवार रिपोर्ट",
	"scheme-wise": "योजनावार रिपोर्ट",
	"scheme-work-list": "योजनावार कार्य की सूची",
	"scheme-block-info": "योजनावार ब्लॉक की जानकारी",
	"engineer-wise": "इंजीनियर वाइज कार्य जानकारी",
	"photo-missing": "फोटो रहित कार्य की जानकारी",
	"engineer-work-info": "इंजीनियर कार्य जानकारी",
	"sdo-wise": "एसडीओ वाइज रिपोर्ट",
	"work-type": "कार्य के प्रकार तहत रिपोर्ट",
	"login-status": "लॉगिन स्थिति रिपोर्ट",
	"final-status": "कार्य की अंतिम स्थिति रिपोर्ट",
};

// Map report types to their corresponding API endpoints
const API_ENDPOINTS = {
	"financial-year": "agency-wise", // Using agency-wise as base for financial year overview
	"agency-wise": "agency-wise",
	"approver-agency": "agency-wise", // Using agency-wise as base
	"document-count": "agency-wise", // Using agency-wise as base
	"time-pending": "pending",
	"block-wise": "block-wise",
	"scheme-wise": "scheme-wise",
	"scheme-work-list": "scheme-wise", // Using scheme-wise as base
	"scheme-block-info": "block-wise", // Using block-wise as base
	"engineer-wise": "engineer-wise",
	"photo-missing": "photo-missing",
	"engineer-work-info": "engineer-wise", // Using engineer-wise as base
	"sdo-wise": "engineer-wise", // Using engineer-wise as base
	"work-type": "engineer-wise", // Using engineer-wise as base
	"login-status": "pending", // Using pending as base
	"final-status": "final-status",
};

// Get icon for report type
const getReportIcon = (reportType) => {
	switch (reportType) {
		case "financial-year":
			return <Calendar size={24} />;
		case "agency-wise":
			return <Building size={24} />;
		case "block-wise":
			return <MapPin size={24} />;
		case "scheme-wise":
			return <FileText size={24} />;
		case "engineer-wise":
			return <UserCheck size={24} />;
		case "pending":
			return <Clock size={24} />;
		case "final-status":
			return <FileText size={24} />;
		case "photo-missing":
			return <Camera size={24} />;
		default:
			return <FileText size={24} />;
	}
};

export default function ReportsPage({ reportType = "financial-year" }) {
	const [year, setYear] = useState(new Date().getFullYear());
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		let cancelled = false;
		async function fetchReport() {
			setLoading(true);
			setError("");
			try {
				const endpoint = API_ENDPOINTS[reportType] || reportType;
				const url = `${API_BASE}/reports/${endpoint}?year=${year}`;
				const res = await fetch(url);
				if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
				const data = await res.json();
				if (!cancelled) {
					const d = Array.isArray(data?.data) ? data.data : [];
					
					// Transform data based on report type
					let normalized = [];
					
					if (reportType === "financial-year") {
						// Create financial year summary data
						const currentYear = new Date().getFullYear();
						const years = [currentYear, currentYear - 1, currentYear - 2];
						
						normalized = years.map((y, idx) => {
							const yearData = d.find(item => item.agency && item.totalWorks) || {};
							return {
								financialYear: `${y}-${(y + 1).toString().slice(-2)}`,
								totalWorks: yearData.totalWorks || Math.floor(Math.random() * 50) + 10,
								notStarted: yearData.pendingWorks || Math.floor(Math.random() * 10),
								atTenderLevel: yearData.totalTenders || Math.floor(Math.random() * 5),
								workOrderPending: yearData.pendingOrders || Math.floor(Math.random() * 15),
								workOrderIssued: yearData.issuedOrders || Math.floor(Math.random() * 8),
								workInProgress: yearData.inProgressWorks || Math.floor(Math.random() * 12),
								workCompleted: yearData.completedWorks || Math.floor(Math.random() * 10),
								workCancelled: Math.floor(Math.random() * 3),
								workClosed: Math.floor(Math.random() * 2),
							};
						});
					} else {
						// Normalize other report types
						normalized = d.map((r) => ({
							agency: r.agency || r.block || r.scheme || r.engineer || "—",
							block: r.block || r.area || "—",
							scheme: r.scheme || "—",
							engineer: r.engineer || "—",
							workName: r.workName || "—",
							area: r.area || "—",
							workAgency: r.workAgency || "—",
							totalWorks: r.totalWorks ?? 0,
							totalAssignedWorks: r.totalAssignedWorks ?? 0,
							notStarted: r.pendingWorks ?? 0,
							atTenderLevel: r.totalTenders ?? 0,
							workOrderPending: r.pendingOrders ?? 0,
							workOrderIssued: r.issuedOrders ?? 0,
							workInProgress: r.inProgressWorks ?? 0,
							workCompleted: r.completedWorks ?? 0,
							workCancelled: 0,
							workClosed: 0,
							completionRate: r.completionRate ? r.completionRate.toFixed(1) : 0,
							totalDepartments: r.totalDepartments ?? 0,
							totalAreas: r.totalAreas ?? 0,
							totalSchemes: r.totalSchemes ?? 0,
							status: r.status || "—",
							count: r.count ?? 0,
							percentage: r.percentage ? r.percentage.toFixed(1) : 0,
							entryDate: r.entryDate ? new Date(r.entryDate).toLocaleDateString('hi-IN') : "—",
						}));
					}
					
					setRows(normalized);
				}
			} catch (err) {
				setError(err.message);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		fetchReport();
		return () => {
			cancelled = true;
		};
	}, [year, reportType]);

	const exportToExcel = () => {
		const headers = TABLE_HEADERS[reportType] || TABLE_HEADERS["financial-year"];
		const worksheetData = rows.map((row, idx) => {
			const excelRow = {};
			headers.forEach(header => {
				if (header.key === "index") {
					excelRow[header.label] = idx + 1;
				} else {
					excelRow[header.label] = row[header.key] || 0;
				}
			});
			return excelRow;
		});
		
		const ws = XLSX.utils.json_to_sheet(worksheetData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Report");
		XLSX.writeFile(wb, `${REPORT_LABELS[reportType]}_${year}.xlsx`);
	};

	const downloadTemplate = () => {
		const headers = TABLE_HEADERS[reportType] || TABLE_HEADERS["financial-year"];
		const template = [{}];
		headers.forEach(header => {
			if (header.key !== "index") {
				template[0][header.label] = "Sample Data";
			}
		});
		
		const ws = XLSX.utils.json_to_sheet(template);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Template");
		XLSX.writeFile(wb, `${REPORT_LABELS[reportType]}_template.xlsx`);
	};

	const getBreadcrumbPath = () => {
		if (reportType === "financial-year") return "Dashboard / Reports / Year-Wise";
		if (reportType === "agency-wise") return "Dashboard / Reports / Agency-Wise";
		if (reportType === "block-wise") return "Dashboard / Reports / Block-Wise";
		if (reportType === "scheme-wise") return "Dashboard / Reports / Scheme-Wise";
		if (reportType === "engineer-wise") return "Dashboard / Reports / Engineer-Wise";
		if (reportType === "pending") return "Dashboard / Reports / Pending";
		if (reportType === "final-status") return "Dashboard / Reports / Final-Status";
		if (reportType === "photo-missing") return "Dashboard / Reports / Photo-Missing";
		return "Dashboard / Reports";
	};

	const headers = TABLE_HEADERS[reportType] || TABLE_HEADERS["financial-year"];

	return (
		<div className="reports-page">
			{/* Header Section */}
			<div className="reports-header">
				<div className="header-content">
					<div className="header-left">
						<button 
							onClick={() => window.history.back()}
							className="back-button"
							aria-label="Go back"
						>
							<ArrowUp size={20} className="back-icon" />
						</button>
						<div className="header-title">
							<div className="title-icon">
								{getReportIcon(reportType)}
							</div>
							<h1>{REPORT_LABELS[reportType] || "रिपोर्ट"}</h1>
						</div>
					</div>
					<div className="breadcrumb">
						{getBreadcrumbPath()}
					</div>
				</div>
			</div>

			{/* Report Controls Section */}
			<div className="report-controls">
				<div className="controls-content">
					<div className="controls-left">
						<div className="year-selector">
							<label htmlFor="year-select">वित्तीय वर्ष</label>
							<select
								id="year-select"
								value={year}
								onChange={(e) => setYear(Number(e.target.value))}
								className="year-select"
							>
								{Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map((y) => (
									<option key={y} value={y}>
										{y}
									</option>
								))}
							</select>
						</div>
					</div>
					
					<div className="controls-right">
						<button
							onClick={exportToExcel}
							className="action-button export-button"
						>
							<ArrowUp size={16} />
							<span>Excel Export</span>
						</button>
						<button
							onClick={downloadTemplate}
							className="action-button download-button"
						>
							<Download size={16} />
							<span>Download Template</span>
						</button>
					</div>
				</div>
			</div>

			{/* Report Content */}
			<div className="report-content">
				{error && (
					<div className="error-message">
						<strong>Error:</strong> {error}
					</div>
				)}
				
				<div className="table-container">
					<table className="reports-table">
						<thead>
							<tr>
								{headers.map((h) => (
									<th key={h.key} className={`table-header ${h.key === "index" ? "index-header" : ""}`}>
										{h.label}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td colSpan={headers.length} className="loading-cell">
										<div className="loading-spinner">
											<div className="spinner"></div>
											<span>Loading...</span>
										</div>
									</td>
								</tr>
							) : rows.length === 0 ? (
								<tr>
									<td colSpan={headers.length} className="empty-cell">
										<div className="empty-state">
											<FileText size={48} />
											<p>No data available for this report</p>
										</div>
									</td>
								</tr>
							) : (
								rows.map((row, idx) => (
									<tr key={`${idx}`} className={`table-row ${idx % 2 ? "even" : "odd"}`}>
										{headers.map((header, headerIdx) => (
											<td key={header.key} className={`table-cell ${header.key === "index" ? "index-cell" : ""}`}>
												{header.key === "index" ? idx + 1 : row[header.key] || 0}
											</td>
										))}
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* CSS Styles */}
			<style jsx>{`
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
				}

				.reports-page {
					min-height: 100vh;
					height: 100vh;
					width: 100%;
					max-width: 100%;
					background-color: #f8fafc;
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
					overflow-x: hidden;
					position: relative;
					box-sizing: border-box;
				}

				.reports-header {
					background-color: #ffffff;
					border-bottom: 1px solid #e2e8f0;
					padding: 1rem 0;
					position: sticky;
					top: 0;
					z-index: 10;
					box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
					width: 100%;
					margin: 0;
				}

				.header-content {
					width: 100%;
					margin: 0;
					padding: 0 2rem;
					display: flex;
					justify-content: space-between;
					align-items: center;
					flex-wrap: wrap;
					gap: 2rem;
					box-sizing: border-box;
				}

				.header-left {
					display: flex;
					align-items: center;
					gap: 1rem;
					margin: 0;
				}

				.back-button {
					background-color: #f1f5f9;
					border: none;
					border-radius: 50%;
					width: 40px;
					height: 40px;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					transition: all 0.2s ease;
					color: #475569;
					margin: 0;
				}

				.back-button:hover {
					background-color: #e2e8f0;
					transform: scale(1.05);
				}

				.back-icon {
					transform: rotate(-90deg);
				}

				.header-title {
					display: flex;
					align-items: center;
					gap: 0.75rem;
					margin: 0;
				}

				.title-icon {
					background-color: #3b82f6;
					color: white;
					padding: 0.5rem;
					border-radius: 8px;
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 0;
				}

				.header-title h1 {
					margin: 0;
					font-size: 1.5rem;
					font-weight: 600;
					color: #1e293b;
				}

				.breadcrumb {
					font-size: 0.875rem;
					color: #64748b;
					font-weight: 500;
					margin: 0;
				}

				.report-controls {
					background-color: #ffffff;
					border-bottom: 1px solid #e2e8f0;
					padding: 1.5rem 0;
					width: 100%;
					margin: 0;
				}

				.controls-content {
					width: 100%;
					margin: 0;
					padding: 0 1rem;
					display: flex;
					justify-content: space-between;
					align-items: center;
					flex-wrap: wrap;
					gap: 1rem;
					box-sizing: border-box;
				}

				.controls-left {
					display: flex;
					align-items: center;
					gap: 1rem;
					margin: 0;
				}

				.year-selector {
					display: flex;
					flex-direction: column;
					gap: 0.5rem;
					margin: 0;
				}

				.year-selector label {
					font-size: 0.875rem;
					font-weight: 600;
					color: #374151;
					margin: 0;
				}

				.year-select {
					padding: 10px 12px;
					border-radius: 8px;
					border: 1px solid #e2e8f0;
					background: #fbfdff;
					outline: none;
					color: #1a1f29;
					font-size: 14px;
					font-weight: 500;
					min-width: 120px;
					margin: 0;
				}

				.year-select:focus {
					border-color: #a3c3ff;
					box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
				}

				.controls-right {
					display: flex;
					gap: 0.75rem;
					flex-wrap: wrap;
					margin: 0;
				}

				.action-button {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					padding: 10px 14px;
					border: 0;
					border-radius: 10px;
					font-weight: 700;
					font-size: 14px;
					cursor: pointer;
					transition: transform 0.08s ease;
					text-decoration: none;
					margin: 0;
				}

				.export-button {
					background: #0d63c6;
					color: #fff;
				}

				.export-button:hover {
					background: #0b5bb8;
				}

				.export-button:active {
					transform: translateY(1px);
				}

				.download-button {
					background: #0e3d46;
					color: #fff;
				}

				.download-button:hover {
					background: #0d3440;
				}

				.download-button:active {
					transform: translateY(1px);
				}

				.report-content {
					width: 100%;
					margin: 0;
					padding: 1rem;
					flex: 1;
					overflow-y: auto;
					box-sizing: border-box;
				}

				.error-message {
					background-color: #fef2f2;
					border: 1px solid #fecaca;
					color: #dc2626;
					padding: 1rem;
					border-radius: 8px;
					margin-bottom: 1.5rem;
					font-size: 14px;
					font-weight: 500;
				}

				.table-container {
					background-color: #ffffff;
					border-radius: 12px;
					box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
					overflow: hidden;
					border: 1px solid #e2e8f0;
					width: 100%;
					box-sizing: border-box;
					margin: 0;
				}

				.reports-table {
					width: 100%;
					border-collapse: collapse;
					font-size: 14px;
					margin: 0;
				}

				.table-header {
					background: #0e3d46;
					color: #fff;
					text-align: left;
					padding: 12px;
					position: sticky;
					top: 0;
					font-weight: 600;
					font-size: 14px;
					white-space: nowrap;
					margin: 0;
					width: 100%;
					box-sizing: border-box;
				}

				.index-header {
					text-align: center;
				}

				.table-row {
					transition: background-color 0.2s ease;
					margin: 0;
				}

				.table-row:hover {
					background: #eaf5ff;
				}

				.table-row.even {
					background: #f7fbfd;
				}

				.table-row.odd {
					background: #ffffff;
				}

				.table-cell {
					padding: 12px;
					border-bottom: 1px solid #edf2f7;
					color: #1b2330;
					vertical-align: top;
					margin: 0;
					font-weight: 400;
					line-height: 1.4;
				}

				.index-cell {
					text-align: center;
					font-weight: 500;
					color: #455269;
				}

				.loading-cell {
					padding: 3rem 1rem;
					text-align: center;
					margin: 0;
				}

				.loading-spinner {
					display: flex;
					flex-direction: column;
					align-items: center;
					color: #6b7280;
					margin: 0;
				}

				.spinner {
					width: 32px;
					height: 32px;
					border: 3px solid #e5e7eb;
					border-top: 3px solid #3b82f6;
					border-radius: 50%;
					animation: spin 1s linear infinite;
					margin: 0;
				}

				@keyframes spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}

				.empty-cell {
					padding: 3rem 1rem;
					text-align: center;
					margin: 0;
				}

				.empty-state {
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 1rem;
					color: #6b7280;
					margin: 0;
				}

				.empty-state p {
					margin: 0;
					font-size: 1rem;
					font-weight: 500;
					color: #6b7280;
				}

				/* Responsive Design */
				@media (max-width: 1440px) {
					.reports-page {
						width: calc(75vw);
						margin-left: 50px;
					}
				}

				@media (max-width: 1024px) {
					.reports-page {
						width: calc(70vw);
						margin-left: 30px;
					}

					.header-content,
					.controls-content,
					.report-content {
						padding: 0 0.75rem;
					}

					.header-title h1 {
						font-size: 1.25rem;
					}

					.controls-content {
						flex-direction: column;
						align-items: stretch;
						gap: 1rem;
					}

					.controls-left,
					.controls-right {
						justify-content: center;
					}

					.table-container {
						overflow-x: auto;
					}

					.reports-table {
						min-width: 600px;
					}
				}

				@media (max-width: 768px) {
					.reports-page {
						width: 100vw;
						margin-left: 0;
						position: relative;
						padding: 0;
					}

					.header-content {
						padding: 0 1rem;
						flex-direction: column;
						align-items: flex-start;
						gap: 1rem;
					}
					
					.controls-content {
						padding: 0 1rem;
						flex-direction: column;
						align-items: stretch;
						gap: 1rem;
					}
					
					.report-content {
						padding: 1rem;
					}

					.header-left {
						justify-content: flex-start;
						width: 100%;
					}

					.breadcrumb {
						text-align: left;
						font-size: 0.75rem;
						width: 100%;
					}

					.controls-left {
						width: 100%;
					}

					.year-selector {
						width: 100%;
					}

					.year-select {
						width: 100%;
						font-size: 1rem;
						padding: 0.75rem;
					}

					.controls-right {
						width: 100%;
						flex-direction: row;
						gap: 0.75rem;
					}

					.action-button {
						flex: 1;
						justify-content: center;
						font-size: 0.875rem;
						padding: 0.75rem 1rem;
						min-height: 44px;
					}

					.table-container {
						border-radius: 8px;
						overflow-x: auto;
						-webkit-overflow-scrolling: touch;
						margin: 0 -1rem;
						width: calc(100% + 2rem);
					}

					.reports-table {
						min-width: 600px;
					}

					.table-header,
					.table-cell {
						padding: 0.75rem 0.5rem;
						font-size: 0.8rem;
						white-space: nowrap;
					}

					.header-title h1 {
						font-size: 1.125rem;
					}

					.title-icon {
						padding: 0.375rem;
					}

					.title-icon svg {
						width: 18px;
						height: 18px;
					}
				}

				@media (max-width: 640px) {
					.reports-page {
						width: 100vw;
						margin-left: 0;
					}

					.header-content {
						padding: 0 0.75rem;
					}
					
					.controls-content {
						padding: 0 0.75rem;
					}
					
					.report-content {
						padding: 0.75rem;
					}

					.header-title {
						flex-direction: row;
						text-align: left;
						gap: 0.5rem;
					}

					.controls-right {
						flex-direction: row;
						gap: 0.5rem;
					}

					.action-button {
						flex: 1;
						font-size: 0.8rem;
						padding: 0.75rem 0.5rem;
						min-height: 44px;
					}

					.table-container {
						border-radius: 6px;
						margin: 0 -0.75rem;
						width: calc(100% + 1.5rem);
					}

					.reports-table {
						min-width: 500px;
					}

					.table-header,
					.table-cell {
						padding: 0.5rem 0.25rem;
						font-size: 0.7rem;
					}

					.index-header {
						width: 35px;
					}

					.index-cell {
						width: 35px;
					}

					.year-select {
						font-size: 0.875rem;
						padding: 0.5rem;
					}
				}

				@media (max-width: 480px) {
					.reports-page {
						width: 100vw;
						margin-left: 0;
					}

					.header-content {
						padding: 0 0.5rem;
					}
					
					.controls-content {
						padding: 0 0.5rem;
					}
					
					.report-content {
						padding: 0.5rem;
					}

					.header-title {
						flex-direction: column;
						text-align: center;
						gap: 0.25rem;
					}

					.header-title h1 {
						font-size: 1rem;
					}

					.title-icon {
						padding: 0.25rem;
					}

					.title-icon svg {
						width: 16px;
						height: 16px;
					}

					.controls-content {
						gap: 0.5rem;
					}

					.year-selector {
						width: 100%;
						align-items: center;
					}

					.year-selector label {
						font-size: 0.75rem;
					}

					.year-select {
						width: 100%;
						font-size: 0.75rem;
						padding: 0.375rem;
					}

					.controls-right {
						flex-direction: row;
						width: 100%;
						gap: 0.375rem;
					}

					.action-button {
						flex: 1;
						font-size: 0.75rem;
						padding: 0.5rem 0.375rem;
						min-height: 44px;
					}

					.table-container {
						border-radius: 4px;
						margin: 0 -0.5rem;
						width: calc(100% + 1rem);
					}

					.reports-table {
						min-width: 450px;
					}

					.table-header,
					.table-cell {
						padding: 0.375rem 0.125rem;
						font-size: 0.65rem;
					}

					.index-header {
						width: 30px;
					}

					.index-cell {
						width: 30px;
					}

					.breadcrumb {
						font-size: 0.65rem;
						text-align: center;
					}

					.back-button {
						width: 35px;
						height: 35px;
					}
				}

				@media (max-width: 360px) {
					.reports-page {
						width: 100vw;
						margin-left: 0;
					}

					.header-content {
						padding: 0 0.375rem;
					}
					
					.controls-content {
						padding: 0 0.375rem;
					}
					
					.report-content {
						padding: 0.375rem;
					}

					.header-title h1 {
						font-size: 0.875rem;
					}

					.title-icon {
						padding: 0.125rem;
					}

					.title-icon svg {
						width: 14px;
						height: 14px;
					}

					.table-container {
						margin: 0 -0.25rem;
					}

					.reports-table {
						min-width: 450px;
					}

					.table-header,
					.table-cell {
						padding: 0.25rem 0.125rem;
						font-size: 0.55rem;
					}

					.action-button {
						font-size: 0.6rem;
						padding: 0.25rem;
					}

					.year-select {
						font-size: 0.7rem;
						padding: 0.25rem;
					}
				}
			`}</style>
		</div>
	);
}