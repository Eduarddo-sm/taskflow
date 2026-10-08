import { db } from "../src/prisma/db.ts";

export async function createNewTask(
  columnId,
  title,
  responsibleId,
  description,
  priority,
  dueDate,
  userId,
) {
  const column = await db.orm.public.Column.select("boardId")
    .where({ columnId })
    .first();

  if (!column) {
    throw new Error("COLUMN_NOT_EXIST");
  }

  const member = await db.orm.public.BoardMember.select("permission")
    .where({ boardId: column.boardId, userId })
    .first();

  if (!member) {
    throw new Error("BOARD_ACCESS_DENIED");
  }

  if (member.permission === "VIEWER") {
    throw new Error("NOT_ALLOWED_EDIT");
  }

  const userResponsibleExist = await db.orm.public.User.where({
    userId: responsibleId,
  }).first();

  if (!userResponsibleExist) {
    throw new Error("RESPONSIBLE_TARGET_NOT_EXIST");
  }

  const userResponsible = await db.orm.public.BoardMember.where({
    boardId: column.boardId,
    userId: responsibleId,
  }).first();

  if (!userResponsible) {
    throw new Error("RESPONSIBLE_TARGET_NOT_EXIST_ON_BOARD");
  }

  const [day, month, year] = dueDate.split("/");
  const newDueDate = `${year}-${month}-${day}`;
  const lastPosition = await db.orm.public.Task.select("position")
    .where({ columnId })
    .orderBy((Task) => Task.position.desc())
    .first();

  const newPosition = Number(lastPosition ? lastPosition.position + 1 : 1);

  const task = await db.orm.public.Task.create({
    columnId,
    title,
    responsibleId,
    description,
    priority,
    position: newPosition,
    dueDate: newDueDate,
  });

  return task;
}

export async function updateTask(taskId, userId, tasksToUpdate) {
  const task = await db.orm.public.Task.select("columnId")
    .where({ taskId })
    .first();

  if (!task) {
    throw new Error("TASK_NOT_EXIST");
  }

  const column = await db.orm.public.Column.select("boardId")
    .where({ columnId: task.columnId })
    .first();

  if (!column) {
    throw new Error("COLUMN_NOT_EXIST");
  }

  const member = await db.orm.public.BoardMember.select("permission")
    .where({ boardId: column.boardId, userId })
    .first();

  if (!member) {
    throw new Error("BOARD_ACCESS_DENIED");
  }

  if (member.permission === "VIEWER") {
    throw new Error("NOT_ALLOWED_EDIT");
  }

  if (tasksToUpdate.responsibleId) {
    const responsibleExist = await db.orm.public.BoardMember.where({
      boardId: column.boardId,
      userId: tasksToUpdate.responsibleId,
    }).first();

    if (!responsibleExist) {
      throw new Error("RESPONSIBLE_USER_NOT_EXIST_ON_BOARD");
    }
  }

  const updatedTask = await db.orm.public.Task.where({ taskId }).updateAll(
    tasksToUpdate,
  );

  return updatedTask;
}

// Falta implementar o recalculo de posições
export async function removeTask(taskId, userId) {
  const task = await db.orm.public.Task.select("columnId")
    .where({ taskId })
    .first();

  if (!task) {
    throw new Error("TASK_NOT_EXIST");
  }

  const column = await db.orm.public.Column.select("boardId")
    .where({ columnId: task.columnId })
    .first();

  if (!column) {
    throw new Error("COLUMN_NOT_EXIST");
  }

  const member = await db.orm.public.BoardMember.select("permission")
    .where({ boardId: column.boardId, userId })
    .first();

  if (!member) {
    throw new Error("BOARD_ACCESS_DENIED");
  }

  if (member.permission === "VIEWER") {
    throw new Error("NOT_ALLOWED_EDIT");
  }

  const removedTask = await db.orm.public.Task.where({ taskId }).delete();

  await reorderTasksInColumn(task.columnId);

  return removedTask;
}

export async function reorderTasksInColumn(columnId) {
  const tasks = await db.orm.public.Task.where({ columnId })
    .orderBy((task) => task.position.asc())
    .all();

  return tasks;
}

export async function moveTaskById(taskId, userId, columnId, position) {
  return await db.transaction(async (tx) => {
    const task = await tx.orm.public.Task.where({ taskId }).first();

    if (!task) {
      throw new Error("TASK_NOT_EXIST");
    }

    const currentBoard = await tx.orm.public.Column.select("boardId")
      .where({ columnId: task.columnId })
      .first();

    if (!currentBoard) {
      throw new Error("BOARD_NOT_EXIST");
    }

    const member = await tx.orm.public.BoardMember.select("permission")
      .where({ boardId: currentBoard.boardId, userId })
      .first();

    if (!member) {
      throw new Error("USER_NOT_EXIST_IN_BOARD");
    }

    if (!["OWNER", "EDITOR"].includes(member.permission)) {
      throw new Error("USER_NOT_ALLOWED");
    }

    const destinationColumn = await tx.orm.public.Column.select(
      "boardId",
      "columnId",
    )
      .where({ columnId })
      .first();

    if (!destinationColumn) {
      throw new Error("DESTINATION_COLUMN_NOT_EXIST");
    }

    if (currentBoard.boardId !== destinationColumn.boardId) {
      throw new Error("BOARD_DIFFER");
    }

    if (task.columnId === destinationColumn.columnId) {
      const allTasks = await tx.orm.public.Task.where({
        columnId: task.columnId,
      })
        .orderBy((task) => task.position.asc())
        .all();

      const currentIndex = allTasks.findIndex((task) => task.taskId === taskId);

      if (currentIndex === -1) {
        throw new Error("TASK_NOT_EXIST");
      }

      //Remover da array o elemento, splice(inicio, quantidade) -> posição, um somente. O [0], pega esse elemento filtrado
      const movedTask = allTasks.splice(currentIndex, 1)[0];

      const newIndex = position - 1;

      if (newIndex < 0 || newIndex >= allTasks.length + 1) {
        throw new Error("INVALID_POSITION");
      }

      //Atribuir elemento novamente ao array com o novo invex
      // (newIndex = posição que acontencerá a mudança / 0 = elementos removidos / movedTask = o que será inserido)
      allTasks.splice(newIndex, 0, movedTask);

      for (let i = 0; i < allTasks.length; i++) {
        await tx.orm.public.Task.where({ taskId: allTasks[i].taskId }).update({
          position: i + 1,
        });

        console.log(`${allTasks[i].title}, ${allTasks[i].position}`);
      }

      movedTask.position = position;

      return movedTask;
    }

    if (task.columnId !== destinationColumn.columnId) {
      const oldColumnTasks = await tx.orm.public.Task.where({
        columnId: task.columnId,
      })
        .orderBy((task) => task.position.asc())
        .all();

      const oldColumnTaskIndex = oldColumnTasks.findIndex(
        (task) => task.taskId === taskId,
      );

      if (oldColumnTaskIndex === -1) {
        throw new Error("TASK_NOT_EXIST");
      }

      const taskToMove = oldColumnTasks.splice(oldColumnTaskIndex, 1)[0];

      for (let i = 0; i < oldColumnTasks.length; i++) {
        await tx.orm.public.Task.where({
          taskId: oldColumnTasks[i].taskId,
        }).update({ position: i + 1 });

      }

      const newColumnTasks = await tx.orm.public.Task.where({
        columnId: destinationColumn.columnId,
      })
        .orderBy((task) => task.position.asc())
        .all();

      const newIndex = position - 1;

      if (newIndex < 0 || newIndex > newColumnTasks.length) {
        throw new Error("INVALID_POSITION");
      }

      newColumnTasks.splice(newIndex, 0, taskToMove);

      await tx.orm.public.Task.where({ taskId }).update({
        columnId: destinationColumn.columnId,
      });

      for (let i = 0; i < newColumnTasks.length; i++) {
        await tx.orm.public.Task.where({
          taskId: newColumnTasks[i].taskId,
        }).update({ position: i + 1 });

        console.log(`${newColumnTasks[i].title}, ${newColumnTasks[i].position}`);
      }

      taskToMove.columnId = destinationColumn.columnId;
      taskToMove.position = position;

      return taskToMove;
    }
  });
}
