import mongoose from "mongoose";
import "dotenv/config";

export const initMongoConnection = async () => {
    try {
        const {MONGODB_USER} =process.env;
        const {MONGODB_PASSWORD} =process.env;
        const {MONGODB_URL} =process.env;
        const {MONGODB_DB} =process.env;

        await mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority&appName=1stCluster`)
    } catch (error) {
        console.log(error.message);
    }
}