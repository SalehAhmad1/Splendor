function calculatePersonHeight(leftEye, rightEye, leftAnkle, rightAnkle) {
  if (!leftEye || !rightEye || !leftAnkle || !rightAnkle) {
    return null;
  }

  const eyeHeight = (leftEye.position.y + rightEye.position.y) / 2;
  const ankleHeight = (leftAnkle.position.y + rightAnkle.position.y) / 2;
  const height = ankleHeight - eyeHeight;

  return height;
}


// function calculateArmLength(
//   leftShoulder,
//   leftElbow,
//   leftWrist,
//   rightShoulder,
//   rightElbow,
//   rightWrist
// ) {
//   if (
//     !leftShoulder ||
//     !leftElbow ||
//     !leftWrist ||
//     !rightShoulder ||
//     !rightElbow ||
//     !rightWrist
//   ) {
//     return { ArmLength: null }; // or null if you prefer to indicate an invalid calculation
//   }

//   const leftArmLength = Math.sqrt(
//     Math.pow(leftShoulder.position.x - leftWrist.position.x, 2) +
//       Math.pow(leftShoulder.position.y - leftWrist.position.y, 2)
//   );

//   const rightArmLength = Math.sqrt(
//     Math.pow(rightShoulder.position.x - rightWrist.position.x, 2) +
//       Math.pow(rightShoulder.position.y - rightWrist.position.y, 2)
//   );

//   const ArmLength = Math.abs((leftArmLength + rightArmLength) / 2);
//   return ArmLength;
// }

function calculateArmLength(
  leftShoulder,
  leftElbow,
  leftWrist,
  rightShoulder,
  rightElbow,
  rightWrist
) {
  if (
    !leftShoulder ||
    !leftElbow ||
    !leftWrist ||
    !rightShoulder ||
    !rightElbow ||
    !rightWrist
  ) {
    return { ArmLength: null }; // Return null if any input is missing
  }

  // Calculate the length of the left arm (shoulder to elbow + elbow to wrist)
  const leftUpperArmLength = Math.sqrt(
    Math.pow(leftShoulder.position.x - leftElbow.position.x, 2) +
    Math.pow(leftShoulder.position.y - leftElbow.position.y, 2)
  );

  const leftForearmLength = Math.sqrt(
    Math.pow(leftElbow.position.x - leftWrist.position.x, 2) +
    Math.pow(leftElbow.position.y - leftWrist.position.y, 2) 
  );

  const leftArmLength = leftUpperArmLength + leftForearmLength;

  // Calculate the length of the right arm (shoulder to elbow + elbow to wrist)
  const rightUpperArmLength = Math.sqrt(
    Math.pow(rightShoulder.position.x - rightElbow.position.x, 2) +
    Math.pow(rightShoulder.position.y - rightElbow.position.y, 2)
  );

  const rightForearmLength = Math.sqrt(
    Math.pow(rightElbow.position.x - rightWrist.position.x, 2) +
    Math.pow(rightElbow.position.y - rightWrist.position.y, 2)
  );

  const rightArmLength = rightUpperArmLength + rightForearmLength;

  // Calculate the average arm length
  const ArmLength = Math.abs((leftArmLength + rightArmLength) / 2);
  return ArmLength;
}

// function calculateLegLength(
//   leftHip,
//   leftKnee,
//   leftAnkle,
//   rightHip,
//   rightKnee,
//   rightAnkle
// ) {
//   if (
//     !leftHip ||
//     !leftKnee ||
//     !leftAnkle ||
//     !rightHip ||
//     !rightKnee ||
//     !rightAnkle
//   ) {
//     return null; // or null if you prefer to indicate an invalid calculation
//   }
//   const leftLegLength = Math.sqrt(
//     Math.pow(leftHip.position.x - leftAnkle.position.x, 2) +
//       Math.pow(leftHip.position.y - leftAnkle.position.y, 2)
//   );

//   const rightLegLength = Math.sqrt(
//     Math.pow(rightHip.position.x - rightAnkle.position.x, 2) +
//       Math.pow(rightHip.position.y - rightAnkle.position.y, 2)
//   );
//   const LegLength = Math.abs((leftLegLength + rightLegLength) / 2);

//   return LegLength;
// }

function calculateLegLength(
  leftHip,
  leftKnee,
  leftAnkle,
  rightHip,
  rightKnee,
  rightAnkle
) {
  if (
    !leftHip ||
    !leftKnee ||
    !leftAnkle ||
    !rightHip ||
    !rightKnee ||
    !rightAnkle
  ) {
    return null; // Return null if any input is missing
  }

  // Calculate the length of the left leg (hip to knee + knee to ankle)
  const leftThighLength = Math.sqrt(
    Math.pow(leftHip.position.x - leftKnee.position.x, 2) +
    Math.pow(leftHip.position.y - leftKnee.position.y, 2)
  );

  const leftShinLength = Math.sqrt(
    Math.pow(leftKnee.position.x - leftAnkle.position.x, 2) +
    Math.pow(leftKnee.position.y - leftAnkle.position.y, 2)
  );

  const leftLegLength = leftThighLength + leftShinLength;

  // Calculate the length of the right leg (hip to knee + knee to ankle)
  const rightThighLength = Math.sqrt(
    Math.pow(rightHip.position.x - rightKnee.position.x, 2) +
    Math.pow(rightHip.position.y - rightKnee.position.y, 2)
  );

  const rightShinLength = Math.sqrt(
    Math.pow(rightKnee.position.x - rightAnkle.position.x, 2) +
    Math.pow(rightKnee.position.y - rightAnkle.position.y, 2)
  );

  const rightLegLength = rightThighLength + rightShinLength;

  // Calculate the average leg length
  const LegLength = Math.abs((leftLegLength + rightLegLength) / 2);
  return LegLength * 1.1;
}

function calculateNavelLength(leftHip, rightHip, leftAnkle, rightAnkle) {
  if (!leftHip || !rightHip || !leftAnkle || !rightAnkle) {
    return null; // or null if you prefer to indicate an invalid calculation
  }
  const navelPositionY = (leftHip.position.y + rightHip.position.y) / 2;
  const ankleAverageY = (leftAnkle.position.y + rightAnkle.position.y) / 2;
  const navelLength = Math.abs((ankleAverageY - navelPositionY) * 0.75);
  return navelLength;
}

// function calculateThighs(
//   fleftKnee,
//   frightKnee,
//   fleftHip,
//   frightHip,
//   // sleftKnee,
//   // srightKnee,
//   // sleftHip,
//   // srightHip,
//   frontdata,
//   sidedata
// ) {
//   const frontThighPosition_x = (fleftKnee.position.x + fleftHip.position.x) / 2;
//   const frontThighPosition_y = (fleftKnee.position.y + fleftHip.position.y) / 2;
//   const frontDiameter = 0;
//   const sideDiameter = 0;
//   const a = frontDiameter / 2; // semi-major axis (width)
//   const b = sideDiameter / 2; // semi-minor axis (depth)

//   // Calculate the circumference of the ellipse
//   const ThighSize =
//     Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));

//   return ThighSize;
// }

function calculateThighs(
  fleftKnee,
  frightKnee,
  fleftHip,
  frightHip,
  frontdata,
  sidedata
) {
  // Validate input
  if (
    !fleftKnee ||
    !frightKnee ||
    !fleftHip ||
    !frightHip ||
    !frontdata ||
    !sidedata
  ) {
    return null; // Return null if any input is missing
  }

  // Calculate the midpoint of the thigh in the front view (x, y)
  const frontThighPosition_x = (fleftKnee.position.x + fleftHip.position.x) / 2;
  const frontThighPosition_y = (fleftKnee.position.y + fleftHip.position.y) / 2;

  // Extract diameters from front and side data
  const frontDiameter = frontdata.diameter; // Front view diameter (width)
  const sideDiameter = sidedata.diameter;   // Side view diameter (depth)

  // Semi-major axis (width) and semi-minor axis (depth)
  const a = frontDiameter / 2; // Semi-major axis
  const b = sideDiameter / 2;  // Semi-minor axis

  // Calculate the circumference of the ellipse
  const ThighSize =
    Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));

  return ThighSize;
}

function calculateBiceps(
  fleftElbow,
  frightElbow,
  fleftShoulder,
  frightShoulder,
  // sleftElbow,
  // srightElbow,
  // sleftShoulder,
  // srightShoulder,
  frontdata,
  sidedata
) {
  const frontBicepPosition_x =
    (fleftElbow.position.x + fleftShoulder.position.x) / 2;
  const frontBicepPosition_y =
    (fleftElbow.position.y + fleftShoulder.position.y) / 2;
  const frontDiameter = 0;
  const sideDiameter = 0;
  const a = frontDiameter / 2; // semi-major axis (width)
  const b = sideDiameter / 2; // semi-minor axis (depth)

  // Calculate the circumference of the ellipse
  const BicepSize =
    Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));

  return BicepSize;
}
function analyzeSideData(y, sideData) {
  let torsoX = [];
  const imageWidth = 640;
  // Loop through each x-coordinate at the given y-coordinate
  for (let x = 0; x < 640; x++) {
    const index = y * imageWidth + x; // Calculate the index in the 1D array
    const value = sideData[index];

    // Check if the value is either 12 (torso_front) or 13 (torso_back)
    if (value === 12 || value === 13) {
      torsoX.push(x); // Store x-coordinate where torso occurs
    }
  }

  const torsoCount = torsoX.length;
  const torsoLength =
    torsoCount > 0 ? Math.max(...torsoX) - Math.min(...torsoX) : 0;

  return torsoLength;
}
// function calculateChest(
//   leftShoulder,
//   leftHip,
//   rightShoulder,
//   rightHip,
//   frontdata,
//   sidedata
// ) {
//   const frontChestLength = Math.abs(
//     rightShoulder.position.x - leftShoulder.position.x
//   );
//   frontChestLength = frontChestLength * 1.15;

//   // const sideChestLength_y = Math.abs(
//   //   (leftShoulder.position.y + leftHip.position.y) / 2   
//   // );

//   const sideChestLength_y = frontChestLength / 2

//   const a = frontChestLength / 2; // semi-major axis (width)

//   const b = analyzeSideData(sideChestLength_y, sidedata) / 2; // semi-minor axis (depth)

//   // Calculate the circumference of the ellipse
//   const ChestSize =
//   Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));

//   return ChestSize;
// }

function calculateChest(
  leftShoulder,
  leftHip,
  rightShoulder,
  rightHip,
  frontdata,
  sidedata
) {
  // Calculate horizontal chest width from shoulder points
  const shoulderWidth = Math.abs(
    rightShoulder.position.x - leftShoulder.position.x
  );
  
  // Anthropometric adjustment for chest width (replace 1.15 with empirical value if available)
  const frontChestLength = shoulderWidth * 1.25;

  // Calculate vertical midpoint between shoulder and hip for depth measurement
  const verticalMidpoint = (leftShoulder.position.y + leftHip.position.y) / 2;

  // Get chest depth from side view at calculated vertical position
  const chestDepth = analyzeSideData(verticalMidpoint, sidedata) || 15; // Assume average if missing



  // Use elliptical approximation with Ramanujan's formula
  const a = frontChestLength / 2;   // Semi-major axis (width)
  const b = chestDepth / 2;         // Semi-minor axis (depth)

  // Improved circumference calculation with error checking
  if (a <= 0 || b <= 0) return 0;  // Handle invalid inputs
  
  // More precise approximation for extreme axis ratios
  const h = Math.pow((a - b)/(a + b), 2);
  const circumference = Math.PI * (a + b) * (1 + (3*h)/(10 + Math.sqrt(4 - 3*h)));

  return circumference;
}


// function calculateFrontWaist(leftHip, rightHip, frontdata, sideData) {
//   if (!leftHip || !rightHip) {
//     return null; // or null if you prefer to indicate an invalid calculation
//   }
//   console.log("SIDEDATA: ###### ", sideData);
//   return Math.abs(rightHip.position.x - leftHip.position.x);
// }
function calculateFrontWaist(leftHip, rightHip, leftHip_front, rightHip_front, sidedata) {


  if (!leftHip || !rightHip) {
    return null; // or null if you prefer to indicate an invalid calculation
  }
  const waistDepth = Math.abs((leftHip.position.y + rightHip.position.y) / 2 );

  const a = Math.abs(rightHip_front.position.x - leftHip_front.position.x) ;
  const b = analyzeSideData(waistDepth, sidedata) / 1.75; // semi-minor axis (depth)

   // Optionally ensure that the semi-major axis is the larger one
   let major = a;
   let minor = b;
   if (b > a) {
     major = b;
     minor = a;
   }


   const h = Math.pow((major - minor) / (major + minor), 2);
   const waistCircumference = Math.PI * (major + minor) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

  return waistCircumference;
}

// function calculateFrontWaist(leftHip, rightHip, sidedata) {


//   if (!leftHip || !rightHip) {
//     return null; // or null if you prefer to indicate an invalid calculation
//   }
//   const frontwaistLength = Math.abs(
//     rightHip.position.x - leftHip.position.x
//   );

//   const waistDepth = Math.abs((leftHip.position.y + rightHip.position.y) / 2);

//   const a = frontwaistLength / 1.5;
//   const b = analyzeSideData(waistDepth, sidedata) / 1.5; // semi-minor axis (depth)

//   const WaistSize =
//     Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));

//   return WaistSize;
// }

// function calculateShoulderSize(leftShoulder, rightShoulder) {
//   if (!leftShoulder || !rightShoulder) {
//     return 0; // or null if you prefer to indicate an invalid calculation
//   }

//   return Math.abs(rightShoulder.position.x - leftShoulder.position.x);
// }

function calculateShoulderSize(leftShoulder, rightShoulder, offsetFactor = 1.35) {
  if (!leftShoulder || !rightShoulder) {
    return 0;
  }

  const rawWidth = Math.abs(rightShoulder.position.x - leftShoulder.position.x);
  return rawWidth * offsetFactor; // Apply a factor to estimate the full shoulder width
}

// function calculateShoulderSize(leftShoulder, rightShoulder) {
//   // Validate input
//   if (
//     !leftShoulder || !rightShoulder 
//   ) {
//     return null; // Return null for invalid input
//   }

//   // Calculate the 3D Euclidean distance between the shoulders
//   const dx = rightShoulder.position.x - leftShoulder.position.x; // Horizontal difference
//   const dy = rightShoulder.position.y - leftShoulder.position.y; // Vertical difference

//   // dx = dx + 2
//   // dy = dy + 2
  

//   const shoulderSize = Math.sqrt(dx * dx + dy * dy );

//   return shoulderSize;
// }

function calculateTorsoLength(leftShoulder, leftHip, rightShoulder, rightHip) {
  if (!leftShoulder || !rightShoulder) {
    return 0; // or null if you prefer to indicate an invalid calculation
  }
  const avgShoulder = Math.abs(
    (rightShoulder.position.y - leftShoulder.position.y) / 2
  );
  const avgHip = Math.abs((rightHip.position.y - leftHip.position.y) / 2);
  return Math.abs(rightShoulder.position.y - rightHip.position.y);
}

function calculateAverage(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return 0;
  }

  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}

function convertToTwoDecimalPlaces(value) {
  console.log("VALUE coming from model: ", value);
    if (typeof value === 'string') {
        let number = parseFloat(value);

        if (!isNaN(number)) {
            return number.toFixed(2);
        } else {
            return "Invalid input";
        }
    } else if (typeof value === 'number') {
        return value.toFixed(2);
    } else {
        return "Invalid input";
    }
}

const calculateBodyMeasurements = (frontData, sideData, personHeight) => {
  // Initialize arrays to store measurement results from each frame
  const heights = [];
  const ArmLengths = [];
  const LegLengths = [];
  const navelLengths = [];
  const frontWaists = [];
  const shoulderSizes = [];
  const TorsoSizes = [];
  const ThighSizes = [];
  const ChestSizes = [];
  const BicepsSizes = [];


  frontData.map((front, side_index) => {
    if (Array.isArray(front.allPoses) && front.allPoses.length === 0) {

      return null; // Skip this frame if no poses are found in either front or side data
    }


    // console.log("ITEM: ", i);
    const frontPose = front["allPoses"];
    const sidePose = sideData[side_index].allPoses;

    const frontKeypoints = frontPose[0].keypoints;
    const frontdata = front.data;
    const sideKeypoints = sidePose[0].keypoints;
    const sidedata = sideData[side_index].data;

    const personpixelHeight = calculatePersonHeight(
      frontKeypoints.find((point) => point.part === "leftEye"),
      frontKeypoints.find((point) => point.part === "rightEye"),
      frontKeypoints.find((point) => point.part === "leftAnkle"),
      frontKeypoints.find((point) => point.part === "rightAnkle")
    );
    console.log("Person Height", personpixelHeight);
    console.log("Person Real Height", personHeight);
    const scale = personpixelHeight / (personHeight - 12);
    console.log("Scale", scale);
    const armLengths = 
      calculateArmLength(
        frontKeypoints.find((point) => point.part === "leftShoulder"),
        frontKeypoints.find((point) => point.part === "leftElbow"),
        frontKeypoints.find((point) => point.part === "leftWrist"),
        frontKeypoints.find((point) => point.part === "rightShoulder"),
        frontKeypoints.find((point) => point.part === "rightElbow"),
        frontKeypoints.find((point) => point.part === "rightWrist")
      ) / scale;
    const legLengths = 
      calculateLegLength(
        frontKeypoints.find((point) => point.part === "leftHip"),
        frontKeypoints.find((point) => point.part === "leftKnee"),
        frontKeypoints.find((point) => point.part === "leftAnkle"),
        frontKeypoints.find((point) => point.part === "rightHip"),
        frontKeypoints.find((point) => point.part === "rightKnee"),
        frontKeypoints.find((point) => point.part === "rightAnkle")
      ) / scale;
    const navelLength = 
      calculateNavelLength(
        frontKeypoints.find((point) => point.part === "leftHip"),
        frontKeypoints.find((point) => point.part === "rightHip"),
        frontKeypoints.find((point) => point.part === "leftAnkle"),
        frontKeypoints.find((point) => point.part === "rightAnkle")
      ) / scale;

    const shoulderSize = 
      calculateShoulderSize(
        frontKeypoints.find((point) => point.part === "leftShoulder"),
        frontKeypoints.find((point) => point.part === "rightShoulder")
      ) / scale;
    const torsoLengths = 
      calculateTorsoLength(
        frontKeypoints.find((point) => point.part === "leftShoulder"),
        frontKeypoints.find((point) => point.part === "leftHip"),
        frontKeypoints.find((point) => point.part === "rightShoulder"),
        frontKeypoints.find((point) => point.part === "rightHip")
      ) / scale;
    const thighSize = 
      calculateThighs(
        frontKeypoints.find((point) => point.part === "leftKnee"),
        frontKeypoints.find((point) => point.part === "rightKnee"),
        frontKeypoints.find((point) => point.part === "leftHip"),
        frontKeypoints.find((point) => point.part === "rightHip"),
        // sideKeypoints.find((point) => point.part === "leftKnee"),
        // sideKeypoints.find((point) => point.part === "rightKnee"),
        // sideKeypoints.find((point) => point.part === "leftHip"),
        // sideKeypoints.find((point) => point.part === "rightHip"),
        frontdata,
        sidedata
      ) / scale;
    const chestSize = 
      calculateChest(
        frontKeypoints.find((point) => point.part === "leftShoulder"),
        frontKeypoints.find((point) => point.part === "leftHip"),
        frontKeypoints.find((point) => point.part === "rightShoulder"),
        frontKeypoints.find((point) => point.part === "rightHip"),
        // sideKeypoints.find((point) => point.part === "leftShoulder"),
        // sideKeypoints.find((point) => point.part === "leftHip"),
        // sideKeypoints.find((point) => point.part === "rightShoulder"),
        // sideKeypoints.find((point) => point.part === "rightHip"),
        frontdata,
        sidedata
      ) / scale;
    const bicepsSize = 
      calculateBiceps(
        frontKeypoints.find((point) => point.part === "leftElbow"),
        frontKeypoints.find((point) => point.part === "rightElbow"),
        frontKeypoints.find((point) => point.part === "leftShoulder"),
        frontKeypoints.find((point) => point.part === "rightShoulder"),
        // sideKeypoints.find((point) => point.part === "leftElbow"),
        // sideKeypoints.find((point) => point.part === "rightElbow"),
        // sideKeypoints.find((point) => point.part === "leftShoulder"),
        // sideKeypoints.find((point) => point.part === "rightShoulder"),
        frontdata,
        sidedata
      ) / scale;
    const frontWaist = 
      calculateFrontWaist(
        sideKeypoints.find((point) => point.part === "leftHip"),
        sideKeypoints.find((point) => point.part === "rightHip"),
        frontKeypoints.find((point) => point.part === "leftHip"),
        frontKeypoints.find((point) => point.part === "rightHip"),
        frontdata,
        sidedata
      ) / scale;

    // Store the results
    heights.push(personHeight);
    // heights.push(personpixelHeight)
    ArmLengths.push(armLengths)
    LegLengths.push(legLengths);
    navelLengths.push(navelLength);
    frontWaists.push(frontWaist);
    shoulderSizes.push(shoulderSize);
    TorsoSizes.push(torsoLengths);
    ThighSizes.push(thighSize);
    ChestSizes.push(chestSize);
    BicepsSizes.push(bicepsSize);
  });


  // Calculate the average for each measurement
  return {
    height:convertToTwoDecimalPlaces(calculateAverage(heights)),
    arm_length: convertToTwoDecimalPlaces(calculateAverage(ArmLengths)),
    leg_length: convertToTwoDecimalPlaces(calculateAverage(LegLengths)),
    navel_length: convertToTwoDecimalPlaces(calculateAverage(navelLengths)),
    waist: convertToTwoDecimalPlaces(calculateAverage(frontWaists)),
    shoulder_width: convertToTwoDecimalPlaces(calculateAverage(shoulderSizes)),
    torso_length: convertToTwoDecimalPlaces(calculateAverage(TorsoSizes)),
    thai_size: convertToTwoDecimalPlaces(calculateAverage(ThighSizes)),
    bicaeps_size: convertToTwoDecimalPlaces(calculateAverage(BicepsSizes)),
    chest: convertToTwoDecimalPlaces(calculateAverage(ChestSizes)),
    size_unit:'cm',
  };
};

export default calculateBodyMeasurements;



// // Helper: Euclidean distance between two keypoints
// function distance(pointA, pointB) {
//   return Math.sqrt(
//     Math.pow(pointA.position.x - pointB.position.x, 2) +
//     Math.pow(pointA.position.y - pointB.position.y, 2)
//   );
// }

// // Revised Height Calculation: Prefer nose; if not, use eyes with a correction factor.
// function calculatePersonHeight(leftEye, rightEye, leftAnkle, rightAnkle, nose = null) {
//   if (!leftAnkle || !rightAnkle) return null;
  
//   const ankleHeight = (leftAnkle.position.y + rightAnkle.position.y) / 2;
  
//   let topPointY;
//   if (nose) {
//     topPointY = nose.position.y;
//   } else if (leftEye && rightEye) {
//     const eyeY = (leftEye.position.y + rightEye.position.y) / 2;
//     // Empirical correction: add 10% of the eye-to-ankle distance
//     topPointY = eyeY - ((ankleHeight - eyeY) * 0.1);
//   } else {
//     return null;
//   }
  
//   return ankleHeight - topPointY;
// }

// // Revised Arm Length: Sum shoulder->elbow and elbow->wrist segments.
// function calculateArmLength(
//   leftShoulder, leftElbow, leftWrist,
//   rightShoulder, rightElbow, rightWrist
// ) {
//   if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist) {
//     return null;
//   }
  
//   const leftArm = distance(leftShoulder, leftElbow) + distance(leftElbow, leftWrist);
//   const rightArm = distance(rightShoulder, rightElbow) + distance(rightElbow, rightWrist);
  
//   return (leftArm + rightArm) / 2;
// }

// // Revised Leg Length: Sum hip->knee and knee->ankle segments.
// function calculateLegLength(
//   leftHip, leftKnee, leftAnkle,
//   rightHip, rightKnee, rightAnkle
// ) {
//   if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
//     return null;
//   }
  
//   const leftLeg = distance(leftHip, leftKnee) + distance(leftKnee, leftAnkle);
//   const rightLeg = distance(rightHip, rightKnee) + distance(rightKnee, rightAnkle);
  
//   return (leftLeg + rightLeg) / 2;
// }

// // Revised Torso Length: Use average y-coordinates.
// function calculateTorsoLength(leftShoulder, rightShoulder, leftHip, rightHip) {
//   if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return null;
  
//   const avgShoulderY = (leftShoulder.position.y + rightShoulder.position.y) / 2;
//   const avgHipY = (leftHip.position.y + rightHip.position.y) / 2;
  
//   return Math.abs(avgHipY - avgShoulderY);
// }

// // Analyze side data along a row (y coordinate) to find the horizontal extent (depth).
// function analyzeSideData(y, sideData) {
//   let torsoX = [];
//   const imageWidth = 640;
//   for (let x = 0; x < imageWidth; x++) {
//     const index = Math.floor(y) * imageWidth + x;
//     const value = sideData[index];
//     // Assuming 12 and 13 denote the torso regions
//     if (value === 12 || value === 13) {
//       torsoX.push(x);
//     }
//   }
//   return torsoX.length > 0 ? Math.max(...torsoX) - Math.min(...torsoX) : 0;
// }

// // Revised Chest: Use shoulder width and a mid-chest y coordinate.
// function calculateChest(leftShoulder, rightShoulder, leftHip, rightHip, sidedata) {
//   if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return null;
  
//   const chestWidth = Math.abs(rightShoulder.position.x - leftShoulder.position.x);
//   const chestY = (leftShoulder.position.y + rightShoulder.position.y + leftHip.position.y + rightHip.position.y) / 4;
//   const chestDepth = analyzeSideData(chestY, sidedata);
  
//   const a = chestWidth / 2;
//   const b = chestDepth / 2;
//   return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
// }

// // Revised Waist: Use hip width and depth from side data.
// function calculateFrontWaist(leftHip, rightHip, sidedata) {
//   if (!leftHip || !rightHip) return null;
  
//   const waistWidth = Math.abs(rightHip.position.x - leftHip.position.x);
//   const waistY = (leftHip.position.y + rightHip.position.y) / 2;
//   const waistDepth = analyzeSideData(waistY, sidedata);
  
//   const a = waistWidth / 2;
//   const b = waistDepth / 2;
//   return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
// }

// // Shoulder size remains a simple x-axis difference.
// function calculateShoulderSize(leftShoulder, rightShoulder) {
//   if (!leftShoulder || !rightShoulder) return null;
//   return Math.abs(rightShoulder.position.x - leftShoulder.position.x);
// }

// // Rough approximations for Thigh and Biceps circumferences using available keypoints and side data.
// function calculateThighCircumference(hip, knee, sidedata) {
//   if (!hip || !knee) return null;
//   const thighWidth = Math.abs(hip.position.x - knee.position.x);
//   const thighY = (hip.position.y + knee.position.y) / 2;
//   const thighDepth = analyzeSideData(thighY, sidedata);
  
//   const a = thighWidth / 2;
//   const b = thighDepth / 2;
//   return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
// }

// function calculateBicepsCircumference(shoulder, elbow, sidedata) {
//   if (!shoulder || !elbow) return null;
//   const bicepWidth = Math.abs(shoulder.position.x - elbow.position.x);
//   const bicepY = (shoulder.position.y + elbow.position.y) / 2;
//   const bicepDepth = analyzeSideData(bicepY, sidedata);
  
//   const a = bicepWidth / 2;
//   const b = bicepDepth / 2;
//   return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
// }

// // Main function: Now using the revised functions and applying the scale factor.
// const calculateBodyMeasurements = (frontData, sideData, personHeight) => {
//   const heights = [];
//   const armLengths = [];
//   const legLengths = [];
//   const torsoLengths = [];
//   const chestSizes = [];
//   const waistSizes = [];
//   const shoulderSizes = [];
//   const thighSizes = [];
//   const bicepsSizes = [];

//   frontData.forEach((front, side_index) => {
//     if (!front.allPoses || front.allPoses.length === 0) return;
    
//     const frontPose = front.allPoses[0];
//     const frontKeypoints = frontPose.keypoints;
//     const frontDataFrame = front.data;
//     const sidedata = sideData[side_index].data;

//     // Get keypoints; note that we now try to get the nose for better height estimation.
//     const nose = frontKeypoints.find(point => point.part === "nose");
//     const leftEye = frontKeypoints.find(point => point.part === "leftEye");
//     const rightEye = frontKeypoints.find(point => point.part === "rightEye");
//     const leftAnkle = frontKeypoints.find(point => point.part === "leftAnkle");
//     const rightAnkle = frontKeypoints.find(point => point.part === "rightAnkle");

//     const personPixelHeight = calculatePersonHeight(leftEye, rightEye, leftAnkle, rightAnkle, nose);
//     if (!personPixelHeight) return;
//     const scale = personHeight / personPixelHeight;

//     const armLength = calculateArmLength(
//       frontKeypoints.find(point => point.part === "leftShoulder"),
//       frontKeypoints.find(point => point.part === "leftElbow"),
//       frontKeypoints.find(point => point.part === "leftWrist"),
//       frontKeypoints.find(point => point.part === "rightShoulder"),
//       frontKeypoints.find(point => point.part === "rightElbow"),
//       frontKeypoints.find(point => point.part === "rightWrist")
//     );
//     const legLength = calculateLegLength(
//       frontKeypoints.find(point => point.part === "leftHip"),
//       frontKeypoints.find(point => point.part === "leftKnee"),
//       frontKeypoints.find(point => point.part === "leftAnkle"),
//       frontKeypoints.find(point => point.part === "rightHip"),
//       frontKeypoints.find(point => point.part === "rightKnee"),
//       frontKeypoints.find(point => point.part === "rightAnkle")
//     );
//     const torsoLength = calculateTorsoLength(
//       frontKeypoints.find(point => point.part === "leftShoulder"),
//       frontKeypoints.find(point => point.part === "rightShoulder"),
//       frontKeypoints.find(point => point.part === "leftHip"),
//       frontKeypoints.find(point => point.part === "rightHip")
//     );
//     const chestSize = calculateChest(
//       frontKeypoints.find(point => point.part === "leftShoulder"),
//       frontKeypoints.find(point => point.part === "rightShoulder"),
//       frontKeypoints.find(point => point.part === "leftHip"),
//       frontKeypoints.find(point => point.part === "rightHip"),
//       sidedata
//     );
//     const waistSize = calculateFrontWaist(
//       frontKeypoints.find(point => point.part === "leftHip"),
//       frontKeypoints.find(point => point.part === "rightHip"),
//       sidedata
//     );
//     const shoulderSize = calculateShoulderSize(
//       frontKeypoints.find(point => point.part === "leftShoulder"),
//       frontKeypoints.find(point => point.part === "rightShoulder")
//     );
//     const thighSize = calculateThighCircumference(
//       frontKeypoints.find(point => point.part === "leftHip"),
//       frontKeypoints.find(point => point.part === "leftKnee"),
//       sidedata
//     );
//     const bicepsSize = calculateBicepsCircumference(
//       frontKeypoints.find(point => point.part === "leftShoulder"),
//       frontKeypoints.find(point => point.part === "leftElbow"),
//       sidedata
//     );

//     // Multiply each measurement by the scale to convert pixels to cm.
//     heights.push(personHeight);
//     armLengths.push(armLength ? armLength * scale : null);
//     legLengths.push(legLength ? legLength * scale : null);
//     torsoLengths.push(torsoLength ? torsoLength * scale : null);
//     chestSizes.push(chestSize ? chestSize * scale : null);
//     waistSizes.push(waistSize ? waistSize * scale : null);
//     shoulderSizes.push(shoulderSize ? shoulderSize * scale : null);
//     thighSizes.push(thighSize ? thighSize * scale : null);
//     bicepsSizes.push(bicepsSize ? bicepsSize * scale : null);
//   });

//   // Compute averages (ignoring nulls)
//   return {
//     height: convertToTwoDecimalPlaces(calculateAverage(heights)),
//     arm_length: convertToTwoDecimalPlaces(calculateAverage(armLengths)),
//     leg_length: convertToTwoDecimalPlaces(calculateAverage(legLengths)),
//     torso_length: convertToTwoDecimalPlaces(calculateAverage(torsoLengths)),
//     chest: convertToTwoDecimalPlaces(calculateAverage(chestSizes)),
//     waist: convertToTwoDecimalPlaces(calculateAverage(waistSizes)),
//     shoulder_width: convertToTwoDecimalPlaces(calculateAverage(shoulderSizes)),
//     thigh_size: convertToTwoDecimalPlaces(calculateAverage(thighSizes)),
//     biceps_size: convertToTwoDecimalPlaces(calculateAverage(bicepsSizes)),
//     size_unit: 'cm',
//   };
// };

// function calculateAverage(arr) {
//   const valid = arr.filter(v => v !== null);
//   if (valid.length === 0) return 0;
//   const sum = valid.reduce((a, b) => a + b, 0);
//   return sum / valid.length;
// }

// function convertToTwoDecimalPlaces(value) {
//   if (typeof value === 'number') {
//     return value.toFixed(2);
//   }
//   return value;
// }

// export default calculateBodyMeasurements;
