function TaskPage({ studyData, onReturn }) {
    return (
        <div>
            <h1>Task Page</h1>
            <p>This is the task page.</p>
            <button
                onClick={() => {
                    onReturn();
                }}
            >
                Return
            </button>
            <p>The currentParticipant ID is: {studyData.participantInfo?.participantID}</p>
            <p>Age: {studyData.participantInfo?.age}</p>
            <p>Gender : {studyData.participantInfo?.gender}</p>
            <p>Creation Activity: {studyData.participantInfo?.creationActivity}</p>
            <p>Posting Frequency: {studyData.participantInfo?.postingFrequency}</p>
            <p>Writing Frequency: {studyData.participantInfo?.writingFrequency}</p>
            <p>Trained: {studyData.participantInfo?.trained}</p>
            <p>AI Writing: {studyData.participantInfo?.AIwriting}</p>
        </div>
    );
}
export default TaskPage;