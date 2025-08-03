// Interface for Jeans Measurements
interface JeansMeasurements {
    waist: number;
    seat: number;
    knee: number;
    bottom: number;
    inseam: number;
}

// Interface for Jeans
interface Jeans {
    size: number;
    measurements: JeansMeasurements;
}

export const allJeans: Jeans[] = [
    { size: 30, measurements: { waist: 32, seat: 21, knee: 10.75, bottom: 8.25, inseam: 31 } },
    { size: 32, measurements: { waist: 34, seat: 22, knee: 11, bottom: 8.5, inseam: 31 } },
    { size: 34, measurements: { waist: 36, seat: 23, knee: 11.25, bottom: 8.75, inseam: 31 } },
    { size: 36, measurements: { waist: 38, seat: 24, knee: 11.5, bottom: 9, inseam: 31 } },
    { size: 38, measurements: { waist: 40, seat: 25, knee: 11.75, bottom: 9.25, inseam: 31 } },
];

// Interface for Shirt Measurements
interface ShirtMeasurements {
    chest: number;
    shoulderWidth: number;
    armLength: number;
    waist: number;
}

// Interface for Shirt
interface Shirt {
    size: number;
    measurements: ShirtMeasurements;
}

export const allShirts: Shirt[] = [
    { size: 40, measurements: { chest: 40, shoulderWidth: 18, armLength: 25, waist: 36 } },
    { size: 42, measurements: { chest: 42, shoulderWidth: 19, armLength: 26, waist: 38 } }
];

// Interface for Outerwear Measurements
interface OuterwearMeasurements {
    chest: number;
    shoulderWidth: number;
    armLength: number;
    torsoLength: number;
}

// Interface for Outerwear
interface Outerwear {
    size: number | string;
    measurements: OuterwearMeasurements;
}

export const allOuterwear: Outerwear[] = [
    { size: 'XS', measurements: { chest: 19.5, shoulderWidth: 7, armLength: 23, torsoLength: 28 } },
    { size: 'S', measurements: { chest: 20.5, shoulderWidth: 8, armLength: 24, torsoLength: 29 } },
    { size: 'M', measurements: { chest: 21.5, shoulderWidth: 8.5, armLength: 25, torsoLength: 30 } },
    { size: 'L', measurements: { chest: 22.5, shoulderWidth: 9, armLength: 26, torsoLength: 31 } },
    { size: 'XL', measurements: { chest: 23.5, shoulderWidth: 9.25, armLength: 27, torsoLength: 32 } }
];

// Interface for Casual Top Measurements
interface CasualTopMeasurements {
    chest: number;
    armLength: number;
    torsoLength: number;
}

// Interface for Casual Top
interface CasualTop {
    size: number | string;
    measurements: CasualTopMeasurements;
}

export const allCasualTops: CasualTop[] = [
    { size: 'XS', measurements: { chest: 18, armLength: 6.5, torsoLength: 27 } },
    { size: 'S', measurements: { chest: 19, armLength: 7, torsoLength: 28 } },
    { size: 'M', measurements: { chest: 20, armLength: 7.5, torsoLength: 29 } },
    { size: 'L', measurements: { chest: 21, armLength: 8, torsoLength: 29.5 } },
    { size: 'XL', measurements: { chest: 22, armLength: 8.5, torsoLength: 30 } }
];

// Interface for Trousers Measurements
interface TrousersMeasurements {
    waist: number;
    bottom: number;
    inseam: number;
}

// Interface for Trousers
interface Trousers {
    size: number | string;
    measurements: TrousersMeasurements;
}

export const allTrousers: Trousers[] = [
    { size: 'S', measurements: { waist: 28, bottom: 38, inseam: 27 } },
    { size: 'M', measurements: { waist: 29, bottom: 39, inseam: 28 } },
    { size: 'L', measurements: { waist: 30, bottom: 40, inseam: 29 } }
];

// Interface for Cape Shawl Measurements
interface CapeShawlMeasurements {
    shoulderWidth: number;
    torsoLength: number;
    chest: number;
}

// Interface for Cape Shawl
interface CapeShawl {
    size: number | string;
    measurements: CapeShawlMeasurements;
}

export const allCapeShawls: CapeShawl[] = [
    { size: 'S', measurements: { shoulderWidth: 14, torsoLength: 30, chest: 20 } },
    { size: 'M', measurements: { shoulderWidth: 14.5, torsoLength: 31, chest: 21 } },
    { size: 'L', measurements: { shoulderWidth: 15, torsoLength: 32, chest: 22 } }
];

// Interface for Cardigan Measurements
interface CardiganMeasurements {
    chest: number;
    shoulderWidth: number;
    armLength: number;
}

// Interface for Cardigan
interface Cardigan {
    size: number | string;
    measurements: CardiganMeasurements;
}

export const allCardigans: Cardigan[] = [
    { size: 'S', measurements: { chest: 40, shoulderWidth: 19, armLength: 26 } },
    { size: 'M', measurements: { chest: 42, shoulderWidth: 20, armLength: 27 } },
    { size: 'L', measurements: { chest: 42, shoulderWidth: 20, armLength: 27 } }
];

// Interface for Dress Measurements
interface DressMeasurements {
    chest: number;
    shoulderWidth: number;
    torsoLength: number;
}

// Interface for Dress
interface Dress {
    size: number | string;
    measurements: DressMeasurements;
}

export const allDresses: Dress[] = [
    { size: 'S', measurements: { chest: 20, shoulderWidth: 16, torsoLength: 40 } },
    { size: 'M', measurements: { chest: 21, shoulderWidth: 16.5, torsoLength: 41 } },
    { size: 'L', measurements: { chest: 22, shoulderWidth: 17, torsoLength: 42 } }
];
