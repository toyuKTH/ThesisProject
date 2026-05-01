import { useState } from 'react';
import './Participant.css';

function Participant({ onSubmit, onIneligible }) {
  const [screeningCompleted, setScreeningCompleted] = useState(false);
  const [englishComfort, setEnglishComfort] = useState('');
  const [imageContentExperience, setImageContentExperience] = useState('');

  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [postingFrequency, setPostingFrequency] = useState('');
  const [writingFrequency, setWritingFrequency] = useState('');
  const [accessibilityTraining, setAccessibilityTraining] = useState('');
  const [wcagFamiliarity, setWcagFamiliarity] = useState('');
  const [aiWritingGeneral, setAiWritingGeneral] = useState('');
  const [aiImageDescription, setAiImageDescription] = useState('');

  const handleScreeningSubmit = () => {
    if (!englishComfort || !imageContentExperience) {
      alert('Please complete these questions before continuing.');
      return;
    }

    if (englishComfort !== 'yes' || imageContentExperience !== 'yes') {
      onIneligible();
      return;
    }

    setScreeningCompleted(true);
  };

  const handleBackgroundSubmit = () => {
    if (
      !age ||
      !gender ||
      !postingFrequency ||
      !writingFrequency ||
      !accessibilityTraining ||
      !wcagFamiliarity ||
      !aiWritingGeneral ||
      !aiImageDescription
    ) {
      alert('Please complete all fields before submitting.');
      return;
    }

    const formData = {
      screening: {
        englishComfort,
        imageContentExperience,
      },
      age,
      gender,
      postingFrequency,
      writingFrequency,
      accessibilityTraining,
      wcagFamiliarity,
      aiWritingGeneral,
      aiImageDescription,
    };

    onSubmit(formData);
  };

  if (!screeningCompleted) {
    return (
      <div className="participant">
        <h2>Before You Start</h2>
        <p className="subtitle">
          Please answer these questions before continuing to the study.
        </p>
        <hr className="divider" />

        <h4>Are you comfortable writing in English?</h4>
        <select
          value={englishComfort}
          onChange={(e) => setEnglishComfort(e.target.value)}
        >
          <option value="">Select...</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <h4>
          Do you have any experience creating or publishing digital content that includes images, such as social media posts, web pages, presentations, or design work?
        </h4>
        <select
          value={imageContentExperience}
          onChange={(e) => setImageContentExperience(e.target.value)}
        >
          <option value="">Select...</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <button onClick={handleScreeningSubmit}>Continue</button>
      </div>
    );
  }

  return (
    <div className="participant">
      <h3 className="participant-title">
        Please provide some background information before starting the tasks.
      </h3>

      <h4>Please enter your age:</h4>
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <h4>Please select your gender:</h4>
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Select...</option>
        <option value="woman">Woman</option>
        <option value="man">Man</option>
        <option value="non_binary">Non-binary</option>
        <option value="other">Other</option>
        <option value="prefer_not_to_say">Prefer not to say</option>
      </select>



      <h4>How often do you create or publish image-based content?</h4>
      <select
        value={postingFrequency}
        onChange={(e) => setPostingFrequency(e.target.value)}
      >
        <option value="">Select...</option>
        <option value="very_often">Very often</option>
        <option value="often">Often</option>
        <option value="sometimes">Sometimes</option>
        <option value="rarely">Rarely</option>
        <option value="never">Never</option>
      </select>

      <h4>How often do you write alt text or image descriptions?</h4>
      <p className="question-note">
        (Alt text or image descriptions refer to short written descriptions that make image content accessible to people who cannot see the image.)
      </p>
      <select
        value={writingFrequency}
        onChange={(e) => setWritingFrequency(e.target.value)}
      >
        <option value="">Select...</option>
        <option value="very_often">Very often</option>
        <option value="often">Often</option>
        <option value="sometimes">Sometimes</option>
        <option value="rarely">Rarely</option>
        <option value="never">Never</option>
      </select>

      <h4>Have you received any formal accessibility training?</h4>
      <select
        value={accessibilityTraining}
        onChange={(e) => setAccessibilityTraining(e.target.value)}
      >
        <option value="">Select...</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
        <option value="not_sure">Not sure</option>
      </select>

      <h4>How familiar are you with accessibility guidelines such as WCAG?</h4>
      <select
        value={wcagFamiliarity}
        onChange={(e) => setWcagFamiliarity(e.target.value)}
      >
        <option value="">Select...</option>
        <option value="not_familiar">Not familiar at all</option>
        <option value="slightly_familiar">Slightly familiar</option>
        <option value="moderately_familiar">Moderately familiar</option>
        <option value="very_familiar">Very familiar</option>
        <option value="extremely_familiar">Extremely familiar</option>
      </select>

      <h4>How often do you use AI tools for writing in general?</h4>
      <select
        value={aiWritingGeneral}
        onChange={(e) => setAiWritingGeneral(e.target.value)}
      >
        <option value="">Select...</option>
        <option value="very_often">Very often</option>
        <option value="often">Often</option>
        <option value="sometimes">Sometimes</option>
        <option value="rarely">Rarely</option>
        <option value="never">Never</option>
      </select>

      <h4>How often do you use AI tools for alt text or image descriptions specifically?</h4>
      <select
        value={aiImageDescription}
        onChange={(e) => setAiImageDescription(e.target.value)}
      >
        <option value="">Select...</option>
        <option value="very_often">Very often</option>
        <option value="often">Often</option>
        <option value="sometimes">Sometimes</option>
        <option value="rarely">Rarely</option>
        <option value="never">Never</option>
      </select>

      <button onClick={handleBackgroundSubmit}>Start Tasks</button>
    </div>
  );
}

export default Participant;
