import { useState, useEffect } from 'react';
import './TaskPage.css';

function TaskPage({
  participantInfo,
  task,
  currentTaskIndex,
  totalTasks,
  onSubmitTask,
  onReturn,
}) {
  const [description, setDescription] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [hasUsedAI, setHasUsedAI] = useState(false);
  const [initialDescriptionBeforeAI, setInitialDescriptionBeforeAI] = useState('');
  const [aiRequestedAt, setAiRequestedAt] = useState(null);

  useEffect(() => {
    setDescription('');
    setAiFeedback('');
    setHasUsedAI(false);
    setInitialDescriptionBeforeAI('');
    setAiRequestedAt(null);
  }, [task]);

  if (!task) {
    return <p>Loading task...</p>;
  }

  const progressPercent = ((currentTaskIndex + 1) / totalTasks) * 100;
  const isAITask = task.condition === 'AI';

  const conditionLabel = isAITask
    ? 'AI-assisted writing'
    : 'Writing only';

  const handleGetAIFeedback = () => {
    if (hasUsedAI) return;

    if (!description.trim()) {
      alert('Please write an initial description before getting AI feedback.');
      return;
    }

    const fakeFeedback =
      'Try to clearly describe the main scene first, then mention important visual details such as the setting, notable objects, and any striking colors or spatial relationships. Focus on what would be most useful for a blind or low vision audience.';

    setInitialDescriptionBeforeAI(description);
    setAiFeedback(fakeFeedback);
    setHasUsedAI(true);
    setAiRequestedAt(new Date().toISOString());
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      alert('Please write a description before continuing.');
      return;
    }

    if (isAITask && !hasUsedAI) {
      alert('Please click "Get AI Feedback" before continuing with this task.');
      return;
    }

    const response = {
      participantID: participantInfo?.participantID,
      taskId: task.id,
      condition: task.condition,
      category: task.category,
      imageId: task.imageId,
      imageLabel: task.imageLabel,
      responseText: description,
      usedAI: hasUsedAI,
      aiFeedback,
      initialDescriptionBeforeAI: isAITask ? initialDescriptionBeforeAI : null,
      finalDescriptionAfterAI: isAITask ? description : null,
      aiRequestedAt: isAITask ? aiRequestedAt : null,
      timestamp: new Date().toISOString(),
    };

    onSubmitTask(response);
  };

  return (
    <div className="task-page">
      <div className="task-header">
        <div className="task-header-row">
          <span>Task {currentTaskIndex + 1} of {totalTasks}</span>
          <span>Condition: {conditionLabel}</span>
        </div>

        <div className="progress-bar-wrapper">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <h1>Please write an image description for a blind or low vision audience.</h1>
      </div>

      <div className="task-main">
        <div className="task-left">
          <div className="image-panel">
            <div className="image-placeholder">
              <img
                src={task.imageSrc}
                alt=""
                className="task-image"
              />
            </div>
            <p className="image-note">
              Please focus on describing the image for a blind or low vision audience.
            </p>
          </div>
        </div>

        <div className="task-right">
          <label className="task-label" htmlFor="description">
            Your description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your image description here..."
            rows={10}
          />

          {isAITask && (
            <div className="ai-section">
              <button
                className="secondary-button"
                onClick={handleGetAIFeedback}
                disabled={hasUsedAI}
              >
                Get AI Feedback
              </button>

              {aiFeedback && (
                <>
                  <p className="ai-hint">
                    After viewing the AI feedback, please revise your description in the text box above.
                  </p>

                  <div className="ai-feedback-box">
                    <h3>AI Feedback</h3>
                    <p className="ai-feedback-text">{aiFeedback}</p>
                    <p className="ai-feedback-note">
                      You may revise your description in the text box above based on this feedback.
                    </p>
                  </div>
                </>
              )}

              {!aiFeedback && (
                <p className="ai-once-note">
                  AI feedback can only be requested once for this task.
                </p>
              )}
            </div>
          )}

          <div className="task-actions">
            <button className="primary-button" onClick={handleSubmit}>
              Submit Description
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskPage;