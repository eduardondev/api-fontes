import { Router } from "express";
import { Logger } from "./utils/Logger";
import { getAll, createUser, deleteUser } from "./controllers/users";
import {
  createProject,
  getProjectsByUser,
  getProjectByID,
  updateProject,
  checkDoneProject,
  deleteProject,
} from "./controllers/projects";
import { login } from "./controllers/login";
import { isAuth } from "./middleware/auth";

const router = Router();

router.use((req, res, next) => {
  Logger.info(`--> ${req.method} ${req.url} - Host ${req.hostname}`);
  next();
});

router.get("/", (req, res) => {
  res.status(200);
  res.json({
    error: false,
    message: "Already is OK!",
  });
});

/* ---- LOGIN ---- */
router.post("/login", login);

/* ---- USERS ---- */
router.get("/users", isAuth, getAll);
router.post("/users", isAuth, createUser);
router.delete("/users/:id", isAuth, deleteUser);

/* ---- PROJECTS ---- */

router.post("/project", isAuth, createProject);
router.get("/project/:id", isAuth, getProjectByID);

router.get("/projects", isAuth, getProjectsByUser);
router.put("/projects/:id", isAuth, updateProject);
router.patch("/projects/:id/done", isAuth, checkDoneProject);
router.delete("/projects/:id", isAuth, deleteProject);

export default router;
