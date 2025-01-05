import mongoose from "mongoose";

export default async function connectDb() {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL);
        console.log(`Database connected : ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to database : ${error.message}`);
        process.exit(1);
    }
}
