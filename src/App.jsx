import WelcomePage from './WelcomePage';
import TaskPage from './TaskPage';
import Participant from './Participant';
import WorkloadPage from './WorkloadPage';
import { useState } from 'react';

import P1 from './assets/images/P1.jpg';
import P2 from './assets/images/P2.jpg';
import O1 from './assets/images/O1.jpg';
import O2 from './assets/images/O2.jpg';
import S1 from './assets/images/S1.jpg';
import S2 from './assets/images/S2.jpg';

const IMAGE_POOL = {
  people: [
    { id: 'P1', src: P1 },
    { id: 'P2', src: P2 },
  ],
  object: [
    { id: 'O1', src: O1 },
    { id: 'O2', src: O2 },
  ],
  scene: [
    { id: 'S1', src: S1 },
    { id: 'S2', src: S2 },
  ],
};

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getStartingCondition(participantID) {
  const idNum = Number(participantID) || 0;
  return idNum % 2 === 1 ? 'AI' : 'nonAI';
}

function generateTaskOrder(participantID) {
  const startingCondition = getStartingCondition(participantID);

  const alternatingConditions =
    startingCondition === 'AI'
      ? ['AI', 'nonAI', 'AI', 'nonAI', 'AI', 'nonAI']
      : ['nonAI', 'AI', 'nonAI', 'AI', 'nonAI', 'AI'];

  const aiCategories = shuffleArray(['people', 'object', 'scene']);
  const nonAiCategories = shuffleArray(['people', 'object', 'scene']);

  const imageAssignment = {};

  ['people', 'object', 'scene'].forEach((category) => {
    const shuffledImages = shuffleArray(IMAGE_POOL[category]);

    imageAssignment[category] = {
      AI: shuffledImages[0],
      nonAI: shuffledImages[1],
    };
  });

  let aiIndex = 0;
  let nonAiIndex = 0;

  const taskOrder = alternatingConditions.map((condition, index) => {
    const category =
      condition === 'AI'
        ? aiCategories[aiIndex++]
        : nonAiCategories[nonAiIndex++];

    const imageObject = imageAssignment[category][condition];
    const imageId = imageObject.id;
    const imageSrc = imageObject.src;
    const imageLabel = `${category} ${imageId}`;

    return {
      id: `task-${index + 1}`,
      condition,
      category,
      imageId,
      imageSrc,
      imageLabel,
    };
  });

  return taskOrder;
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
    const generatedTaskOrder = generateTaskOrder(formData.participantID);

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
    setStudyData((prevData) => ({
      ...prevData,
      taskResponses: [...prevData.taskResponses, taskResponse],
    }));

    setCurrentPage('workload');
  };

  const handleWorkloadSubmit = (workloadResponse) => {
    const updatedStudyData = {
      ...studyData,
      workloadResponses: [...studyData.workloadResponses, workloadResponse],
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
      setCurrentPage('task');
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

      {currentPage === 'task' && studyData.taskOrder.length > 0 && (
        <TaskPage
          participantInfo={studyData.participantInfo}
          task={studyData.taskOrder[currentTaskIndex]}
          currentTaskIndex={currentTaskIndex}
          totalTasks={studyData.taskOrder.length}
          onSubmitTask={handleTaskSubmit}
          onReturn={() => setCurrentPage('welcome')}
        />
      )}

      {currentPage === 'workload' && studyData.taskOrder.length > 0 && (
        <WorkloadPage
          participantInfo={studyData.participantInfo}
          task={studyData.taskOrder[currentTaskIndex]}
          currentTaskIndex={currentTaskIndex}
          totalTasks={studyData.taskOrder.length}
          onSubmitWorkload={handleWorkloadSubmit}
        />
      )}

      {currentPage === 'finished' && (
        <div style={{ maxWidth: '720px', margin: '80px auto', padding: '24px' }}>
          <h1>Study Completed</h1>
          <p>
            Thank you for participating. Your responses have been downloaded as a JSON
            file.
          </p>
          <button onClick={() => setCurrentPage('welcome')}>
            Back to Welcome Page
          </button>
        </div>
      )}
    </div>
  );
}

export default App;