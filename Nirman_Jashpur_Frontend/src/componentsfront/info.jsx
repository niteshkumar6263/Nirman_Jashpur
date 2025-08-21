const Display = () => {
  return (
    <div className='info'>
        <div className="info-container">
                <div class="box"></div>
                <img src="/public/images/cm.png" alt="overlap" class="overlap-img" />
        </div>
        <div className="info-text">
            <h1>परिचय</h1>
            <h2>निर्माण जशपुर को जानें</h2>
            <ul>
                <li>
                    <i class="fa-solid fa-hand-point-right pe-2 pb-3">
                    </i>
                    <p>
                     जशपुर जिला प्रशासन द्वारा एक अग्रणी पहल।</p>
                </li>
                <li>
                    <i class="fa-solid fa-hand-point-right pe-2 pb-3">
                    </i>
                    <span>
                     शासन को डिजिटाइज़ करता है और प्रक्रियाओं को सुव्यवस्थित करने के लिए सरकारी योजनाओं को एकीकृत करता है।</span>
                </li>
                <li>
                    <i class="fa-solid fa-hand-point-right pe-2 pb-3">
                    </i>
                    <p>
                     डिजिटल इंडिया इनिशिएटिव और 'सबका साथ , सबका विकास, सबका विश्वास' के सिद्धांतों के साथ संरेखित करता है</p>
                </li>
            </ul>
        </div>
    </div>
    );

}
export default Display;