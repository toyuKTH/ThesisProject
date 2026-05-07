import { useRef, useState, useEffect } from 'react';
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
  const [aiReceivedAt, setAiReceivedAt] = useState(null);
  const [taskStartedAt, setTaskStartedAt] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const aiRequestInProgressRef = useRef(false);
  const taskSubmitInProgressRef = useRef(false);

  useEffect(() => {
    setDescription('');
    setAiFeedback('');
    setHasUsedAI(false);
    setInitialDescriptionBeforeAI('');
    setAiRequestedAt(null);
    setAiReceivedAt(null);
    setTaskStartedAt(new Date().toISOString());
    setIsLoadingAI(false);

    aiRequestInProgressRef.current = false;
    taskSubmitInProgressRef.current = false;
  }, [task]);

  if (!task) {
    return <p>Loading task...</p>;
  }

  const progressPercent = ((currentTaskIndex + 1) / totalTasks) * 100;
  const isAITask = task.condition === 'AI';

  const conditionLabel = isAITask
    ? 'AI-assisted writing'
    : 'Writing only';

  const getDurationInSeconds = (startTime, endTime) => {
    if (!startTime || !endTime) return null;

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (Number.isNaN(start) || Number.isNaN(end)) return null;

    return Math.round((end - start) / 1000);
  };

  const handleGetAIFeedback = async () => {
    if (hasUsedAI || isLoadingAI || aiRequestInProgressRef.current) return;

    if (!description.trim()) {
      alert('Please write an initial description before getting AI feedback.');
      return;
    }

    if (!API_BASE_URL) {
      alert('API base URL is missing. Please check your environment settings.');
      return;
    }

    const requestTime = new Date().toISOString();

    aiRequestInProgressRef.current = true;
    setIsLoadingAI(true);
    setAiRequestedAt(requestTime);
    setInitialDescriptionBeforeAI(description);

    try {
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

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to get AI feedback.');
      }

      if (!data?.feedback) {
        throw new Error('AI feedback was empty.');
      }

      const receivedTime = new Date().toISOString();

      setAiFeedback(data.feedback);
      setHasUsedAI(true);
      setAiReceivedAt(receivedTime);
    } catch (error) {
      console.error(error);

      setAiRequestedAt(null);
      setInitialDescriptionBeforeAI('');
      setAiReceivedAt(null);

      alert('AI feedback could not be generated. Please try once more.');
    } finally {
      aiRequestInProgressRef.current = false;
      setIsLoadingAI(false);
    }
  };

  const handleSubmit = () => {
    if (taskSubmitInProgressRef.current) return;

    if (!description.trim()) {
      alert('Please write a description before continuing.');
      return;
    }

    if (isAITask && !hasUsedAI) {
      alert('Please click "Get AI Feedback" before continuing with this task.');
      return;
    }

    taskSubmitInProgressRef.current = true;

    const submittedAt = new Date().toISOString();

    const initialText = initialDescriptionBeforeAI.trim();
    const finalText = description.trim();

    const response = {
      participantID: participantInfo?.participantID,
      taskId: task.id,
      taskNumber: currentTaskIndex + 1,
      condition: task.condition,
      category: task.category,
      imageId: task.imageId,
      imageLabel: task.imageLabel,

      responseText: description,

      log: {
        taskStartedAt,
        taskSubmittedAt: submittedAt,
        taskDurationSeconds: getDurationInSeconds(taskStartedAt, submittedAt),

        usedAI: hasUsedAI,
        aiRequestedAt: isAITask ? aiRequestedAt : null,
        aiReceivedAt: isAITask ? aiReceivedAt : null,
        aiResponseDurationSeconds: isAITask
          ? getDurationInSeconds(aiRequestedAt, aiReceivedAt)
          : null,

        initialDescriptionBeforeAI: isAITask ? initialDescriptionBeforeAI : null,
        finalDescriptionAfterAI: isAITask ? description : null,
        revisedAfterAI: isAITask && hasUsedAI
          ? initialText !== finalText
          : null,

        initialDescriptionLength: isAITask && hasUsedAI
          ? initialText.length
          : null,
        finalDescriptionLength: finalText.length,
        finalWordCount: finalText
          ? finalText.split(/\s+/).length
          : 0,
      },

      aiFeedback: isAITask ? aiFeedback : null,
      timestamp: submittedAt,
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

        <h1>Please write an image description for blind or low vision users.</h1>
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
              Please focus on describing the image for blind or low vision users.
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

              {isLoadingAI && (
                <p className="ai-once-note">
                  Please wait while the AI feedback is being generated.
                </p>
              )}

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