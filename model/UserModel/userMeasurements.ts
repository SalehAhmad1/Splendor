interface UserMeasurements {
    height: number,
    arm_length: number,
    leg_length: number,
    navel_length: number,
    waist: number,
    shoulder_width: number,
    torso_length: number,
    thai_size: number,
    bicaeps_size: number,
    chest: number,
    size_unit: string,
}

const User: UserMeasurements = {
    height: 0,
    arm_length: 0,
    leg_length: 0,
    navel_length: 0,
    waist: 0,
    shoulder_width: 0,
    torso_length: 0,
    thai_size: 0,
    bicaeps_size: 0,
    chest: 0,
    size_unit: '',
};  // The user is initially empty

// Method to check if User model is initialized
export const isUserInitialized = (): boolean => {
    return User.height !== 0 && User.chest !== 0 && User.shoulder_width !== 0 && User.arm_length !== 0 && User.leg_length !== 0 && User.waist !== 0 && User.navel_length !== 0 && User.torso_length !== 0;
};

export default User;