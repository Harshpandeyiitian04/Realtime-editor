const pool = require("../config/db");

const createDocument = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      "INSERT INTO documents (title, content, owner_id) VALUES ($1, $2, $3) RETURNING *",
      [title, "", userId],
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDocument = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const result = await pool.query(
    `
    SELECT * FROM documents 
    WHERE id = $1 AND (
      owner_id = $2 OR 
      id IN (
        SELECT document_id FROM document_permissions WHERE user_id = $2
      )
    )
    `,
    [id, userId],
  );

  if (result.rows.length === 0) {
    return res.status(403).json({ error: "Access denied" });
  }

  res.json(result.rows[0]);
};

const getUserDocuments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT d.*, 
        CASE 
          WHEN d.owner_id = $1 THEN 'owner'
          ELSE p.role
        END as role
      FROM documents d
      LEFT JOIN document_permissions p
      ON d.id = p.document_id AND p.user_id = $1
      WHERE d.owner_id = $1 OR p.user_id = $1
      ORDER BY d.created_at DESC
      `,
      [userId],
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      "UPDATE documents SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [content, id],
    );

    await pool.query(
      "INSERT INTO document_history (document_id, user_id, content) VALUES ($1, $2, $3)",
      [id, userId, content],
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTitle = async (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE documents SET title = $1 WHERE id = $2 RETURNING *",
      [title, id],
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const shareDocument = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { id } = req.params;

    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userResult.rows[0].id;

    await pool.query(
      "INSERT INTO document_permissions (document_id, user_id, role) VALUES ($1, $2, $3)",
      [id, userId, role],
    );

    res.json({ message: "Document shared successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM documents WHERE id = $1", [id]);

    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHistory = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT h.*, u.email 
     FROM document_history h
     JOIN users u ON h.user_id = u.id
     WHERE document_id = $1
     ORDER BY created_at DESC`,
    [id],
  );

  res.json(result.rows);
};

const addComment = async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;

  await pool.query(
    "INSERT INTO comments (document_id, user_id, text) VALUES ($1, $2, $3)",
    [id, req.user.userId, text],
  );

  res.json({ message: "Comment added" });
};

const getComments = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT c.*, u.email 
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE document_id = $1
     ORDER BY created_at DESC`,
    [id],
  );

  res.json(result.rows);
};

module.exports = {
  createDocument,
  getDocument,
  updateDocument,
  getUserDocuments,
  updateTitle,
  shareDocument,
  deleteDocument,
  getHistory,
  addComment,
  getComments,
};
