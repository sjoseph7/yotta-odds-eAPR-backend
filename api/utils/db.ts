import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async (uri: string) => {
  let db = await mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    .catch(err => Promise.reject(err));

  console.info(
    colors.underline.cyan(`MongoDB connected: ${(db.connection as any).host}`)
  );
};
