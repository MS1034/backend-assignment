import bcrypt from "bcrypt";

const roles = ["user", "admin"];

export async function hashPassword(password) {
    const saltRounds = 10;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw error;
    }
}

export async function comparePasswords(enteredPassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw error;
    }
}
