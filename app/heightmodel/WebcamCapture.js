import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as bodyPix from '@tensorflow-models/body-pix';

function WebcamCapture({ setAllPoses, setSegmentation, onCaptureStop }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [frameCount, setFrameCount] = useState(0);  // State to track frame count

  useEffect(() => {
    let interval;
    const runBodysegment = async () => {
      const net = await bodyPix.load();
      console.log("BodyPix model loaded.");

      interval = setInterval(() => {
        if (frameCount < 300) {
          capture(net);
          setFrameCount(prev => prev + 1);  // Increment frame count
        } else {
          clearInterval(interval);  // Stop the interval when 300 frames are reached
          onCaptureStop();  // Call the onCaptureStop function passed as a prop
        }
      }, 100);
    };

    runBodysegment();

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [frameCount]);  // Depend on frameCount to update interval logic

  const capture = async (net) => {
    const webcamCurrent = webcamRef.current;
    const canvasCurrent = canvasRef.current;

    if (webcamCurrent && webcamCurrent.video && canvasCurrent) {
      const video = webcamCurrent.video;

      if (video.readyState === 4) {  // Ensure video is fully loaded
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // Set video and canvas dimensions
        video.width = videoWidth;
        video.height = videoHeight;
        canvasCurrent.width = videoWidth;
        canvasCurrent.height = videoHeight;

        try {
          const segmentation = await net.segmentPersonParts(video);
          console.log(segmentation);

          const coloredPartImage = bodyPix.toColoredPartMask(segmentation);
          const opacity = 0.7;
          const flipHorizontal = false;
          const maskBlurAmount = 0;

          bodyPix.drawMask(
            canvasCurrent,
            video,
            coloredPartImage,
            opacity,
            maskBlurAmount,
            flipHorizontal
          );

          setAllPoses(segmentation.allPoses);
          setSegmentation(segmentation);  // If needed
        } catch (error) {
          console.error('Error during segmentation:', error);
        }
      }
    }
  };

  return (
    <div className="webcam-container">
      <Webcam
        ref={webcamRef}
        className="webcam"
        videoConstraints={{
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: 9 / 16, // Enforce aspect ratio
        }}
      />
      <canvas
        ref={canvasRef}
        className="webcam-canvas"
      />
    </div>
  );
};

export default WebcamCapture;

