import { createUserService } from "../services/users.service.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await createUserService({
      name,
      email,
      password,
      role,
    });

    return res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};