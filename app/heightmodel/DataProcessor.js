"use client";

import React, { useState, useEffect } from 'react';


function calculatePersonHeight(allPoses) {
    // Filter keypoints with a confidence score greater than 0.5
    const validKeypoints = allPoses.flatMap(pose => pose.keypoints.filter(point => point.score > 0.5));
  
    // Find the keypoints for shoulders and ankles
    const leftEye = validKeypoints.find(point => point.part === 'leftEye');
    const rightEye = validKeypoints.find(point => point.part === 'rightEye');
    const leftAnkle = validKeypoints.find(point => point.part === 'leftAnkle');
    const rightAnkle = validKeypoints.find(point => point.part === 'rightAnkle');
  
    // Check if all necessary keypoints are present
    if (!leftEye || !rightEye || !leftAnkle || !rightAnkle) {
      return 0; // or return null if you prefer to indicate an invalid calculation
    }
  
    // Calculate the height as the difference between the y-coordinates of shoulders and ankles
    const shoulderHeight = (leftEye.position.y + rightEye.position.y) / 2;
    const ankleHeight = (leftAnkle.position.y + rightAnkle.position.y) / 2;
    const height = ankleHeight - shoulderHeight;
  
    return height;
  }
  
  function calculateArmLength(allPoses) {
    
    const validKeypoints = allPoses.flatMap(pose => pose.keypoints.filter(point => point.score > 0.5));

    const leftShoulder = validKeypoints.find(point => point.part === 'leftShoulder');
    const rightShoulder = validKeypoints.find(point => point.part === 'rightShoulder');
    const leftWrist = validKeypoints.find(point => point.part === 'leftWrist');
    const rightWrist = validKeypoints.find(point => point.part === 'rightWrist');

    const leftArmLength = Math.sqrt(
      Math.pow(leftShoulder.position.x - leftWrist.position.x, 2) +
      Math.pow(leftShoulder.position.y - leftWrist.position.y, 2)
    );
  
    const rightArmLength = Math.sqrt(
      Math.pow(rightShoulder.position.x - rightWrist.position.x, 2) +
      Math.pow(rightShoulder.position.y - rightWrist.position.y, 2)
    );
  
    return Math.abs(leftArmLength);//{ leftArmLength, rightArmLength };
  }
  
  function calculateLegLength(allPoses) {
    const validKeypoints = allPoses.flatMap(pose => pose.keypoints.filter(point => point.score > 0.5));

    const leftHip = validKeypoints.find(point => point.part === 'leftHip');
    const rightHip = validKeypoints.find(point => point.part === 'rightHip');
    const leftAnkle = validKeypoints.find(point => point.part === 'leftAnkle');
    const rightAnkle = validKeypoints.find(point => point.part === 'rightAnkle');

    const leftLegLength = Math.sqrt(
      Math.pow(leftHip.position.x - leftAnkle.position.x, 2) +
      Math.pow(leftHip.position.y - leftAnkle.position.y, 2)
    );
  
    /*const rightLegLength = Math.sqrt(
      Math.pow(rightHip.position.x - rightAnkle.position.x, 2) +
      Math.pow(rightHip.position.y - rightAnkle.position.y, 2)
    );*/
  
    return Math.abs(leftLegLength);//{ leftLegLength, rightLegLength };
  }
  
  function calculateNavelLength(allPoses) {
    const validKeypoints = allPoses.flatMap(pose => pose.keypoints.filter(point => point.score > 0.5));

    const leftHip = validKeypoints.find(point => point.part === 'leftHip');
    const rightHip = validKeypoints.find(point => point.part === 'rightHip');
    const leftAnkle = validKeypoints.find(point => point.part === 'leftAnkle');
    const rightAnkle = validKeypoints.find(point => point.part === 'rightAnkle');


    const navelPositionY = (leftHip.position.y + rightHip.position.y) / 2; // Approximate Y position
    const ankleAverageY = (leftAnkle.position.y + rightAnkle.position.y) / 2; // Average Y position of ankles
    return Math.abs((ankleAverageY - navelPositionY)*0.75); // Distance from navel to ankles
  }
  
  function calculateFrontWaist(allPoses) {
    const validKeypoints = allPoses.flatMap(pose => pose.keypoints.filter(point => point.score > 0.5));

    const leftHip = validKeypoints.find(point => point.part === 'leftHip');
    const rightHip = validKeypoints.find(point => point.part === 'rightHip');

    return Math.abs(rightHip.position.x - leftHip.position.x) ;
  }
  
  function calculateChestSize(allPoses) {
    const validKeypoints = allPoses.flatMap(pose => pose.keypoints.filter(point => point.score > 0.5));

    const leftShoulder = validKeypoints.find(point => point.part === 'leftShoulder');
    const rightShoulder = validKeypoints.find(point => point.part === 'rightShoulder');

    return Math.abs(rightShoulder.position.x - leftShoulder.position.x);
  }
  
  function DataProcessor({ poses, height, setResults }) {
    const [results, setInternalResults] = useState({});

    useEffect(() => {
        if (!poses || poses.length === 0) return;

        const pose = poses[0]; // Assuming there's only one pose detected for simplicity
        const pixelHeight = calculatePersonHeight(pose);
        const scale = height / pixelHeight;

        const armLength = calculateArmLength(
            pose
        ) * scale;

        const legLength = calculateLegLength(
          pose
        ) * scale;

        const frontWaist = calculateFrontWaist(
          pose        ) * scale;

        const chestSize = calculateChestSize(
          pose
        ) * scale;

        const newResults = {
            armLength: armLength.toFixed(2),
            legLength: legLength.toFixed(2),
            frontWaist: frontWaist.toFixed(2),
            chestSize: chestSize.toFixed(2),
            detectedHeight: (pixelHeight * scale).toFixed(2)
        };

        setInternalResults(newResults);
        if (setResults) setResults(newResults);
    }, [poses, height, setResults]);

    return (
        <div>
            {/* Display results if needed */}
            {Object.entries(results).map(([key, value]) => (
                <p key={key}>{`${key}: ${value} units`}</p>
            ))}
        </div>
    );
}

export default DataProcessor;  