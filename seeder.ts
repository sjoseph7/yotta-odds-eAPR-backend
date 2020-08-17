/**
 * Seeder
 *
 * This file can Create and Delete documents in a database
 */

// Configure environment variables
require("dotenv").config();

import fs from "fs";
import mongoose from "mongoose";
import colors from "colors";
import { connectDB } from "./api/utils/db";
import { PrizeTable } from "./api/models/PrizeTable";

// import colors from "colors"

// Connect to Mongo Database
connectDB(process.env.MONGO_URI || "");

// Read data from JSON files
const prizeData = JSON.parse(
  fs.readFileSync(`${__dirname}/../_data/prize-data.json`, `utf-8`)
);

// Import data into database
const importData = async (options?: { exit: boolean }) => {
  try {
    await PrizeTable.create(prizeData);
    console.log("Data imported"); //.green)//.inverse);
    if (options && options.exit === false) {
      return;
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

// Delete data from database
const deleteData = async (options?: { exit: boolean }) => {
  try {
    await PrizeTable.deleteMany({});
    console.log("Data deleted"); //.red.inverse);
    if (options && options.exit === false) {
      return;
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

const resetData = async () => {
  try {
    await deleteData({ exit: false });
    await importData({ exit: false });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

if (process.argv[2] === "-i") {
  importData({ exit: true });
} else if (process.argv[2] === "-d") {
  deleteData({ exit: true });
} else if (process.argv[2] === "-r") {
  resetData();
} else {
  resetData();
  console.log("No flag set - resetting data");
}
