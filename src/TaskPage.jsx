import { useState, useEffect } from 'react';
import './TaskPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    setDescription('');
    setAiFeedback('');
    setHasUsedAI(false);
    setInitialDescriptionBeforeAI('');
    setAiRequestedAt(null);
    setIsLoadingAI(false);
  }, [task]);

  if (!task) {
    return <p>Loading task...</p>;
  }

  const progressPercent = ((currentTaskIndex + 1) / totalTasks) * 100;
  const isAITask = task.condition === 'AI';

  const conditionLabel = isAITask
    ? 'AI-assisted writing'
    : 'Writing only';

  const handleGetAIFeedback = async () => {
    if (hasUsedAI || isLoadingAI) return;

    if (!description.trim()) {
      alert('Please write an initial description before getting AI feedback.');
      return;
    }

    if (!API_BASE_URL) {
      alert('API base URL is missing. Please check your environment settings.');
      return;
    }

    try {
      setIsLoadingAI(true);

      const response = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          category: task.category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI feedback.');
      }

      setInitialDescriptionBeforeAI(description);
      setAiFeedback(data.feedback);
      setHasUsedAI(true);
      setAiRequestedAt(new Date().toISOString());
    } catch (error) {
      console.error(error);
      alert('Failed to get AI feedback. Please try again.');
    } finally {
      setIsLoadingAI(false);
    }
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
                disabled={hasUsedAI || isLoadingAI}
              >
                {isLoadingAI ? 'Generating Feedback...' : 'Get AI Feedback'}
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

              {!aiFeedback && !isLoadingAI && (
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