import WelcomePage from './WelcomePage';
import TaskPage from './TaskPage';
import Participant from './Participant';
import { useState } from 'react';
function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [studyData, setStudyData] = useState(
    {
      participantInfo: null,
      taskOrder: [],
      taskResponses: [],
      workloadResponses: [],
    }
  );
  return (
    <div className="App">
      {currentPage === 'welcome' && (
        <WelcomePage onStart={() => {
          setCurrentPage('participant');
        }} />
      )}
      {currentPage === 'participant' && (
        <Participant 
          onSubmit={(formData) => {
            setStudyData((prevData) => ({
              ...prevData,
              participantInfo: formData,
            }));
            setCurrentPage('task');
          }}
        />
      )}
      {currentPage === 'task' && (
        <TaskPage studyData={studyData} onReturn={() => {
          setCurrentPage('welcome');
        }} />
      )}
    </div>
  );
}

export default App;