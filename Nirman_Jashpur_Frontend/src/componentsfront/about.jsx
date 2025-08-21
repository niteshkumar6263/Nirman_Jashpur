import { useNavigate } from "react-router-dom";
const About = () => {
  return (
    <section className='section'>
        <div className="about-container">
            <div className="about-text">
                <p>डिजिटल - जशपुर</p>
                <h1>निर्माण जशपुर पोर्टल</h1>
                <button className = "link-forward">आगे बढ़े</button>
            </div>
            <div>
                <video controls muted playsInline autoPlay >
                    <source src="https://www.nirmanjashpur.in/assets/video/nirman.mp4"></source>
                </video>
            </div>
        </div>
    </section>
  )
}
export default About;