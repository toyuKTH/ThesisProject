import { useState, useEffect } from 'react';
import './WorkloadPage.css';

function WorkloadPage({
  participantInfo,
  task,
  currentTaskIndex,
  totalTasks,
  onSubmitWorkload,
}) {
  const [mentalDemand, setMentalDemand] = useState('');
  const [temporalDemand, setTemporalDemand] = useState('');
  const [effort, setEffort] = useState('');
  const [frustration, setFrustration] = useState('');

  useEffect(() => {
    setMentalDemand('');
    setTemporalDemand('');
    setEffort('');
    setFrustration('');
  }, [task]);

  if (!task) {
    return <p>Loading workload questionnaire...</p>;
  }

  const handleSubmit = () => {
    if (
      mentalDemand === '' ||
      temporalDemand === '' ||
      effort === '' ||
      frustration === ''
    ) {
      alert('Please answer all questions before continuing.');
      return;
    }

    const workloadResponse = {
      participantID: participantInfo?.participantID,
      taskId: task.id,
      condition: task.condition,
      category: task.category,
      imageId: task.imageId,
      imageLabel: task.imageLabel,
      mentalDemand: Number(mentalDemand),
      temporalDemand: Number(temporalDemand),
      effort: Number(effort),
      frustration: Number(frustration),
      timestamp: new Date().toISOString(),
    };

    onSubmitWorkload(workloadResponse);
  };

  const renderScale = (name, value, setter) => {
    return (
      <div className="scale-row">
        <div className="scale-options">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <label key={num} className="scale-label">
              <input
                type="radio"
                name={name}
                value={num}
                checked={value === String(num)}
                onChange={(e) => setter(e.target.value)}
              />
              <span>{num}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="workload-page">
      <div className="workload-card">
        <div className="workload-header">
          <p className="workload-step">
            Task {currentTaskIndex + 1} of {totalTasks}
          </p>
          <h1>Task Workload Questionnaire</h1>
          <p className="workload-subtitle">
            Please rate the task you just completed.
          </p>
        </div>

        <div className="question-block">
          <div className="question-top">
            <h3>Mental Demand</h3>
            <div className="scale-anchors-inline">
              <span>Very low</span>
              <span>Very high</span>
            </div>
          </div>
          <p>How mentally demanding was this task?</p>
          {renderScale('mentalDemand', mentalDemand, setMentalDemand)}
        </div>

        <div className="question-block">
          <div className="question-top">
            <h3>Temporal Demand</h3>
            <div className="scale-anchors-inline">
              <span>Very low</span>
              <span>Very high</span>
            </div>
          </div>
          <p>How much time pressure did you feel while doing this task?</p>
          {renderScale('temporalDemand', temporalDemand, setTemporalDemand)}
        </div>

        <div className="question-block">
          <div className="question-top">
            <h3>Effort</h3>
            <div className="scale-anchors-inline">
              <span>Very low</span>
              <span>Very high</span>
            </div>
          </div>
          <p>How hard did you have to work to complete this task?</p>
          {renderScale('effort', effort, setEffort)}
        </div>

        <div className="question-block">
          <div className="question-top">
            <h3>Frustration</h3>
            <div className="scale-anchors-inline">
              <span>Very low</span>
              <span>Very high</span>
            </div>
          </div>
          <p>How frustrated, stressed, or annoyed did you feel during this task?</p>
          {renderScale('frustration', frustration, setFrustration)}
        </div>

        <div className="workload-actions">
          <button className="workload-button" onClick={handleSubmit}>
            Submit and Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkloadPage;