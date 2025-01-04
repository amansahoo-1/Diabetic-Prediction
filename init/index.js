// const mongoose = require("mongoose");
// const initData = require("./data");
// const UserInfo = require("../models/user_info");

// const Mongo_Url = "mongodb://127.0.0.1:27017/swasth";
// async function main() {
//   mongoose.connect(Mongo_Url);
// }

// //call main func
// main()
//   .then(() => {
//     console.log("connected to Database");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// //create function for initialiizing sample data

// const InitDB = async () => {
//   //cleaning the past data
//   await UserInfo.deleteMany({});

//   //inserting new data for testing
//   await UserInfo.insertMany(initData.data);
//   console.log("Sample data was initialized");
// };

// //calling initDB function
// InitDB();
