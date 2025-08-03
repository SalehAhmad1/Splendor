import React, { useRef, useState, useEffect } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";
import Height from "./Height"; // Import the Height component

import calculateBodyMeasurements from "./Calculations"; // Import the calculation function
import frontImage from "./components/front.png"; // Import the front mask
import sideImage from "./components/sidepose.png"; // Import the side mask

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [stage, setStage] = useState("enterHeight"); // Initial stage to enter height
  const [personHeight, setPersonHeight] = useState(null);
  const [frameCount, setFrameCount] = useState(0);
  const [frontData, setFrontData] = useState([]);
  const [sideData, setSideData] = useState([]);
  const [measurements, setMeasurements] = useState(null); // State to hold the measurements

  const runBodysegment = async () => {
    console.log("Current Stage:", stage); // Log current stage
    if (stage === "captureFront" || stage === "captureSide") {
      const net = await bodyPix.load();
      console.log("Body Segmentation model loaded.");
      const intervalId = setInterval(() => {
        detect(net, intervalId);
      }, 75);

      return () => clearInterval(intervalId);
    }
  };

  const detect = async (net, intervalId) => {
    if (
      webcamRef.current &&
      canvasRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const context = canvasRef.current.getContext("2d");
      context.clearRect(0, 0, videoWidth, videoHeight);

      // Load the appropriate mask image based on the stage
      const maskImage = new Image();
      maskImage.src = stage === "captureFront" ? frontImage : sideImage;

      // Draw the mask on the canvas
      maskImage.onload = () => {
        context.drawImage(maskImage, 0, 0, videoWidth, videoHeight);
      };

      const person = await net.segmentPersonParts(video);
      console.log(person);
      if (
        person.allPoses[0] != null &&
        person.allPoses[0].keypoints[0].score >= 0.6 &&
        (person.allPoses[0].keypoints[16].score >= 0.6 ||
          person.allPoses[0].keypoints[15].score >= 0.6)
      ) {
        const coloredPartImage = bodyPix.toColoredPartMask(person);
        const opacity = 0.7;
        const flipHorizontal = false;
        const maskBlurAmount = 0;

        try {
          bodyPix.drawMask(
            canvasRef.current,
            video,
            coloredPartImage,
            opacity,
            maskBlurAmount,
            flipHorizontal
          );
        } catch (error) {
          console.error("Error drawing mask: ", error);
        }

        setFrameCount((prev) => {
          if (prev + 1 === 150) {
            clearInterval(intervalId);
            if (stage === "captureFront") {
              setStage("promptSide");
            } else if (stage === "captureSide") {
              setStage("complete");
            }
          } else {
            if (stage === "captureFront") {
              setFrontData((prevData) => [...prevData, person]);
            } else if (stage === "captureSide") {
              setSideData((prevData) => [...prevData, person]);
            }
          }
          return prev + 1;
        });
      } else {
        console.log("Person is not aligned with the mask. Skipping frame.");
        // Show a message or guide the user to stand in the mask
        context.font = "24px Arial";
        context.fillStyle = "yellow";
        context.fillText(
          "Make sure your entire body is visible.",
          videoWidth / 4 - 20,
          videoHeight - 10
        );
      }
    } else {
      console.log("Waiting for video to be ready...");
    }
  };

  useEffect(() => {
    if (stage === "complete" && frontData.length > 0 && sideData.length > 0) {
      const measurements = calculateBodyMeasurements(
        frontData,
        sideData,
        personHeight
      );
      setMeasurements(measurements);
      console.log("Measurements calculated:", measurements);
    }
  }, [stage, frontData, sideData]);

  useEffect(() => {
    console.log("Effect running for stage:", stage);
    runBodysegment();
  }, [stage]); // Log when effect runs

  const handleHeightSubmit = (inputHeight) => {
    setPersonHeight(inputHeight);
    setStage("captureFront"); // Proceed to capturing front profile after height is entered
  };

  return (
    <div className="App">
      <header className="App-header">
        {stage === "enterHeight" && <Height onSubmit={handleHeightSubmit} />}
        {(stage === "captureFront" || stage === "captureSide") && (
          <>
            <Webcam
              ref={webcamRef}
              style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
                width: 640,
                height: 480,
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
                width: 640,
                height: 480,
              }}
            />
          </>
        )}
        {stage === "promptSide" && (
          <div>
            <p>Please turn sideways, then click below to continue.</p>
            <button
              onClick={() => {
                setFrameCount(0);
                setStage("captureSide");
              }}
            >
              Continue
            </button>
          </div>
        )}
        {stage === "complete" && (
          <div>
            <p>Capture complete! Measurements:</p>
            <p>Height: {measurements?.height} cm</p>
            <p>Shoulder Width: {measurements?.shoulder_width} cm</p>
            <p>Arm Length: {measurements?.arm_length} cm</p>
            <p>Leg Length: {measurements?.leg_length} cm</p>
            <p>Torso Length: {measurements?.torso_length} cm</p>
            <p>Navel Length: {measurements?.navel_length} cm</p>
            <p>Waist: {measurements?.waist} cm</p>
            <p>Chest Size: {measurements?.chest} cm</p>

            {/* <p>Bicep Size: {measurements?.bicaeps_size} cm</p>
            <p>Thigh Size: {measurements?.thai_size} cm</p> */}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
