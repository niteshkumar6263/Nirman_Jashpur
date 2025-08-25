import React, { useState } from "react";
import "./Table.css";

const TableR3 = () => {
  const [page] = useState(1);
  const [size, setSize] = useState(10);

  return (
    <div className="work-ref">
  <div className="header-bar">
    <h1 id="pageTitle">स्वीकृतकर्ता एजेंसीवार रिपोर्ट</h1>
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
            <div>स्वीकृतकर्ता एजेंसीवार रिपोर्ट</div>
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
                      "एजेंसी",
                      "कुल कार्य",
                      "निविदा स्तर पर",
                      "कार्य आदेश लंबित",
                      "कार्य आदेश जारी",
                      "कार्य प्रगति पर",
                      "कार्य पूर्ण",
                      "कार्य निरस्त",
                      "कार्य बंद",
                    ].map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* No data rows for now */}
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: 30 }}>
                      कोई रिकॉर्ड नहीं
                    </td>
                  </tr>
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

export default TableR3;
