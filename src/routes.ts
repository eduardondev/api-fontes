import { Router } from "express";
import { Logger } from "./utils/Logger";
import { createUser, deleteUser } from "./controllers/users";
import {
  createProject,
  getProjectsByUser,
  getProjectByID,
  updateProject,
  checkDoneProject,
  deleteProject,
} from "./controllers/projects";

const router = Router();

router.use((req, res, next) => {
  Logger.info(`--> ${req.method} ${req.url} - Host ${req.hostname}`);
  next();
});

router.post("/users", createUser);
router.delete("/users", deleteUser);

router.post("/project", createProject);
router.get("/project/:id", getProjectByID);

router.post("/projects", getProjectsByUser);
router.put("/projects/:id", updateProject);
router.patch("/projects/:id/done", checkDoneProject);
router.delete("/projects/:id", deleteProject);

export default router;
