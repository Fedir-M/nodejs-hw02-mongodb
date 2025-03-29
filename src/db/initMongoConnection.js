import mongoose from "mongoose";
import {getEnvVar} from "../utils/getEnvVar.js";

export const initMongoConnection = async () => {
    try {
        const user = getEnvVar("MONGODB_USER");
        const password = getEnvVar("MONGODB_PASSWORD");
        const url = getEnvVar("MONGODB_URL");
        const nameDb = getEnvVar("MONGODB_DB");

        await mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${nameDb}?retryWrites=true&w=majority&appName=1stCluster`)
    } catch (error) {
        console.log(error.message);
    }
}