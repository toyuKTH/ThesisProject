import WelcomePage from './WelcomePage';
import TaskPage from './TaskPage';
import Participant from './Participant';
import { useState } from 'react';

const ALL_TASKS = [
  { id: 'NP', condition: 'nonAI', category: 'people', imageLabel: 'Person Image A' },
  { id: 'AO', condition: 'AI', category: 'object', imageLabel: 'Object Image B' },
  { id: 'NS', condition: 'nonAI', category: 'scene', imageLabel: 'Scene Image A' },
  { id: 'AP', condition: 'AI', category: 'people', imageLabel: 'Person Image B' },
  { id: 'NO', condition: 'nonAI', category: 'object', imageLabel: 'Object Image A' },
  { id: 'AS', condition: 'AI', category: 'scene', imageLabel: 'Scene Image B' },
];

function getTaskOrder(participantID) {
  const idNum = Number(participantID) || 0;
  const shift = idNum % ALL_TASKS.length;
  return [...ALL_TASKS.slice(shift), ...ALL_TASKS.slice(0, shift)];
}

function downloadJSON(data, filename = 'study-data.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const [studyData, setStudyData] = useState({
    participantInfo: null,
    taskOrder: [],
    taskResponses: [],
    workloadResponses: [],
  });

  const handleParticipantSubmit = (formData) => {
    const generatedTaskOrder = getTaskOrder(formData.participantID);

    setStudyData({
      participantInfo: formData,
      taskOrder: generatedTaskOrder,
      taskResponses: [],
      workloadResponses: [],
    });

    setCurrentTaskIndex(0);
    setCurrentPage('task');
  };

  const handleTaskSubmit = (taskResponse) => {
    const updatedResponses = [...studyData.taskResponses, taskResponse];

    const updatedStudyData = {
      ...studyData,
      taskResponses: updatedResponses,
    };

    setStudyData(updatedStudyData);

    const isLastTask = currentTaskIndex === studyData.taskOrder.length - 1;

    if (isLastTask) {
      downloadJSON(
        updatedStudyData,
        `participant-${studyData.participantInfo?.participantID || 'unknown'}.json`
      );
      setCurrentPage('finished');
    } else {
      setCurrentTaskIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="App">
      {currentPage === 'welcome' && (
        <WelcomePage
          onStart={() => {
            setCurrentPage('participant');
          }}
        />
      )}

      {currentPage === 'participant' && (
        <Participant onSubmit={handleParticipantSubmit} />
      )}

      {currentPage === 'task' && (
        <TaskPage
          participantInfo={studyData.participantInfo}
          task={studyData.taskOrder[currentTaskIndex]}
          currentTaskIndex={currentTaskIndex}
          totalTasks={studyData.taskOrder.length}
          onSubmitTask={handleTaskSubmit}
          onReturn={() => setCurrentPage('welcome')}
        />
      )}

      {currentPage === 'finished' && (
        <div style={{ maxWidth: '720px', margin: '80px auto', padding: '24px' }}>
          <h1>Study Completed</h1>
          <p>Thank you for participating. Your responses have been downloaded as a JSON file.</p>
          <button onClick={() => setCurrentPage('welcome')}>Back to Welcome Page</button>
        </div>
      )}
    </div>
  );
}

export default App;