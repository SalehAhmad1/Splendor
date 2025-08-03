"use client";
import React, { useRef, useState, useEffect } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import * as tf from "@tensorflow/tfjs";
import { useRouter } from 'next/navigation';

import Webcam from "react-webcam";
import "./App.css";
import axios from 'axios';
import Height from "./Height"; // Import the Height component
import calculateBodyMeasurements from "./Calculations"; // Import the calculation function
import frontImage from "./components/front_mask.png"; // Import the front mask
import sideImage from "./components/side_mask.png"; // Import the side mask
import jsPDF from 'jspdf';
import User, { isUserInitialized } from "@/model/UserModel/userMeasurements";


const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="modal-form">
      <div className="form-title">
        Sorry!
        <div>
          <p className="form-description">{message}</p>
        </div>
        <button className="continue-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

function App({image, title, gender, category}) {
  const webcamRef = useRef(null);
  const CanvasRef = useRef(null); // main canvas 
  const maskCanvasRef = useRef(null); // Separate canvas for the mask
  const segmentationCanvasRef = useRef(null); // Canvas for segmentation results
  const bodyPixModelRef = useRef(null); // Ref to store the loaded model
  const guidanceRef = useRef(null); // Ref to store the guidance message
  const [stage, setStage] = useState("enterHeight"); // Initial stage to enter height
  const [personHeight, setPersonHeight] = useState(null);
  const [frameCount, setFrameCount] = useState(0);
  const [frontData, setFrontData] = useState([]);
  const [sideData, setSideData] = useState([]);
  const [measurements, setMeasurements] = useState(null); // State to hold the measurements
  const [unit, setUnit] = useState("in"); // Sta
  const [showGetHeight, setShowGetHeight] = useState(false)
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const THRESHOLD = 0.4;
  const OverlapThreshold = 80;
  const FRAMES = 50;
  const GreenColor = { r: 0, g: 255, b: 0, a: 127 }; // Green color with some transparency
  const RedColor = { r: 255, g: 0, b: 0, a: 127 }; // Green color with some transparency
  const [countdown, setCountdown] = useState(5);
  const process = {"env": {"MIX_APP_API_URL": "http://localhost:3000/heightmodel"}};
  const router = useRouter();
  // Loading the model
  useEffect(() => {
    const loadModel = async () => {
      
      let model_config1 = {
        architecture: "ResNet50", // Use ResNet for better accuracy
        outputStride: 16,         // Smaller values are more accurate but slower
        quantBytes: 2,            // Reduce model size for memory efficiency
      }

      let model_config2 = {
        architecture: "MobileNetV1", // Faster than ResNet
        outputStride: 8,            // Smaller stride improves accuracy but reduces speed
        multiplier: 1,               // Adjust for speed vs. accuracy trade-off (0.50 for faster)
        quantBytes: 2,               // Lower size model for better performance
      }

      try {
        const net = await bodyPix.load(model_config1);
        
        bodyPixModelRef.current = net;
        console.log("BodyPix model loaded successfully.");
      } catch (error) {
        console.error("Error loading BodyPix model:", error);
      }
    };

    loadModel();
  }, []);

  // Check if User Model is initialized
  useEffect(() => {
    if (isUserInitialized()) {
      console.log("User Model is initialized. Navigating to best-fit screen.");
      router.push(`/best-fit?height=${User.height}&chest=${User.chest}&shoulder_width=${User.shoulder_width}&arm_length=${User.arm_length}&leg_length=${User.leg_length}&waist=${User.waist}&navel_length=${User.navel_length}&torso_length=${User.torso_length}&image=${image}&title=${title}&gender=${gender}&category=${category}`);
    }
  }, []);


  async function segmentationArea(sampleImage, boolMask) {
    // Convert image to tensor
    let tensorImage = tf.browser.fromPixels(sampleImage);
    let mask = boolMask.squeeze();
    let imgToDraw = tensorImage.clone();
    
    // Define blue color in RGB
    let blueColor = [0, 0, 255];
    
    // Apply color to masked areas
    let [height, width] = mask.shape;
    let positions = [];
    
    mask.data().then(maskData => {
        let imageData = imgToDraw.dataSync();
        for (let i = 0; i < maskData.length; i++) {
            if (maskData[i]) {
                let idx = i * 4;
                imageData[idx] = blueColor[0];   // R
                imageData[idx + 1] = blueColor[1]; // G
                imageData[idx + 2] = blueColor[2]; // B
                
                let x = i % width;
                let y = Math.floor(i / width);
                positions.push([x, y]);
            }
        }
        
        // Convert updated tensor back to image
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        let imgData = new ImageData(new Uint8ClampedArray(imageData), width, height);
        ctx.putImageData(imgData, 0, 0);
    });
    
    return positions;
  }


  // Draw the guidance miniature mask
  const drawMaskOverlay = () => {
    if (maskCanvasRef.current && webcamRef.current) {
      const maskCanvas = maskCanvasRef.current;
      const maskContext = maskCanvas.getContext("2d");
  
      const video = webcamRef.current.video;
  
      // Check if video dimensions are available
      if (!video.videoWidth || !video.videoHeight) {
        console.error("Video dimensions are not available yet.");
        return;
      }
  
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
  
      // Resize canvas to match video dimensions
      maskCanvas.width = videoWidth;
      maskCanvas.height = videoHeight;
  
      // Clear existing canvas content
      maskContext.clearRect(0, 0, videoWidth, videoHeight);
  
      // Draw the mask image scaled to fit the canvas
      const maskImage = new window.Image(); // Use standard HTML Image object
      maskImage.src = stage === "captureFront" ? frontImage.src : sideImage.src;
      console.log("Mask Image:", maskImage.src);
  
      maskImage.onload = () => {
        const canvasAspectRatio = videoWidth / videoHeight;
        const imageAspectRatio = maskImage.width / maskImage.height;
  
        let drawWidth, drawHeight;
  
        // Scale the image to fit the canvas while maintaining aspect ratio
        if (canvasAspectRatio > imageAspectRatio) {
          // Canvas is wider than the image
          drawHeight = videoHeight;
          drawWidth = videoHeight * imageAspectRatio;
        } else {
          // Canvas is taller than the image
          drawWidth = videoWidth;
          drawHeight = videoWidth / imageAspectRatio;
        }
  
        // Center the mask image
        const offsetX = (videoWidth - drawWidth) / 2;
        const offsetY = (videoHeight - drawHeight) / 2;
  
        maskContext.drawImage(maskImage, offsetX, offsetY, drawWidth, drawHeight);
      };
  
      maskImage.onerror = (error) => {
        console.error("Failed to load the mask image.", error);
      };
    } else {
      console.error("Canvas or video reference is missing.");
    }
  };
  
  const drawSegmentationOverlay = (video, coloredPartImage, color = null, keypoints = []) => {
    // Create a copy of the mask data for transparency processing
    const transparentMaskData = new Uint8ClampedArray(coloredPartImage.data.length);
  
    for (let i = 0; i < coloredPartImage.data.length; i += 4) {
      const r = coloredPartImage.data[i];     // Red channel
      const g = coloredPartImage.data[i + 1]; // Green channel
      const b = coloredPartImage.data[i + 2]; // Blue channel
      const a = coloredPartImage.data[i + 3]; // Alpha channel
  
      // Check if the pixel corresponds to the background (white color in this case)
      if (r === 255 && g === 255 && b === 255) {
        // Set the alpha channel to 0 for transparency
        transparentMaskData[i] = 0;     // Red
        transparentMaskData[i + 1] = 0; // Green
        transparentMaskData[i + 2] = 0; // Blue
        transparentMaskData[i + 3] = 0; // Alpha
      } else {
        if (color) {
          // change the pixel values to set color
          transparentMaskData[i] = color.r;
          transparentMaskData[i + 1] = color.g;
          transparentMaskData[i + 2] = color.b;
          transparentMaskData[i + 3] = color.a || 255;
        } else {
          // Keep the original pixel values
          transparentMaskData[i] = r;
          transparentMaskData[i + 1] = g;
          transparentMaskData[i + 2] = b;
          transparentMaskData[i + 3] = a;
        }
      }
    }
  
    // Construct a new ImageData object with the transparent mask
    const transparentImageData = new ImageData(
      transparentMaskData,
      coloredPartImage.width,
      coloredPartImage.height
    );
  
    const opacity = 0.7;
    const flipHorizontal = false;
    const maskBlurAmount = 3;
  
    try {
      // Draw the transparent mask on the canvas
      if (segmentationCanvasRef.current) {
        bodyPix.drawMask(
          segmentationCanvasRef.current,
          video,
          transparentImageData,
          opacity,
          maskBlurAmount,
          flipHorizontal
        );
  
        // Draw keypoints and connections
        const canvas = segmentationCanvasRef.current;
        const ctx = canvas.getContext("2d");
  
        if (keypoints.length > 0) {
          // Draw keypoints
          keypoints.forEach((kp) => {
            if (kp.score >= THRESHOLD) {
              ctx.beginPath();
              ctx.arc(kp.position.x, kp.position.y, 5, 0, 2 * Math.PI);
              ctx.fillStyle = "red";
              ctx.fill();
            }
          });
  
          // Draw connections between keypoints
          const connections = [
            ["leftEye", "rightEye"],
            ["leftShoulder", "rightShoulder"],
            ["leftShoulder", "leftHip"],
            ["rightShoulder", "rightHip"],
            ["leftHip", "rightHip"],
            ["leftShoulder", "leftElbow"],
            ["leftElbow", "leftWrist"],
            ["rightShoulder", "rightElbow"],
            ["rightElbow", "rightWrist"],
            ["leftHip", "leftKnee"],
            ["leftKnee", "leftAnkle"],
            ["rightHip", "rightKnee"],
            ["rightKnee", "rightAnkle"],
          ];
  
          connections.forEach(([part1, part2]) => {
            const kp1 = keypoints.find((kp) => kp.part === part1);
            const kp2 = keypoints.find((kp) => kp.part === part2);
  
            if (kp1 && kp2 && kp1.score >= THRESHOLD && kp2.score >= THRESHOLD) {
              ctx.beginPath();
              ctx.moveTo(kp1.position.x, kp1.position.y);
              ctx.lineTo(kp2.position.x, kp2.position.y);
              ctx.strokeStyle = "blue";
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          });
        }
      }
    } catch (error) {
      console.error("Error drawing mask: ", error);
    }
  };
  // // Draw the segmentation overlay on the main canvas
  // const drawSegmentationOverlay = (video, coloredPartImage, color=null) => {
  
  //   // Create a copy of the mask data for transparency processing
  //   const transparentMaskData = new Uint8ClampedArray(coloredPartImage.data.length);
  
  //   for (let i = 0; i < coloredPartImage.data.length; i += 4) {
  //     const r = coloredPartImage.data[i];     // Red channel
  //     const g = coloredPartImage.data[i + 1]; // Green channel
  //     const b = coloredPartImage.data[i + 2]; // Blue channel
  //     const a = coloredPartImage.data[i + 3]; // Alpha channel
  
  //     // Check if the pixel corresponds to the background (white color in this case)
  //     if (r === 255 && g === 255 && b === 255) {
  //       // Set the alpha channel to 0 for transparency
  //       transparentMaskData[i] = 0;     // Red
  //       transparentMaskData[i + 1] = 0; // Green
  //       transparentMaskData[i + 2] = 0; // Blue
  //       transparentMaskData[i + 3] = 0; // Alpha
  //     } else {
  //       if (color) {
  //         // change the pixel values to set color
  //         transparentMaskData[i] =  color.r;
  //         transparentMaskData[i + 1] = color.g;
  //         transparentMaskData[i + 2] = color.b;
  //         transparentMaskData[i + 3] = color.a || 255;
  //       }
  //       else {
  //         // Keep the original pixel values
  //         transparentMaskData[i] = r;
  //         transparentMaskData[i + 1] = g;
  //         transparentMaskData[i + 2] = b;
  //         transparentMaskData[i + 3] = a;
  //       }
  //   }
  //   }
  
  //   // Construct a new ImageData object with the transparent mask
  //   const transparentImageData = new ImageData(
  //     transparentMaskData,
  //     coloredPartImage.width,
  //     coloredPartImage.height
  //   );
  
  //   const opacity = 0.7;
  //   const flipHorizontal = false;
  //   const maskBlurAmount = 3;
  
  //   try {
  //     // Draw the transparent mask on the canvas
  //     bodyPix.drawMask(
  //       segmentationCanvasRef.current,
  //       video,
  //       transparentImageData,
  //       opacity,
  //       maskBlurAmount,
  //       flipHorizontal
  //     );
      
  //   } catch (error) {
  //     console.error("Error drawing mask: ", error);
  //   }
  // };
  
  useEffect(() => {
    console.log("Stage changed to:", stage);
    if (stage === "captureFront" || stage === "captureSide") {
      const video = webcamRef.current?.video;
  
      if (video) {
        // Check if the video is ready
        if (video.videoWidth && video.videoHeight) {
          drawMaskOverlay();
        } else {
          // Listen for the 'loadedmetadata' event to ensure video dimensions are available
          const handleLoadedMetadata = () => {
            drawMaskOverlay();
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
          };
  
          video.addEventListener("loadedmetadata", handleLoadedMetadata);
        }
      } else {
        console.error("Video element is not available.");
      }
    }
  }, [stage]);
  

  // useEffect(() => {
  //   const fetchHeightFromDatabase = async () => {
  //      try {
  //           console.log("Link", `${process.env.MIX_APP_API_URL}/get-user-height`)
  //           const response = await axios.get(`${process.env.MIX_APP_API_URL}/get-user-height`);
  //           const userHeight = response.data.height;
  //           if(response.status == 200 && userHeight){
  //             setShowGetHeight(false)
  //           }
  //           console.log(response, "responseeeeee");
  //           setStage('enterHeight');
  //           if (response.status==200 && userHeight) {
  //              console.log(userHeight, "userHeightttttttttttt")
  //              setPersonHeight(userHeight);
  //              console.log(personHeight, "person height")
  //              setStage('enterHeight')
  //              setShowGetHeight(false) // Proceed to capture front profile
  //           } else {
  //                setStage('enterHeight');  // Ask the user to input height
  //                setShowGetHeight(true)
  //           }
  //       } catch (error) {
  //           console.error("Error fetching height:", error);
  //           setShowGetHeight(true)
  //           setStage('enterHeight');  // Ask the user to input height on error
  //       }
  //   };

  //   fetchHeightFromDatabase();
  // }, []);
  
  useEffect(() => {
    if (stage === "promptSide" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000); // Decrease countdown every second

      return () => clearTimeout(timer); // Cleanup on component unmount or stage change
    } else if (countdown === 0) {
      setStage("captureSide"); // Automatically transition after countdown
      setCountdown(5); // Reset countdown if needed for future stages
      setFrameCount(0);
    }
  }, [countdown, stage]);

  const runBodysegment = () => {
    if ((stage === "captureFront" || stage === "captureSide") && bodyPixModelRef.current) {
      const intervalId = setInterval(() => {
        detect(bodyPixModelRef.current, intervalId);
      }, 75);

      return () => clearInterval(intervalId);
    }
  };

  const saveCanvasAsImage = (canvas, filename) => {
    if (!canvas) {
      console.error("Canvas not provided for saving.");
      return;
    }
  
    // Convert canvas to a data URL
    const dataUrl = canvas.toDataURL("image/png");
  
    // Create a link element to download the image
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
  
    // Programmatically trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    console.log(`${filename} saved successfully.`);
  };
  
  const changeText = (message, color=null) => {
    if (guidanceRef.current) {
      guidanceRef.current.textContent = message;
      guidanceRef.current.style.color = color; // Set font color
    }
  };
  
  const CheckOverlap = (coloredPartImage) => {
    if (!maskCanvasRef.current || !segmentationCanvasRef.current) {
      //console.error("Canvas references are not initialized.");
      return;
    }
  
    // Get canvas contexts
    const maskCanvas = maskCanvasRef.current;
  
    const maskContext = maskCanvas.getContext("2d");
  
    // Get image data from both canvases
    const maskImageData = maskContext.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const segmentationImageData = coloredPartImage.data
  
    const maskData = maskImageData.data; // RGBA values for the mask
    // console.log(`Mask Canvas Dimensions: ${maskCanvas.width}x${maskCanvas.height}`);
    // console.log(`Segmentation Canvas Dimensions: ${coloredPartImage.width}x${coloredPartImage.height}`);
      
    if (maskData.length !== segmentationImageData.length) {
      console.error("Canvas dimensions do not match.");
      // console.log(`Mask Canvas Dimensions: ${maskCanvas.width}x${maskCanvas.height}`);
      // console.log(`Segmentation Canvas Dimensions: ${coloredPartImage.width}x${coloredPartImage.height}`);
      console.log(`lengths: ${maskData.length}x${segmentationImageData.length}`);
      return;
    }
  
    let totalMaskPixels = 0; // Total pixels in the mask where alpha is 0
    let overlapPixels = 0;   // Count of overlapping pixels
  
    // Loop through each pixel (RGBA values are in groups of 4)
    for (let i = 0; i < maskData.length; i += 4) {
      const maskAlpha = maskData[i + 3]; // Alpha channel of the mask pixel
      const r = segmentationImageData[i]; // red channel of the segmentation pixel
      const g = segmentationImageData[i + 1]; // green channel of the segmentation pixel
      const b = segmentationImageData[i + 2]; // blue channel of the segmentation pixel
      const segAlpha = segmentationImageData[i + 3]; // Alpha channel of the segmentation pixel
  
      if (maskAlpha === 0) {
        totalMaskPixels++; // Count the transparent pixels in the mask
  
        // Check if there's any segmentation pixel overlap
        if (r !== 255 && g !== 255 && b !== 255 && segAlpha > 0) {
          overlapPixels++;
        }
      }
    }
  
    // Calculate overlap percentage
    const overlapPercentage = (overlapPixels / totalMaskPixels) * 100;
    return overlapPercentage;
  };
  

  // const detect = async (net, intervalId) => {
  //   if (
  //     webcamRef.current &&
  //     CanvasRef.current &&
  //     webcamRef.current.video.readyState === 4
  //   ) {
  //     const video = webcamRef.current.video;
  //     const videoWidth = video.videoWidth;
  //     const videoHeight = video.videoHeight;

  //     const segmentationCanvas = CanvasRef.current;
  //     segmentationCanvas.width = videoWidth;
  //     segmentationCanvas.height = videoHeight;

  //     const context = segmentationCanvas.getContext("2d");
  //     context.clearRect(0, 0, videoWidth, videoHeight);

  //     const segmentationConfig = {
  //       flipHorizontal: false, // Flip video horizontally if needed
  //       internalResolution: "medium", // Higher resolution improves accuracy
  //       segmentationThreshold: THRESHOLD,   // Confidence threshold for segmentation
  //       maxDetections: 1,             // Detect only one person
  //       scoreThreshold: THRESHOLD,          // Minimum confidence score for keypoints
  //     };
      
  //     const person = await net.segmentPersonParts(video, segmentationConfig);
      
  //     if (person.allPoses[0]) {
  //       // Create a colored part mask
  //       const coloredPartImage = bodyPix.toColoredPartMask(person);

  //       // console.log(person);
  //       const keypoints = person.allPoses[0].keypoints;
  
  //       // Check keypoints for user guidance
  //       const leftEye = keypoints.find((k) => k.part === "leftEye");
  //       const rightEye = keypoints.find((k) => k.part === "rightEye");
  //       const leftHip = keypoints.find((k) => k.part === "leftHip");
  //       const rightHip = keypoints.find((k) => k.part === "rightHip");
  //       const leftAnkle = keypoints.find((k) => k.part === "leftAnkle");
  //       const rightAnkle = keypoints.find((k) => k.part === "rightAnkle");
        
  //       if (
  //         (stage === "captureFront" && (
  //           leftEye.score < THRESHOLD ||
  //           rightEye.score < THRESHOLD ||
  //           rightHip.score < THRESHOLD ||
  //           leftHip.score < THRESHOLD ||
  //           leftAnkle.score < THRESHOLD ||
  //           rightAnkle.score < THRESHOLD)) || 
  //         (stage === "captureSide" && 
  //           (rightEye.score < THRESHOLD ||
  //           rightHip.score < THRESHOLD ||
  //           rightAnkle.score < THRESHOLD))
  //       ) {

  //         // console.log("Left shoulder:", leftShoulder.score)
  //         // console.log("Right shoulder:", rightShoulder.score)
  //         // console.log("Left hip:", leftHip.score)
  //         // console.log("Right hip:", rightHip.score)
  //         // console.log("Left ankle:", leftAnkle.score)
  //         // console.log("Right ankle:", rightAnkle.score)
  //         const overlap = CheckOverlap(coloredPartImage);

  //         drawSegmentationOverlay(video, coloredPartImage, RedColor);
  //         changeText("Please make sure your entire body is visible.", "rgba(255,0,0,127)");
  //         return;
  //       }
  //       else
  //       {
  //         // console.log("Person:" + stage, person)
  //         const overlap = CheckOverlap(coloredPartImage);
  //         drawSegmentationOverlay(video, coloredPartImage, GreenColor);
  //         console.log("overlap: ", overlap)
  //         if (overlap < OverlapThreshold){
  //           changeText("your body is visible but not in frame adjust yourself properly. Testing", "rgba(255,255,0,127)");
  //         }
  //         else if(overlap >= OverlapThreshold){
  //           changeText("Scanning", "rgba(0,255,0,127)");
  //           setFrameCount((prev) => {
  //             if (prev + 1 === FRAMES) {
  //               clearInterval(intervalId);
  //               if (stage === "captureFront") {
  //                 setStage("promptSide");
  //               } else if (stage === "captureSide") {
  //                 setStage("complete");
  //               }
  //             } else {
  //               if (stage === "captureFront") {
  //                 setFrontData((prevData) => [...prevData, person]);
  //               } else if (stage === "captureSide") {
  //                 setSideData((prevData) => [...prevData, person]);
  //               }
  //             }
  //             return prev + 1;
  //           });
  //         }
  //       } 
  //     } else {
  //       console.log("Waiting for video to be ready...");
  //     }
  // };
  const detect = async (net, intervalId) => {
    if (
      webcamRef.current &&
      CanvasRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
  
      const segmentationCanvas = CanvasRef.current;
      segmentationCanvas.width = videoWidth;
      segmentationCanvas.height = videoHeight;
  
      const context = segmentationCanvas.getContext("2d");
      context.clearRect(0, 0, videoWidth, videoHeight);
  
      const segmentationConfig = {
        flipHorizontal: false, // Flip video horizontally if needed
        internalResolution: "medium", // Higher resolution improves accuracy
        segmentationThreshold: THRESHOLD,   // Confidence threshold for segmentation
        maxDetections: 1,             // Detect only one person
        scoreThreshold: THRESHOLD,          // Minimum confidence score for keypoints
      };
  
      const person = await net.segmentPersonParts(video, segmentationConfig);
  
      if (person.allPoses[0]) {
        // Create a colored part mask
        const coloredPartImage = bodyPix.toColoredPartMask(person);
  
        const keypoints = person.allPoses[0].keypoints;
  
        // Check keypoints for user guidance
        const leftEye = keypoints.find((k) => k.part === "leftEye");
        const rightEye = keypoints.find((k) => k.part === "rightEye");
        const leftHip = keypoints.find((k) => k.part === "leftHip");
        const rightHip = keypoints.find((k) => k.part === "rightHip");
        const leftAnkle = keypoints.find((k) => k.part === "leftAnkle");
        const rightAnkle = keypoints.find((k) => k.part === "rightAnkle");
  
        if (
          (stage === "captureFront" && (
            leftEye.score < THRESHOLD ||
            rightEye.score < THRESHOLD ||
            rightHip.score < THRESHOLD ||
            leftHip.score < THRESHOLD ||
            leftAnkle.score < THRESHOLD ||
            rightAnkle.score < THRESHOLD)) ||
          (stage === "captureSide" &&
            (rightEye.score < THRESHOLD ||
              rightHip.score < THRESHOLD ||
              rightAnkle.score < THRESHOLD))
        ) {
          const overlap = CheckOverlap(coloredPartImage);
          drawSegmentationOverlay(video, coloredPartImage, RedColor, keypoints);
          changeText("Please make sure your entire body is visible.", "rgba(255,0,0,127)");
          return;
        } else {
          const overlap = CheckOverlap(coloredPartImage);
          drawSegmentationOverlay(video, coloredPartImage, GreenColor, keypoints);
          if (overlap < OverlapThreshold) {
            changeText("Your body is visible but not in frame. Adjust yourself properly.", "rgba(255,255,0,127)");
          } else if (overlap >= OverlapThreshold) {
            changeText("Scanning", "rgba(0,255,0,127)");
            setFrameCount((prev) => {
              if (prev + 1 === FRAMES) {
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
          }
        }
      } else {
        console.log("Waiting for video to be ready...");
      }
    }
  };

  
const handleSubmitMeasurements = async () => {
  console.log("Save Measurements button clicked"); 
  if (measurements) {
    const doc = new jsPDF();
    
    try{
      // Add measurements in cm
      doc.text("Measurements in cm", 10, 10);
      doc.text(`Height: ${Math.floor(measurements.height)} cm`, 10, 20);
      doc.text(`Chest: ${Math.floor(measurements.chest)} cm`, 10, 30);
      doc.text(`Shoulder Width: ${Math.floor(measurements.shoulder_width)} cm`, 10, 40);
      doc.text(`Arm Length: ${Math.floor(measurements.arm_length)} cm`, 10, 50);
      doc.text(`Leg Length: ${Math.floor(measurements.leg_length)} cm`, 10, 60);
      doc.text(`Waist: ${Math.floor(measurements.waist)} cm`, 10, 70);
      doc.text(`Navel Length: ${Math.floor(measurements.navel_length)} cm`, 10, 80);
      doc.text(`Torso Length: ${Math.floor(measurements.torso_length)} cm`, 10, 90);

      // Add measurements in inches
      doc.addPage();
      doc.text("Measurements in inches", 10, 10);
      doc.text(`Height: ${convertToInches(measurements.height)} in`, 10, 20);
      doc.text(`Chest: ${convertToInches(measurements.chest)} in`, 10, 30);
      doc.text(`Shoulder Width: ${convertToInches(measurements.shoulder_width)} in`, 10, 40);
      doc.text(`Arm Length: ${convertToInches(measurements.arm_length)} in`, 10, 50);
      doc.text(`Leg Length: ${convertToInches(measurements.leg_length)} in`, 10, 60);
      doc.text(`Waist: ${convertToInches(measurements.waist)} in`, 10, 70);
      doc.text(`Navel Length: ${convertToInches(measurements.navel_length)} in`, 10, 80);
      doc.text(`Torso Length: ${convertToInches(measurements.torso_length)} in`, 10, 90);

      doc.save("measurements.pdf");
      console.log("PDF created successfully.");
      console.log("Measurements saved!");
    } catch (error) {
      console.error("Error creating PDF:", error);
    }

    // Log all the parameters being sent to best-fit
    console.log("Navigating to best-fit with parameters:", {
      height: measurements.height,
      chest: measurements.chest,
      shoulder_width: measurements.shoulder_width,
      arm_length: measurements.arm_length,
      leg_length: measurements.leg_length,
      waist: measurements.waist,
      navel_length: measurements.navel_length,
      torso_length: measurements.torso_length,
      image: image,
      title: title,
      gender: gender,
      category: category
    });

    // Saving the user Data into User Model
    User.height = measurements.height;
    User.chest = measurements.chest;
    User.shoulder_width = measurements.shoulder_width;
    User.arm_length = measurements.arm_length;
    User.leg_length = measurements.leg_length;
    User.waist = measurements.waist;
    User.navel_length = measurements.navel_length;
    User.torso_length = measurements.torso_length;

    router.push(`/best-fit?height=${measurements.height}&chest=${measurements.chest}&shoulder_width=${measurements.shoulder_width}&arm_length=${measurements.arm_length}&leg_length=${measurements.leg_length}&waist=${measurements.waist}&navel_length=${measurements.navel_length}&torso_length=${measurements.torso_length}&image=${image}&title=${title}&gender=${gender}&category=${category}`);
    
  } else {
    console.error("No measurements available to submit.");
    router.push('/');
  }
};

  useEffect(() => {
    if (stage === "complete" && frontData.length > 0 && sideData.length > 0) {
      try {
        const measurements = calculateBodyMeasurements(
          frontData,
          sideData,
          personHeight
        );
        setMeasurements(measurements);
        console.log("Measurements calculated:", measurements);
      } catch (error) {
        console.error("Error calculating measurements:", error);

        resetState(); // Reset the state
        setAlertMessage("Size was not taken correctly. Please try again.");
        setShowAlert(true);
        setStage("enterHeight"); // Redirect user to height input page
      }
    }
  }, [stage, frontData, sideData]);

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const resetState = () => {
    setPersonHeight(null);
    setFrameCount(0);
    setFrontData([]);
    setSideData([]);
    setMeasurements(null);
  };

  useEffect(() => {
    console.log("Effect running for stage:", stage);
    runBodysegment();
  }, [stage]); // Log when effect runs

  const handleHeightSubmit = (inputHeight) => {
    setPersonHeight(inputHeight);
    setStage("captureFront"); // Proceed to capturing front profile after height is entered
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "cm" ? "in" : "cm"));
  };

  const convertToInches = (cm) => (cm / 2.54).toFixed(2);

  return (
    <div className="App">
      <header className="App-header">
        {showAlert && (
          <CustomAlert message={alertMessage} onClose={handleCloseAlert} />
        )}
        {!showAlert && stage === "enterHeight" && (
          <Height onSubmit={handleHeightSubmit} getHeight={showGetHeight} />
        )}
        {!showAlert && (stage === "captureFront" || stage === "captureSide") && (
          <>
          <p ref={guidanceRef} className="guidance-msg">hello</p>
          <div className="webcam-container">
            <Webcam
              ref={webcamRef}
              className="webcam"
              videoConstraints={{
                facingMode: "user",
                aspectRatio: 9/16,
              }}
              style={{ objectFit: "cover", aspectRatio: 9/16 }}
            />
            <canvas ref={CanvasRef} className="webcam-canvas" />
            <canvas ref={segmentationCanvasRef} className="mask-canvas" />
            <canvas ref={maskCanvasRef} className="mask-canvas" />
            
          </div>
          </>
        )}
        {!showAlert && stage === "promptSide" && (
          <div className="modal-form">
            <label className="form-title">
              Please turn sideways towards the left. Scanning will start in{" "}
              <span>{countdown}</span> seconds.
            </label>
          </div>
        )}
        {!showAlert && stage === "complete" && measurements && (
          <div className="modal-form">
            <h2 className="form-title">Measurements</h2>
            <button className="unit-toggle-button" onClick={toggleUnit}>
              View in {unit === "cm" ? "inches" : "centimeters"}
            </button>
            <div className="measurements-container">
              <div className="form-description">
                Height: {unit === "cm" ? Math.floor(measurements.height) : convertToInches(measurements.height)} {unit}
              </div>
              <div className="form-description">
                Chest: {unit === "cm" ? Math.floor(measurements.chest) : convertToInches(measurements.chest)} {unit}
              </div>
              <div className="form-description">
                Shoulder Width: {unit === "cm" ? Math.floor(measurements.shoulder_width) : convertToInches(measurements.shoulder_width)} {unit}
              </div>
              <div className="form-description">
                Arm Length: {unit === "cm" ? Math.floor(measurements.arm_length) : convertToInches(measurements.arm_length)} {unit}
              </div>
              <div className="form-description">
                Leg Length: {unit === "cm" ? Math.floor(measurements.leg_length) : convertToInches(measurements.leg_length)} {unit}
              </div>
              <div className="form-description">
                Waist: {unit === "cm" ? Math.floor(measurements.waist) : convertToInches(measurements.waist)} {unit}
              </div>
              <div className="form-description">
                Navel Length: {unit === "cm" ? Math.floor(measurements.navel_length) : convertToInches(measurements.navel_length)} {unit}
              </div>
              <div className="form-description">
                Torso Length: {unit === "cm" ? Math.floor(measurements.torso_length) : convertToInches(measurements.torso_length)} {unit}
              </div>
            </div>
            <button
              className="save-button"
              onClick={handleSubmitMeasurements}
              style={{ marginTop: "20px" }}
            >
              Save
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;