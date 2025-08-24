import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Form.css";

export default function TenderForm({onLogout}) {
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
    tenderTitle: "",
    department: "",
    issuedDate: "",
    tenderId: "",
    document: null,
    remarks: "",
  });

  useEffect(() => {
    document.title = "निर्माण | निविदा प्रपत्र";
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
    payload.append("tenderTitle", form.tenderTitle);
    payload.append("department", form.department);
    payload.append("issuedDate", form.issuedDate);
    payload.append("tenderId", form.tenderId);
    if (form.document) payload.append("document", form.document);
    payload.append("remarks", form.remarks);

    try {
      await axios.post(`/api/tenders/${workID}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("निविदा सफलतापूर्वक सहेजी गई!");
      setForm({
        tenderTitle: "",
        department: "",
        issuedDate: "",
        tenderId: "",
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
          <h2>निविदा जोड़ें</h2>
        </div>
      </div>

      {/* Form Card */}
      <div className="wrap">
        <section className="panel">
          <div className="panel-header">
            <h3>निविदा प्रपत्र</h3>
          </div>

          <form className="p-body" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  निविदा शीर्षक <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="tenderTitle"
                  className="form-input"
                  placeholder="Tender Title"
                  value={form.tenderTitle}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  विभाग <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  className="form-input"
                  placeholder="Department"
                  value={form.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  जारी तिथि <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <input
                    type="date"
                    name="issuedDate"
                    className="form-input"
                    value={form.issuedDate}
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
                  निविदा आईडी <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="tenderId"
                  className="form-input"
                  placeholder="Tender ID"
                  value={form.tenderId}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* File Upload */}
              <div className="form-group file-input-wrapper">
                <label>संलग्न दस्तावेज़</label>
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
