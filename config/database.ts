import mongoose from "mongoose";

const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log("Connect Success");
    } catch (error) {
        console.error("Connect Error", error);
    }
};

export default {connect};