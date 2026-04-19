import "./WelcomePage.css";
function WelcomePage({ onStart }) {
    return (
        <div className="welcome-page">
            <h1>Image Description Writing Study for <br></br>Blind and Low Vision Accessibility</h1>
            <p>Welcome to this research study.

                The purpose of this study is to explore how people experience writing image descriptions for blind or low vision users, with and without AI assistance. During the study, you will complete a series of image description tasks, answer short post task questionnaires, and take part in a brief follow up interview.

                Your participation is voluntary. By clicking the button below to begin, you indicate that you have read the study information provided by the researcher and consent to participate in this study.</p>
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