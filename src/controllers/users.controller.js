import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "../services/users.service.js";

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

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();

    return res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);

    return res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 400;
    return res.status(status).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await updateUserService(id, { name, email, password, role });

    return res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 400;
    return res.status(status).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await deleteUserService(id);

    return res.status(200).json({
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 400;
    return res.status(status).json({
      message: error.message,
    });
  }
};