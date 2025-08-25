import React, { useState } from "react";
import "./Table.css";

const TableR4 = () => {
  const [page] = useState(1);
  const [size, setSize] = useState(10);

  // Sample data (from your screenshot)
  const data = [
    {
      id: 1,
      agency: "जनपद पंचायत फर्साबहार",
      total: 1,
      techApproval: 0,
      adminApproval: 0,
      tender: 0,
      inProgress: 1,
      completed: 0,
    },
  ];

  return (
    <div className="work-ref">
  <div className="header-bar">
    <h1 id="pageTitle">एजेंसीवार दस्तावेजों की संख्या सूची</h1>
    <div className="actions">
      <button className="btn" type="button">
        <i className="fa-solid fa-file-excel" /> Excel Export
      </button>
      <button className="btn" type="button">
        <i className="fa-solid fa-download" /> Download
      </button>
    </div>
  </div>


      <div className="wrap">
        <section className="panel table-card">
          <div className="table-head">
            <div>एजेंसीवार दस्तावेज़ों की संख्या रिपोर्ट</div>
            <small>
              Show{" "}
              <select
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value) || 10)}
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>{" "}
              entries
            </small>
          </div>
          <div className="p-body">
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    {[
                      "क्र.",
                      "एजेंसी का नाम",
                      "कुल कार्य",
                      "तकनीकी स्वीकृति",
                      "प्रशासनिक स्वीकृति",
                      "निविदा",
                      "कार्य प्रगति",
                      "कार्य पूर्ण",
                    ].map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((row) => (
                      <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>{row.agency}</td>
                        <td>{row.total}</td>
                        <td>{row.techApproval}</td>
                        <td>{row.adminApproval}</td>
                        <td>{row.tender}</td>
                        <td>{row.inProgress}</td>
                        <td>{row.completed}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        style={{ textAlign: "center", padding: 30 }}
                      >
                        कोई रिकॉर्ड नहीं
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="pager">
              <button
                aria-label="Previous page"
                className={"page nav disabled"}
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
              <button className="page active">{page}</button>
              <button
                aria-label="Next page"
                className={"page nav disabled"}
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TableR4;
