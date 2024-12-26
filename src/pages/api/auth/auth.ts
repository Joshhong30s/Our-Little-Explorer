// import type { NextApiRequest, NextApiResponse } from "next";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import dbConnect from "../../../utils/dbConnect";
// import { UserModel } from "../../../types/users";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   await dbConnect();

//   if (req.method === "POST") {
//     const { action } = req.query;

//     if (action === "register") {
//       const { username, password } = req.body;
//       const user = await UserModel.findOne({ username });

//       if (user) {
//         return res.status(409).json({ message: "User already exists" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new UserModel({ username, password: hashedPassword });
//       await newUser.save();

//       return res.status(200).json({ message: "Successfully registered!" });
//     }

//     if (action === "login") {
//       const { username, password } = req.body;
//       const user = await UserModel.findOne({ username });
//       console.log("user", user);
//       console.log("username", username);
//       console.log("password", password);
//       if (!user) {
//         return res.status(401).json({ message: "User does not exist" });
//       }

//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: "Wrong password!" });
//       }

//       const token = jwt.sign(
//         { id: user._id },
//         process.env.JWT_SECRET || "secret"
//       );
//       return res.status(200).json({ token, userID: user._id });
//     }
//   }

//   return res.status(405).json({ message: "Method not allowed" });
// }
