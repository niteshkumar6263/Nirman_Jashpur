import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Form.css";

export default function AdministrativeApprovalPage({onLogout}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { workID } = useParams();

  // Breadcrumbs
  const crumbs = React.useMemo(() => {
    const parts = location.pathname
      .split("/")
      .filter(Boolean)
      .map((s) =>
        s.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())
      );
    return [...parts].join(" / ");
  }, [location.pathname]);

  // Form state
  const [form, setForm] = useState({
    govtDistrictAS: "",
    approvalNumber: "",
    approvalDate: "",
    approvalAmount: "",
    document: null,
    remarks: "",
  });

  useEffect(() => {
    document.title = "निर्माण | प्रशासकीय स्वीकृति";
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

    const payload = new FormData();
    payload.append("workID", workID);
    payload.append("govtDistrictAS", form.govtDistrictAS);
    payload.append("approvalNumber", form.approvalNumber);
    payload.append("approvalDate", form.approvalDate);
    payload.append("approvalAmount", form.approvalAmount);
    if (form.document) payload.append("document", form.document);
    payload.append("remarks", form.remarks);

    try {
      await axios.post(`/api/admin-approvals/${workID}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("प्रशासकीय स्वीकृति सफलतापूर्वक सहेजी गई!");
      setForm({
        govtDistrictAS: "",
        approvalNumber: "",
        approvalDate: "",
        approvalAmount: "",
        document: null,
        remarks: "",
      });
    } catch (err) {
      console.error(err);
      alert("सबमिट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
    }
  };

  return (
    <div className="workorder-page">
      {/* Header */}
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
                👤
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
          <h2>प्रशासकीय स्वीकृति जोड़ें</h2>
        </div>
      </div>

      {/* Form Card */}
      <div className="wrap">
        <section className="panel">
          <div className="panel-header">
            <h3>प्रशासकीय स्वीकृति</h3>
          </div>

          <form className="p-body" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  सरकार/जिला द्वारा ए.एस <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="govtDistrictAS"
                  className="form-input"
                  placeholder="By Govt/District A.S"
                  value={form.govtDistrictAS}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  प्रशासकीय स्वीकृति क्रमांक <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="approvalNumber"
                  className="form-input"
                  placeholder="Administrative Approval Number"
                  value={form.approvalNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  प्रशासकीय स्वीकृति दिनांक <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <input
                    type="date"
                    name="approvalDate"
                    className="form-input"
                    value={form.approvalDate}
                    onChange={handleChange}
                    required
                  />
                  <span className="cal-ic">📅</span>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  प्रशासकीय स्वीकृति की राशि (₹) <span className="req">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="approvalAmount"
                  className="form-input"
                  placeholder="राशि"
                  value={form.approvalAmount}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* File Upload */}
              <div className="form-group file-input-wrapper">
                <label>दस्तावेज़/फोटो अपलोड करें:</label>
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
                placeholder="विवरण"
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
