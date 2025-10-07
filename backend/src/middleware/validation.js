
const validateName = (name) => {
    if (!name || name.length < 20 || name.length > 60) {
        return "Name must be between 20 and 60 characters.";
    }
    return null;
};

const validatePassword = (password) => {
    const passwordRegex = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/;
    if (!password || !passwordRegex.test(password)) {
        return "Password must be 8-16 characters, include one uppercase letter, and one special character.";
    }
    return null;
};

const validateAddress = (address) => {
    if (!address || address.length > 400) {
        return "Address cannot exceed 400 characters.";
    }
    return null;
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return "Must be a valid email format.";
    }
    return null;
};

const validateRating = (rating) => {
    const r = parseInt(rating);
    if (isNaN(r) || r < 1 || r > 5) {
        return "Rating must be an integer between 1 and 5.";
    }
    return null;
};


export const validateUser = (req, res, next) => {
    const { name, email, password, address } = req.body;
    let errors = {};

    if (validateName(name)) errors.name = validateName(name);
    if (validateEmail(email)) errors.email = validateEmail(email);
    if (validatePassword(password)) errors.password = validatePassword(password);
    if (validateAddress(address)) errors.address = validateAddress(address);

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
    }
    next();
};

export const validateStore = (req, res, next) => {
    const { name, email, address } = req.body;
    let errors = {};

    if (validateName(name)) errors.name = validateName(name);
    if (validateEmail(email)) errors.email = validateEmail(email);
    if (validateAddress(address)) errors.address = validateAddress(address);
    
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
    }
    next();
};

export const validateRatingInput = (req, res, next) => {
    const { rating } = req.body;
    const error = validateRating(rating);
    if (error) {
        return res.status(400).json({ message: "Validation failed", errors: { rating: error } });
    }
    next();
};

export const validateNewPassword = (req, res, next) => {
    const { newPassword } = req.body;
    const error = validatePassword(newPassword);
    if (error) {
        return res.status(400).json({ message: "Validation failed", errors: { newPassword: error } });
    }
    next();
};