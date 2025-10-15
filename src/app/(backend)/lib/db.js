import mongoose from "mongoose";
const connectDatabase = async () => {
  try {
    if (!process.env.MONGOOURL) throw new Error("MONGOOURL not set in .env");

    await mongoose.connect(process.env.MONGOOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

export default connectDatabase;
