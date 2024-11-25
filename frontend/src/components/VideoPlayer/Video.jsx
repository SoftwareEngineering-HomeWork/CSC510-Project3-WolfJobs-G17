import VideoPlayer from './VideoPlayer';
import { useParams } from "react-router-dom";
import { useState,useEffect } from 'react';
import axios from "axios"

function Video() {
  const { applicantId } = useParams();
  const [recordedVideo, setRecordedVideo] = useState(null);

  useEffect(()=>
  {
    axios
        .get(`http://localhost:8000/api/v1/users/fetchapplication?applicantId=${applicantId}`)
        .then((res) => {
          if (res.status !== 200) {
            toast.error("Failed to fetch");
            return;
          }
          console.log("This is the response",res)
          setRecordedVideo(URL.createObjectURL(res.data.blob))

        })
        .catch((error) => {
          console.error('Error submitting application:', error);
          toast.error("Failed to apply");
        })
  },[])

  return (
    <>
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
      {/* // <VideoPlayer
      //   id="player1"
      //   publicId="glide-over-coastal-beach"
      //   playerConfig={{
      //     muted: true,
      //     posterOptions: {
      //       transformation: { effect: 'blur' },
      //     },
      //   }}
      //   sourceConfig={{
      //     info: { title: 'Glide Over Coastal Beach' },
      //   }}
      // /> */}
    </>
  );
}

export default Video;