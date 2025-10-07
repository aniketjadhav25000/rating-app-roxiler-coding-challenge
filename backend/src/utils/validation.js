export const validateName = (name) => {
    if (!name || name.length < 20 || name.length > 60) {
        return "Name must be between 20 and 60 characters.";
    }
    return null;
};

export const validatePassword = (password) => {
    const passwordRegex = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/;
    if (!password || !passwordRegex.test(password)) {
        return "Password must be 8-16 characters, include one uppercase letter, and one special character.";
    }
    return null;
};

export const validateAddress = (address) => {
    if (!address || address.length > 400) {
        return "Address cannot exceed 400 characters.";
    }
    return null;
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return "Must be a valid email format.";
    }
    return null;
};

export const validateRating = (rating) => {
    const r = parseInt(rating);
    if (isNaN(r) || r < 1 || r > 5) {
        return "Rating must be an integer between 1 and 5.";
    }
    return null;
};