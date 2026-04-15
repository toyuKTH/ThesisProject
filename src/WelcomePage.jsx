import "./WelcomePage.css";
function WelcomePage({ onStart }) {
    return (
        <div className="welcome-page">
            <h1>Image Description Writing Study for BLV Users</h1>
            <p>In this study, you will be asked to write image descriptions for a person who cannot see the image. Some tasks may include brief AI feedback. Please click the button below to begin.</p>
            <button
                className="navigate-button"
                onClick={() => {
                    onStart();
                }}
            >
                Get Started
            </button>
        </div>
    );
}
export default WelcomePage;