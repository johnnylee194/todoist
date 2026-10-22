import { db } from '../database';

export const syncService = {
  pull: (userId: string, clientLastSync: number) => {
    const projects = db.prepare('SELECT * FROM projects WHERE user_id = ? AND updated_at > ?').all(userId, clientLastSync);
    const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ? AND updated_at > ?').all(userId, clientLastSync);
    const tags = db.prepare('SELECT * FROM tags WHERE user_id = ? AND updated_at > ?').all(userId, clientLastSync);
    const task_tags = db.prepare(`
      SELECT tt.* FROM task_tags tt
      JOIN tasks t ON tt.task_id = t.id
      WHERE t.user_id = ? AND tt.updated_at > ?
    `).all(userId, clientLastSync);

    return {
      projects,
      tasks,
      tags,
      task_tags,
      server_timestamp: Date.now(),
    };
  },

  push: (userId: string, payload: any) => {
    const transaction = db.transaction(() => {
      db.pragma('defer_foreign_keys = ON');

      // Process projects
      if (payload.projects && Array.isArray(payload.projects)) {
        const getProject = db.prepare('SELECT updated_at FROM projects WHERE id = ? AND user_id = ?');
        const insertProject = db.prepare('INSERT INTO projects (id, user_id, name, color, order_val, is_deleted, updated_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        const updateProject = db.prepare('UPDATE projects SET name = ?, color = ?, order_val = ?, is_deleted = ?, updated_at = ?, created_at = ? WHERE id = ? AND user_id = ?');

        for (const project of payload.projects) {
          if (project.user_id !== userId) continue;

          // Use INSERT OR REPLACE because if an attacker tries to insert with a victim's UUID,
          // but we scope getProject by user_id, they could theoretically insert a duplicate primary key.
          // In practice, since getProject restricts by userId, if another user's project exists, we won't see it,
          // but insertProject would fail on PK conflict. But we also shouldn't allow them to override it if we catch it.
          // A safer approach: Check if it exists globally. If it exists but belongs to someone else, reject it.

          const existingGlobal = db.prepare('SELECT user_id, updated_at FROM projects WHERE id = ?').get(project.id) as { user_id: string, updated_at: number } | undefined;

          if (existingGlobal) {
            if (existingGlobal.user_id !== userId) continue; // Belong to another user! IDOR protection.

            if (project.updated_at > existingGlobal.updated_at) {
              updateProject.run(project.name, project.color, project.order_val, project.is_deleted, project.updated_at, project.created_at, project.id, userId);
            }
          } else {
            insertProject.run(project.id, project.user_id, project.name, project.color, project.order_val, project.is_deleted, project.updated_at, project.created_at);
          }
        }
      }

      // Process tasks
      if (payload.tasks && Array.isArray(payload.tasks)) {
        const insertTask = db.prepare('INSERT INTO tasks (id, user_id, project_id, parent_id, content, description, priority, due_date, reminder_time, status, order_val, is_deleted, updated_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        const updateTask = db.prepare('UPDATE tasks SET project_id = ?, parent_id = ?, content = ?, description = ?, priority = ?, due_date = ?, reminder_time = ?, status = ?, order_val = ?, is_deleted = ?, updated_at = ?, created_at = ? WHERE id = ? AND user_id = ?');

        for (const task of payload.tasks) {
          if (task.user_id !== userId) continue;

          const existingGlobal = db.prepare('SELECT user_id, updated_at FROM tasks WHERE id = ?').get(task.id) as { user_id: string, updated_at: number } | undefined;

          if (existingGlobal) {
            if (existingGlobal.user_id !== userId) continue; // IDOR protection

            if (task.updated_at > existingGlobal.updated_at) {
              updateTask.run(task.project_id, task.parent_id, task.content, task.description, task.priority, task.due_date, task.reminder_time, task.status, task.order_val, task.is_deleted, task.updated_at, task.created_at, task.id, userId);
            }
          } else {
            insertTask.run(task.id, task.user_id, task.project_id, task.parent_id, task.content, task.description, task.priority, task.due_date, task.reminder_time, task.status, task.order_val, task.is_deleted, task.updated_at, task.created_at);
          }
        }
      }

      // Process tags
      if (payload.tags && Array.isArray(payload.tags)) {
        const insertTag = db.prepare('INSERT INTO tags (id, user_id, name, color, is_deleted, updated_at) VALUES (?, ?, ?, ?, ?, ?)');
        const updateTag = db.prepare('UPDATE tags SET name = ?, color = ?, is_deleted = ?, updated_at = ? WHERE id = ? AND user_id = ?');

        for (const tag of payload.tags) {
          if (tag.user_id !== userId) continue;

          const existingGlobal = db.prepare('SELECT user_id, updated_at FROM tags WHERE id = ?').get(tag.id) as { user_id: string, updated_at: number } | undefined;

          if (existingGlobal) {
            if (existingGlobal.user_id !== userId) continue; // IDOR protection

            if (tag.updated_at > existingGlobal.updated_at) {
              updateTag.run(tag.name, tag.color, tag.is_deleted, tag.updated_at, tag.id, userId);
            }
          } else {
            insertTag.run(tag.id, tag.user_id, tag.name, tag.color, tag.is_deleted, tag.updated_at);
          }
        }
      }

      // Process task_tags
      if (payload.task_tags && Array.isArray(payload.task_tags)) {
        const getTaskTag = db.prepare('SELECT updated_at FROM task_tags WHERE task_id = ? AND tag_id = ?');
        const insertTaskTag = db.prepare('INSERT INTO task_tags (task_id, tag_id, is_deleted, updated_at) VALUES (?, ?, ?, ?)');
        const updateTaskTag = db.prepare('UPDATE task_tags SET is_deleted = ?, updated_at = ? WHERE task_id = ? AND tag_id = ?');

        const checkTaskUser = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?');

        for (const taskTag of payload.task_tags) {
          const taskOwn = checkTaskUser.get(taskTag.task_id, userId);
          if (!taskOwn) continue; // Ignore if user does not own the task

          const existing = getTaskTag.get(taskTag.task_id, taskTag.tag_id) as { updated_at: number } | undefined;
          if (existing) {
            if (taskTag.updated_at > existing.updated_at) {
              updateTaskTag.run(taskTag.is_deleted, taskTag.updated_at, taskTag.task_id, taskTag.tag_id);
            }
          } else {
            insertTaskTag.run(taskTag.task_id, taskTag.tag_id, taskTag.is_deleted, taskTag.updated_at);
          }
        }
      }
    });

    transaction();
  }
};
