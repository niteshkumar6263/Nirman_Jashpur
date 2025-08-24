import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./WorkInProgressForm.css";

export default function WorkInProgressForm({onLogout}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { workID } = useParams();

  // ✅ Breadcrumbs based on path
  const crumbs = React.useMemo(() => {
    const parts = location.pathname
      .split("/")
      .filter(Boolean)
      .map((s) =>
        s.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())
      );
    return [...parts].join(" / ");
  }, [location.pathname]);

  // ✅ Set Page Title
  useEffect(() => {
    document.title = "निर्माण | राशि प्रगति प्रपत्र";
  }, []);

  const [rows, setRows] = useState([{ kisht: 1, amount: "", date: "" }]);
  const [form, setForm] = useState({
    sanctionedAmount: "",
    releasedAmount: "",
    remainingAmount: "",
    mbStage: "",
    expenditureAmount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index][name] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { kisht: rows.length + 1, amount: "", date: "" }]);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleLogout = () => {
    if (window.confirm("क्या आप लॉगआउट करना चाहते हैं?")) {
      navigate("/");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", { ...form, rows });
    alert("राशि प्रगति प्रपत्र सफलतापूर्वक सहेजा गया!");
  };

  return (
    <div className="workprogress-page">
      {/* ✅ Top bar */}
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
          <h2>राशि प्रगति प्रपत्र</h2>
        </div>
      </div>

      {/* ✅ Form card */}
      <div className="wrap">
        <section className="panel">
          <div className="panel-header">
            <h3>राशि प्रगति विवरण</h3>
          </div>

          <form className="p-body" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>स्वीकृत राशि</label>
                <input
                  type="number"
                  name="sanctionedAmount"
                  value={form.sanctionedAmount}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="राशि दर्ज करें"
                />
              </div>
              <div className="form-group">
                <label>कुल प्रदाय राशि</label>
                <input
                  type="number"
                  name="releasedAmount"
                  value={form.releasedAmount}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="कुल प्रदाय राशि"
                />
              </div>
              <div className="form-group">
                <label>शेष राशि</label>
                <input
                  type="number"
                  name="remainingAmount"
                  value={form.remainingAmount}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="शेष राशि"
                />
              </div>
            </div>

            {/* ✅ Dynamic Rows Table */}
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>किस्त क्रमांक</th>
                    <th>राशि</th>
                    <th>दिनांक</th>
                    <th>एक्शन</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td>{row.kisht}</td>
                      <td>
                        <input
                          type="number"
                          name="amount"
                          value={row.amount}
                          onChange={(e) => handleRowChange(index, e)}
                          className="form-input"
                          placeholder="राशि"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          name="date"
                          value={row.date}
                          onChange={(e) => handleRowChange(index, e)}
                          className="form-input"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => removeRow(index)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" className="btn-add" onClick={addRow}>
                + नई पंक्ति जोड़ें
              </button>
            </div>

            {/* ✅ MB Stage + Expenditure */}
            <div className="form-grid">
              <div className="form-group">
                <label>एम बी स्टेज</label>
                <select
                  name="mbStage"
                  value={form.mbStage}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">-- स्टेज चुनें --</option>
                  <option value="Stage 1">स्टेज 1</option>
                  <option value="Stage 2">स्टेज 2</option>
                  <option value="Stage 3">स्टेज 3</option>
                </select>
              </div>
              <div className="form-group">
                <label>व्यय राशि</label>
                <input
                  type="number"
                  name="expenditureAmount"
                  value={form.expenditureAmount}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="व्यय राशि"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Save
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
