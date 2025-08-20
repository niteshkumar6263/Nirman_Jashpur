import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import './technicalApproval.css';

/* Utility hooks */
function useDebounce(value, delay=200){
	const [v,setV]=useState(value);
	useEffect(()=>{
		const t=setTimeout(()=>setV(value),delay);
		return ()=>clearTimeout(t);
	},[value,delay]);
	return v;
}

function useLocalStorage(key, initial){
	const [state,setState]=useState(()=>{
		try{
			const stored=localStorage.getItem(key);
			return stored!==null ? JSON.parse(stored) : initial;
		}catch{ return initial; }
	});
	useEffect(()=>{
		try{ localStorage.setItem(key, JSON.stringify(state)); }catch{}
	},[key,state]);
	return [state,setState];
}

const COLS = [
	{ key:'sr', label:'क्र.' },
	{ key:'name', label:'कार्य का नाम' },
	{ key:'area', label:'क्षेत्र' },
	{ key:'agency', label:'कार्य एजेन्सी' },
	{ key:'yojna', label:'योजना' },
	{ key:'tech', label:'तकनीकी स्वीकृति' },
	{ key:'admin', label:'प्रशासकीय स्वीकृति' },
	{ key:'tender', label:'निविदा स्वीकृति' },
	{ key:'stage', label:'कार्य प्रगति चरण' },
	{ key:'desc', label:'कार्य विवरण', noSort:true },
	{ key:'act', label:'कार्रवाही', noSort:true }
];

function generateData(){
	return Array.from({length:37}).map((_,i)=>({
		sr:i+1,
		name: i % 3 === 0 ? 'सी.सी. रोड निर्माण' : (i % 3 === 1 ? 'विद्यालय भवन मरम्मत' : 'आंगनवाड़ी निर्माण'),
		area: ['बगीचा','कस्बा A','ब्लॉक B','पत्थलगांव','कुनकुरी'][i%5],
		agency: ['PWD','Rural Engg.','Janpad Panchayat'][i%3],
		yojna: ['Suguja Chetra Pradhikaran','CM योजना','RG योजना'][i%3],
		tech: ['स्वीकृत','लंबित','स्वीकृत'][i%3],
		admin: ['स्वीकृत','लंबित','नहीं'][i%3],
		tender: ['जारी','लंबित','नहीं'][i%3],
		stage: ['DPR','कार्य आदेश स्थिति','प्रारंभ'][i%3],
		desc: '—',
		act: 'देखें'
	}));
}

export default function TechnicalApproval({ onLogout }){
	// Data + state
	const [rows,setRows]=useState(()=>generateData());
	const [query,setQuery]=useState('');
	const debouncedQuery = useDebounce(query,200);
	const [entries,setEntries]=useState(10);
	const [page,setPage]=useState(1);
	const [sort,setSort]=useState({col:null,dir:1});

		
		const viewDialogRef=useRef(null);
		const addDialogRef=useRef(null);
		const deleteDialogRef=useRef(null);
		const addFormRef = useRef(null);

	const [viewRow,setViewRow]=useState(null);
	const [deleteTarget,setDeleteTarget]=useState(null);


	const filtered = useMemo(()=>{
		if(!debouncedQuery.trim()) return rows;
		const q=debouncedQuery.toLowerCase();
		return rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
	},[rows,debouncedQuery]);


	const sorted = useMemo(()=>{
		if(!sort.col) return filtered;
		const copy=[...filtered];
		copy.sort((a,b)=>{
			if(a[sort.col] < b[sort.col]) return -1*sort.dir;
			if(a[sort.col] > b[sort.col]) return  1*sort.dir;
			return 0;
		});
		return copy;
	},[filtered,sort]);

	
	const paged = useMemo(()=>{
		const start=(page-1)*entries;
		return sorted.slice(start,start+entries);
	},[sorted,page,entries]);

	useEffect(()=>{
		// reset page if filter or page size changes causing out-of-range
		const maxPage = Math.max(1, Math.ceil(sorted.length / entries));
		if(page>maxPage) setPage(1);
	},[sorted,entries,page]);

	const total=sorted.length;
	const startIdx= total ? (page-1)*entries+1 : 0;
	const endIdx = Math.min(page*entries, total);

	
	const toggleSort = (col)=>{
		if(col===sort.col){
			setSort(s=>({col, dir: s.dir*-1}));
		} else {
			setSort({col, dir:1});
		}
	};

	
	const openView = (sr)=>{
		const r=rows.find(r=>r.sr===sr);
		setViewRow(r||null);
		viewDialogRef.current?.showModal();
	};


	const getFieldLabel = (key) => {
		const labels = {
			sr: 'क्रमांक',
			name: 'कार्य का नाम',
			area: 'क्षेत्र',
			agency: 'कार्य एजेन्सी',
			yojna: 'योजना',
			tech: 'तकनीकी स्वीकृति',
			admin: 'प्रशासकीय स्वीकृति',
			tender: 'निविदा स्वीकृति',
			stage: 'कार्य प्रगति चरण',
			desc: 'कार्य विवरण'
		};
		return labels[key] || key;
	};

	const confirmDelete = (sr)=>{
		setDeleteTarget(sr);
		deleteDialogRef.current?.showModal();
	};

	const doDelete = ()=>{
		if(deleteTarget==null) return;
		setRows(prev=>{
			const next = prev.filter(r=>r.sr!==deleteTarget)
											 .map((r,i)=>({...r,sr:i+1}));
			return next;
		});
		setDeleteTarget(null);
		deleteDialogRef.current?.close();
	};

	const onAddSubmit = (e)=>{
		e.preventDefault();
		const fd = new FormData(e.target);
		setRows(prev=>{
			const newRow = {
				sr: prev.length+1,
				name: fd.get('name')||'',
				area: fd.get('area')||'',
				agency: fd.get('agency')||'',
				yojna: fd.get('yojna')||'',
				tech: fd.get('tech')||'लंबित',
				admin: fd.get('admin')||'लंबित',
				tender: fd.get('tender')||'लंबित',
				stage: fd.get('stage')||'DPR',
				desc: fd.get('desc')||''
			};
			return [...prev, newRow];
		});
		e.target.reset();
		addDialogRef.current?.close();
	};

	const exportCSV = ()=>{
		const cols=['sr','name','area','agency','yojna','tech','admin','tender','stage','desc'];
		const lines=[cols.join(',')];
		sorted.forEach(r=>{
			lines.push(cols.map(c=>`"${String(r[c]??'').replace(/"/g,'""')}"`).join(','));
		});
		const blob = new Blob([lines.join('\n')],{type:'text/csv;charset=utf-8;'});
		const url=URL.createObjectURL(blob);
		const a=document.createElement('a');
		a.href=url;
		a.download='technical_sanction.csv';
		document.body.appendChild(a); a.click(); a.remove();
		URL.revokeObjectURL(url);
	};

	const printTable = ()=>{
		const tableHtml = document.getElementById('tech-table-wrap')?.innerHTML || '';
		const w = window.open('','_blank');
		w.document.write(`<!doctype html><html><head><title>Print</title>
			<style>
				body{font-family:Inter,Arial,sans-serif;padding:20px;}
				table{width:100%;border-collapse:collapse;}
				th,td{border:1px solid #ccc;padding:6px 8px;font-size:12px;}
				thead th{background:#0a3443;color:#fff;}
				h2{margin:0 0 12px;}
			</style></head><body><h2>तकनीकी स्वीकृति</h2>${tableHtml}</body></html>`);
		w.document.close(); w.focus(); setTimeout(()=>w.print(),300);
	};

	const refresh = ()=>{
		setQuery('');
		setSort({col:null,dir:1});
		setPage(1);
	};

	const activeSortIcon = useCallback((col)=>{
		if(sort.col!==col) return 'fa-sort';
		return sort.dir===1 ? 'fa-sort-up' : 'fa-sort-down';
	},[sort]);

		return (
			<div className="tech-wrapper" role="region" aria-label="Technical approval section">
				<div className="tech-page-title-band">
					<div>
						<span className="tech-page-title" role="heading" aria-level="1">तकनीकी स्वीकृति</span>
						<small className="muted" style={{marginLeft:'8px'}}>Dashboard / Sanction / Technical-Sanction</small>
					</div>
					{onLogout && (
						<div className="tech-user-controls">
							<div className="tech-user-icon" tabIndex={0} aria-label="User profile">
								<i className="fa-solid fa-user"></i>
							</div>
							<button 
								className="tech-logout-btn" 
								aria-label="Logout" 
								type="button" 
								onClick={onLogout || (() => {
									if (window.confirm('क्या आप लॉगआउट करना चाहते हैं?')) {
										window.location.href = '/';
									}
								})}
							>
								<i className="fa-solid fa-power-off"></i>
							</button>
						</div>
					)}
				</div>
				<section className="tech-card" aria-label="Technical Sanction Table">
					<div className="card-header">
						<span>तकनीकी स्वीकृति सूची</span>
					</div>

						<div className="card-toolbar" aria-label="Table actions">
							<div className="actions-cluster" style={{marginLeft:'auto'}}>
								<button className="icon-btn primary" title="Search">
									<i className="fa-solid fa-search"></i>
								</button>
								<button className="icon-btn" title="Refresh" onClick={refresh}><i className="fa-solid fa-rotate"></i></button>
								<button className="icon-btn" title="Print" onClick={printTable}><i className="fa-solid fa-print"></i></button>
								<button className="icon-btn" title="Export (CSV)" onClick={exportCSV}><i className="fa-solid fa-file-export"></i></button>
								<button className="icon-btn success" title="Add New" onClick={()=>addDialogRef.current?.showModal()}><i className="fa-solid fa-plus"></i></button>
							</div>
						</div>

						<div className="controls">
							<div className="control-left">
								<label htmlFor="entries">Show</label>
								<select
									id="entries"
									value={entries}
									onChange={e=>{setEntries(parseInt(e.target.value,10)); setPage(1);}}
								>
									{[10,25,50,100].map(n=> <option key={n} value={n}>{n}</option>)}
								</select>
								<span>entries</span>
								<span className="entries-current">({startIdx}-{endIdx} / {total||0})</span>
							</div>
							<div className="control-right">
								<label htmlFor="search">Search:</label>
								<input
									id="search"
									className="search"
									type="search"
									placeholder="खोजें..."
									value={query}
									onChange={e=>setQuery(e.target.value)}
									aria-label="Search table"
								/>
							</div>
						</div>

						<div className="table-wrap" id="tech-table-wrap">
							<table aria-describedby="tableStatus">
								<thead>
									<tr>
										{COLS.map(c=>{
											const sortable=!c.noSort;
											const isActive = sort.col===c.key;
											return (
												<th
													key={c.key}
													className={sortable?`sortable ${isActive?'active':''}`:''}
													data-col={c.key}
													onClick={sortable?()=>toggleSort(c.key):undefined}
													aria-sort={isActive ? (sort.dir===1?'ascending':'descending') : undefined}
												>
													{c.label} {sortable && (
														<span
															className={`sort-icon fa-solid ${activeSortIcon(c.key)}`}
															aria-hidden="true"
														></span>
													)}
												</th>
											);
										})}
									</tr>
								</thead>
								<tbody>
									{paged.length===0 && (
										<tr>
											<td className="empty" colSpan={COLS.length}>No data available in table</td>
										</tr>
									)}
									{paged.map(r=>(
										<tr key={r.sr}>
											<td>{r.sr}</td>
											<td>{r.name}</td>
											<td>{r.area}</td>
											<td>{r.agency}</td>
											<td>{r.yojna}</td>
											<td>{r.tech}</td>
											<td>{r.admin}</td>
											<td>{r.tender}</td>
											<td>{r.stage}</td>
											<td>{r.desc}</td>
											<td>
												<div className="row-actions">
													<button
														className="view"
														title="देखें"
														onClick={()=>openView(r.sr)}
													>
														<i className="fa-solid fa-eye"></i>
													</button>
													<button
														className="delete"
														title="हटाएं"
														onClick={()=>confirmDelete(r.sr)}
													>
														<i className="fa-solid fa-trash"></i>
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<div
								id="tableStatus"
								role="status"
								aria-live="polite"
								style={{position:'absolute', left:'-9999px', top:'auto', width:'1px', height:'1px', overflow:'hidden'}}
							>
								{`कुल ${total} मदें। दिखा रहे हैं ${startIdx} से ${endIdx} तक। पृष्ठ ${page}.`}
							</div>
						</div>

						<div className="table-info-visible">{total ? `Showing ${startIdx} to ${endIdx} of ${total} entries` : 'No entries'}</div>
						<div className="pagination" role="navigation" aria-label="Pagination">
							<button
								className="page-btn"
								disabled={page===1}
								onClick={()=>setPage(p=>Math.max(1,p-1))}
							>Previous</button>
							<button
								className="page-btn"
								disabled={endIdx>=total}
								onClick={()=>setPage(p=>{
									const maxPage=Math.ceil(total/entries);
									return Math.min(maxPage,p+1);
								})}
							>Next</button>
						</div>
			</section>

			{/* View Dialog */}
			<dialog id="viewDialog" ref={viewDialogRef}>
				<form method="dialog">
					<h3>कार्य विवरण</h3>
					<div className="dialog-content">
						{viewRow && (
							<table className="dialog-table">
								<tbody>
									{Object.entries(viewRow).map(([k,v])=>(
										<tr key={k}>
											<th>{getFieldLabel(k)}</th>
											<td>{v||'—'}</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
					<div className="dialog-actions">
						<button className="btn" type="button" onClick={()=>viewDialogRef.current?.close()}>Close</button>
					</div>
				</form>
			</dialog>

			{/* Add Dialog */}
			<dialog id="addDialog" ref={addDialogRef}>
				<form method="dialog" id="addForm" ref={addFormRef} onSubmit={onAddSubmit}>
					<h3 style={{marginTop:0}}>नया कार्य जोड़ें</h3>
					<div style={{display:'grid',gap:10,gridTemplateColumns:'1fr 1fr'}}>
						{[
							['नाम','name','text'],
							['क्षेत्र','area','text'],
							['एजेन्सी','agency','text'],
							['योजना','yojna','text']
						].map(([lbl,name,type])=>(
							<label key={name} style={{display:'flex',flexDirection:'column',fontSize:'.8rem',gap:4}}>
								{lbl}
								<input required name={name} type={type}/>
							</label>
						))}
						<label style={{display:'flex',flexDirection:'column',fontSize:'.8rem',gap:4}}>
							तकनीकी स्वीकृति
							<select name="tech">
								<option value="स्वीकृत">स्वीकृत</option>
								<option value="लंबित">लंबित</option>
							</select>
						</label>
						<label style={{display:'flex',flexDirection:'column',fontSize:'.8rem',gap:4}}>
							प्रशासकीय स्वीकृति
							<select name="admin">
								<option value="स्वीकृत">स्वीकृत</option>
								<option value="लंबित">लंबित</option>
								<option value="नहीं">नहीं</option>
							</select>
						</label>
						<label style={{display:'flex',flexDirection:'column',fontSize:'.8rem',gap:4}}>
							निविदा स्वीकृति
							<select name="tender">
								<option value="जारी">जारी</option>
								<option value="लंबित">लंबित</option>
								<option value="नहीं">नहीं</option>
							</select>
						</label>
						<label style={{display:'flex',flexDirection:'column',fontSize:'.8rem',gap:4}}>
							प्रगति चरण
							<select name="stage">
								<option value="DPR">DPR</option>
								<option value="कार्य आदेश स्थिति">कार्य आदेश स्थिति</option>
								<option value="प्रारंभ">प्रारंभ</option>
							</select>
						</label>
						<label style={{gridColumn:'1 / -1',display:'flex',flexDirection:'column',fontSize:'.8rem',gap:4}}>
							विवरण
							<textarea name="desc" rows={2} style={{resize:'vertical'}}></textarea>
						</label>
					</div>
					<div style={{marginTop:18,display:'flex',gap:8,justifyContent:'flex-end'}}>
						<button className="btn" type="button" onClick={()=>addDialogRef.current?.close()}>Cancel</button>
						<button className="btn icon" style={{background:'#029451',color:'#fff'}} value="submit" type="submit">Save</button>
					</div>
				</form>
			</dialog>

			{/* Delete Confirm */}
			<dialog id="confirmDialog" ref={deleteDialogRef}>
				<form method="dialog" onSubmit={(e)=>{e.preventDefault(); doDelete();}}>
					<h3 style={{marginTop:0}}>हटाने की पुष्टि</h3>
					<p style={{maxWidth:420}}>
						{deleteTarget!=null ? `क्या आप क्रमांक ${deleteTarget} को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं होगी।` : ''}
					</p>
					<div style={{marginTop:18,display:'flex',gap:8,justifyContent:'flex-end'}}>
						<button className="btn" type="button" onClick={()=>deleteDialogRef.current?.close()}>Cancel</button>
						<button className="btn icon" style={{background:'#a30014',color:'#fff'}} type="submit">Delete</button>
					</div>
				</form>
			</dialog>
		</div>
	);
}