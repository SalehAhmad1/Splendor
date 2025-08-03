"use client";
import React, { useState } from 'react';
import './App.css'; // Make sure to create this CSS file

function HeightInput({ onSubmit, getHeight }) {
    const [height, setHeight] = useState('');
    const [unit, setUnit] = useState('cm'); // Tracks the selected unit (cm or ft)
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        let heightInCm;
        if (unit === 'cm') {
            heightInCm = parseFloat(height);
        } else if (unit === 'ft') {
            // Convert feet and inches to centimeters
            heightInCm = (parseFloat(feet) * 30.48) + (parseFloat(inches) * 2.54);
        }
        console.log("Height in cm: ", heightInCm);
        onSubmit(heightInCm);
    };

    return (
        <form onSubmit={handleSubmit} className="modal-form">
            <div>
                <label className="form-title">Enter Height</label>
            </div>
            <div>
                <h2 className="height-form-guide-title">
                    If unsure of your height in cm, you can:
                </h2>
                <ul className="height-form-description">
                    {/* <li>Use Google to convert from feet/inches to cm.</li> */}
                    <li>Measure your height using a tape measure.</li>
                </ul>
                <h2 className="height-form-guide-title">For accurate results:</h2>
                <ul className="height-form-description">
                    <li>Minimize background noise, ensuring the frame is free of unnecessary furniture or objects.</li>
                    <li>Ensure good lighting in the room.</li>
                    <li>Only one person should be in the frame.</li>
                    <li>Position yourself so both your eyes and feet are fully visible in the frame.</li>
                </ul>
            </div>
            <div className="form">
                <div className="unit-selector">
                    <label>
                        <input
                            type="radio"
                            name="unit"
                            value="cm"
                            checked={unit === 'cm'}
                            onChange={() => setUnit('cm')}
                            />
                        <span> Centimeters</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="unit"
                            value="ft"
                            checked={unit === 'ft'}
                            onChange={() => setUnit('ft')}
                            />
                        <span> Feet/Inches</span>
                    </label>
                </div>

                {unit === 'cm' ? (
                    <input
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Enter height in centimeters"
                    className="form-input"
                    required
                    type="number"
                    />
                ) : (
                    <div className="feet-inches-inputs">
                        <input
                            value={feet}
                            onChange={(e) => setFeet(e.target.value)}
                            placeholder="Feet"
                            className="form-input"
                            required
                            type="number"
                            />
                        <input
                            value={inches}
                            onChange={(e) => setInches(e.target.value)}
                            placeholder="Inches"
                            className="form-input"
                            required
                            type="number"
                            />
                    </div>
                )}

                <div>
                    <button type="submit" className="height-button">Submit</button>
                </div>
                <label className='Note'>Place your device at a lower height so your entire body is visible.</label>
            </div>
        </form>
    );
}

export default HeightInput;
