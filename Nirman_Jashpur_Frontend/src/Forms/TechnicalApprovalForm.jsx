import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Form.css";

export default function TechnicalApprovalPage({onLogout}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { workID } = useParams(); // ✅ get workID from route

  // Build crumbs from current path (Dashboard / WorkOrder / Add-Work-Order)
  const crumbs = React.useMemo(() => {
    const parts = location.pathname
      .split("/")
      .filter(Boolean)
      .map((s) =>
        s.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())
      );
    return [ ...parts].join(" / ");
  }, [location.pathname]);

  // Form state
  const [form, setForm] = useState({
    technicalApprovalNumber: "",
    technicalApprovalDate: "",
    amountSanctioned: "",
    forwardingDate: "",
    remarks: "",
    document: null, // ✅ file
  });

  // Optional: set page title
  useEffect(() => {
    document.title = "निर्माण | तकनीकी स्वीकृति";
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "document") {
      setForm((prev) => ({ ...prev, document: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogout = () => {
    if (window.confirm("क्या आप लॉगआउट करना चाहते हैं?")) {
      navigate("/");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Use FormData for file uploads
    const payload = new FormData();
    payload.append("workID", workID); // ✅ attach workID
    payload.append("technicalApprovalNumber", form.technicalApprovalNumber);
    payload.append("technicalApprovalDate", form.technicalApprovalDate);
    payload.append("amountSanctioned", form.amountSanctioned);
    payload.append("forwardingDate", form.forwardingDate);
    payload.append("remarks", form.remarks);
    if (form.document) {
      payload.append("document", form.document);
    }

    try {
      await axios.post(`/api/technical-approvals/${workID}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("तकनीकी स्वीकृति सफलतापूर्वक सहेजी गई!");
      setForm({
        technicalApprovalNumber: "",
        technicalApprovalDate: "",
        amountSanctioned: "",
        forwardingDate: "",
        remarks: "",
        document: null,
      });
    } catch (err) {
      console.error(err);
      alert("सबमिट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
    }
  };

  return (
    <div className="workorder-page">
      {/* Top bar */}
      <div className="header">
        <div className="top">
          <div className="brand">
            <div className="crumbs" id="crumbs">
              {crumbs}
            </div>
            <h1>निर्माण</h1>
          </div>
          <div className="right-top">
            <div className="user">
              <div className="ic" title="User">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-5.33 0-10 2.239-10 5v3h20v-3c0-2.761-4.67-5-10-5z" />
                </svg>
              </div>
              <button className="logout" aria-label="Logout" type="button" onClick={onLogout || (() => {
              if (window.confirm('क्या आप लॉगआउट करना चाहते हैं?')) {
                window.location.href = '/';
              }
            })}><i className="fa-solid fa-power-off" /></button>
            </div>
          </div>
        </div>

        <div className="subbar">
          <span className="dot" />
          <h2>तकनीकी स्वीकृति जोड़ें</h2>
        </div>
      </div>

      {/* Form card */}
      <div className="wrap">
        <section className="panel">
          <div className="panel-header">
            <h3>तकनीकी स्वीकृति</h3>
          </div>

          <form className="p-body" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  तकनीकी स्वीकृति क्रमांक <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="technicalApprovalNumber"
                  className="form-input"
                  placeholder="तकनीकी स्वीकृति क्रमांक"
                  value={form.technicalApprovalNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  तकनीकी स्वीकृति दिनांक <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <input
                    type="date"
                    name="technicalApprovalDate"
                    className="form-input"
                    value={form.technicalApprovalDate}
                    onChange={handleChange}
                    required
                  />
                  <span className="cal-ic" aria-hidden="true">
                    📅
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  तकनीकी स्वीकृति राशि (₹) <span className="req">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="amountSanctioned"
                  className="form-input"
                  placeholder="राशि"
                  value={form.amountSanctioned}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">प्रेषण दिनांक</label>
                <div className="input-with-icon">
                  <input
                    type="date"
                    name="forwardingDate"
                    className="form-input"
                    value={form.forwardingDate}
                    onChange={handleChange}
                  />
                  <span className="cal-ic" aria-hidden="true">
                    📅
                  </span>
                </div>
              </div>

              {/* File upload */}
              <div className="form-group file-input-wrapper">
                <label>दस्तावेज़ संलग्न करें (तकनीकी स्वीकृति):</label>
                <input
                  type="file"
                  name="document"
                  id="documentUpload"
                  className="file-input"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleChange}
                />
                <label htmlFor="documentUpload" className="custom-file-label">
                  फ़ाइल चुनें
                </label>
                <span className="file-name">
                  {form.document ? form.document.name : "कोई फ़ाइल चयनित नहीं"}
                </span>
              </div>
            </div>

            <div className="form-group full">
              <label className="form-label">टिप्पणी</label>
              <textarea
                name="remarks"
                className="form-input textarea"
                placeholder="टिप्पणी"
                rows={5}
                value={form.remarks}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}