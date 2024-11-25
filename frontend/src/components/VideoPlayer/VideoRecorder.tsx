import React, { useState, useRef } from 'react';
import './VideoRecorder.css'; // Add this import
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const VideoRecorder = () => {
  // ... existing state and refs ...
    const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { jobData, applicationData } = state;
  const question1=jobData.question1;
  const question2=jobData.question2;
  const question3=jobData.question3;
  const question4=jobData.question4;


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      
      // ... existing MediaRecorder setup ...
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);
        navigate(`/explore?jobId=${jobData._id}`, { 
          state: { 
            blob,
            isVideoSubmission: true,
            applicationData, 
            jobData
          } 
        });
        
        // Clear chunks after navigation
        chunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  // ... existing stopRecording function ...
  const stopRecording = () => {
        mediaRecorderRef.current.stop();
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        setIsRecording(false);

        // // When the recording stops, create a blob and navigate back with the video data
        // const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        // const videoUrl = URL.createObjectURL(blob);
    
    // Navigate back with the video file
    //     navigate(`/explore?jobId=${jobData._id}`, { 
    //       state: { 
    //         vblob,
    //         isVideoSubmission:true,
    //         applicationData, 
    //         jobData
    //       } 
    // });
      };

  return (
    <div className="video-recorder-container">
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        margin: '20px 0',
        maxWidth: '800px',
        width: '100%'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>
          Answer the following questions in this video interview
        </h1>
        <h2 style={{ color: '#555', margin: '10px 0', fontSize: '1.2rem' }}>1. {question1}</h2>
        <h2 style={{ color: '#555', margin: '10px 0', fontSize: '1.2rem' }}>2. {question2}</h2>
        <h2 style={{ color: '#555', margin: '10px 0', fontSize: '1.2rem' }}>3. {question3}</h2>
        <h2 style={{ color: '#555', margin: '10px 0', fontSize: '1.2rem' }}>4. {question4}</h2>
      </div>
      <div className="video-preview">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          className="video-stream"
        />
      </div>
      
      <div className="controls">
        <button 
          className={`record-button ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>

      {recordedVideo && (
        <div className="recorded-video-container">
          <h3>Recorded Video</h3>
          <video 
            src={recordedVideo} 
            controls 
            className="recorded-video"
          />
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;