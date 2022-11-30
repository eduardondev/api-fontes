import { Request, Response } from "express";
import { responseAPI } from "../../utils/ResponseAPI";
import { prisma } from "../../data/index";
import dayjs from "dayjs";
import axios from "axios";

export async function createProject(req: Request, res: Response) {
  try {
    let { title, zip_code, deadline, cost } = req.body;
    const username = req.header("username");

    if (!username) {
      res.status(400);
      return res.json(responseAPI(true, "Username not sent."));
    }

    if (!title || !zip_code || !deadline || !cost) {
      res.status(400);
      return res.json(responseAPI(true, "Required data not sent."));
    }

    const verifyUserAlreadyExists = await prisma.users.findFirst({
      where: {
        username,
      },
    });

    if (!verifyUserAlreadyExists) {
      res.status(404);
      return res.json(responseAPI(true, "Username not exists.", username));
    }

    const verifyProjectAlreadyExists = await prisma.projects.findFirst({
      where: {
        title,
        username,
      },
    });

    if (verifyProjectAlreadyExists) {
      res.status(400);
      return res.json(
        responseAPI(
          true,
          "Project with this name and username already exists.",
          title
        )
      );
    }

    deadline = dayjs(deadline).toDate();

    const create = await prisma.projects.create({
      data: {
        title,
        cost,
        deadline,
        zip_code,
        username,
        done: false,
      },
    });

    return res.json(responseAPI(false, "Project has been created.", create));
  } catch (err) {
    console.log(err);
  }
}

export async function getProjectsByUser(req: Request, res: Response) {
  try {
    const username = req.header("username");

    if (!username) {
      res.status(400);
      return res.json(responseAPI(true, "Username not sent."));
    }

    const verifyUserAlreadyExists = await prisma.users.findFirst({
      where: {
        username,
      },
    });

    if (!verifyUserAlreadyExists) {
      res.status(404);
      return res.json(responseAPI(true, "Username not exists.", username));
    }

    const projects = await prisma.projects.findMany({
      where: {
        username,
      },
    });

    if (!projects.length) {
      res.status(404);
      return res.json(
        responseAPI(true, "No projects found with this username.")
      );
    }

    res.status(200);
    return res.json(responseAPI(false, "Projects found.", projects));
  } catch (err) {
    console.log(err);
  }
}

export async function getProjectByID(req: Request, res: Response) {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400);
      return res.json(responseAPI(true, "Project ID not sent."));
    }

    const project = await prisma.projects.findFirst({
      where: {
        id,
      },
    });

    if (!project) {
      res.status(404);
      return res.json(responseAPI(true, "Project not found", id));
    }

    const findCityState = await axios.get(
      `https://viacep.com.br/ws/${project.zip_code}/json/`
    );

    if (findCityState.data.erro) {
      res.status(404);
      return res.json(
        responseAPI(true, "Zip code is invalid. Please update.", project)
      );
    }

    res.status(200);
    return res.json(
      responseAPI(false, "Project found.", {
        ...project,
        city: findCityState.data.localidade,
        state: findCityState.data.uf,
      })
    );
  } catch (err) {
    console.log(err);
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const id = req.params.id;
    let { title, zip_code, deadline, cost } = req.body;
    const username = req.header("username");

    if (!username) {
      res.status(400);
      return res.json(responseAPI(true, "Username not sent."));
    }

    if (!title || !zip_code || !deadline || !cost) {
      res.status(400);
      return res.json(responseAPI(true, "Required data not sent."));
    }

    const verifyProjectAlreadyExists = await prisma.projects.findFirst({
      where: {
        id,
        username,
      },
    });

    if (!verifyProjectAlreadyExists) {
      res.status(400);
      return res.json(
        responseAPI(
          true,
          "Not found a project with this id and username.",
          username
        )
      );
    }

    deadline = dayjs(deadline).toDate();
    const updated_at = dayjs().toDate();

    const update = await prisma.projects.update({
      data: {
        title,
        cost,
        deadline,
        zip_code,
        updated_at,
      },
      where: {
        id,
      },
    });

    return res.json(responseAPI(false, "Project has been updated.", update));
  } catch (err) {
    console.log(err);
  }
}

export async function checkDoneProject(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const username = req.header("username");

    if (!username) {
      res.status(400);
      return res.json(responseAPI(true, "Username not sent."));
    }

    const verifyProjectAlreadyExists = await prisma.projects.findFirst({
      where: {
        id,
        username,
      },
    });

    if (!verifyProjectAlreadyExists) {
      res.status(400);
      return res.json(
        responseAPI(
          true,
          "Not found a project with this id and username.",
          username
        )
      );
    }

    const updated_at = dayjs().toDate();

    const update = await prisma.projects.update({
      data: {
        done: true,
        updated_at,
      },
      where: {
        id,
      },
    });

    return res.json(
      responseAPI(false, "Project has been updated to done.", update)
    );
  } catch (err) {
    console.log(err);
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const username = req.header("username");

    if (!username) {
      res.status(400);
      return res.json(responseAPI(true, "Username not sent."));
    }

    const verifyProjectAlreadyExists = await prisma.projects.findFirst({
      where: {
        id,
        username,
      },
    });

    if (!verifyProjectAlreadyExists) {
      res.status(400);
      return res.json(
        responseAPI(
          true,
          "Not found a project with this id and username.",
          username
        )
      );
    }

    const deleteProject = await prisma.projects.delete({
      where: {
        id,
      },
    });

    return res.json(
      responseAPI(false, "Project has been deleted.", deleteProject)
    );
  } catch (err) {
    console.log(err);
  }
}
