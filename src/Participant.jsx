import { useState } from 'react';
import './Participant.css';
function Participant({ onSubmit }) {
    const [participantID, setParticipantID] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [postingFrequency, setPostingFrequency] = useState('');
    const [writingFrequency, setWritingFrequency] = useState('');
    const [trained, setTrained] = useState('');
    const [AIwriting, setAIwriting] = useState('');
    const [creationActivity, setCreationActivity] = useState('');
    return (
        <div className="participant">
            <h4>Please enter your participant ID:</h4>
            <input
                type="text"
                value={participantID}
                onChange={(e) => setParticipantID(e.target.value)}
            />
            <h4>Please enter your age:</h4>
            <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
            />
            <h4>Please select your gender:</h4>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            <h4>What best describes your current role or content creation activities?</h4>
            <select value={creationActivity} onChange={(e) => setCreationActivity(e.target.value)}>
                <option value="">Select...</option>
                <option value="web developer">Front-end Developer / Web Developer</option>
                <option value="social media content creator">Social Media Content Creator</option>
                <option value="ux/ui designer">UX/UI Designer</option>
                <option value="photographer">Photographer</option>
                <option value="other">Other</option>
            </select>
            <h4>How frequently does your work or activities involve producing or publishing image-based content?</h4>
            <select value={postingFrequency} onChange={(e) => setPostingFrequency(e.target.value)}>
                <option value="">Select...</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="rarely">Rarely</option>
                <option value="never">Never</option>
            </select>
            <h4>How often do you write alt text for images?</h4>
            <select value={writingFrequency} onChange={(e) => setWritingFrequency(e.target.value)}>
                <option value="">Select...</option>
                <option value="always">Always</option>
                <option value="often">Often</option>
                <option value="sometimes">Sometimes</option>
                <option value="rarely">Rarely</option>
                <option value="never">Never</option>
            </select>
            <h4>Have you received any accessibility-related training or are you familiar with the WCAG standards?</h4>
            <select value={trained} onChange={(e) => setTrained(e.target.value)}>
                <option value="">Select...</option>
                <option value="yes">I use them regularly</option>
                <option value="middle">I have some knowledge of them but don't use them regularly</option>
                <option value="no">No</option>
            </select>
            <h4>Have you ever used AI tools to assist with writing alt text or generating image descriptions?</h4>
            <select value={AIwriting} onChange={(e) => setAIwriting(e.target.value)}>
                <option value="">Select...</option>
                <option value="frequently">Yes, frequently</option>
                <option value="occasionally">Yes, occasionally</option>
                <option value="no">No</option>
            </select>
            <button
                onClick={() => {
                    if (
                        !participantID ||
                        !age ||
                        !gender ||
                        !creationActivity ||
                        !postingFrequency ||
                        !writingFrequency ||
                        !trained ||
                        !AIwriting
                    ) {
                        alert('Please complete all fields before submitting.');
                        return;
                    }

                    const formData = {
                        participantID,
                        age,
                        gender,
                        creationActivity,
                        postingFrequency,
                        writingFrequency,
                        trained,
                        AIwriting,
                    };

                    onSubmit(formData);
                }}
            >
                Submit
            </button>
        </div>
    );
}
export default Participant;