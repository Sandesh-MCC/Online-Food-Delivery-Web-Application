import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://sandeshmali:sandesh123@cluster2.q36dc.mongodb.net/project2"
    )
    .then(() => console.log("DB Connected"))
    .catch((err) => {
      console.log(`failed to connect db :- ${err}`);
    });
};
