import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'assets', 'mail', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'contact_messages.sqlite');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Ensure tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blog_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_slug TEXT NOT NULL DEFAULT 'ui-ux-designers',
    author TEXT NOT NULL,
    email TEXT NOT NULL,
    website TEXT,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export const serviceLabels = {
  braning: 'Branding Design',
  web: 'Web Design',
  uxui: 'UI/UX Design',
  app: 'App Design'
};

export function getServiceLabel(code) {
  return serviceLabels[code] || code || 'General Inquiry';
}

export function saveContactMessage({ firstName, lastName, email, phone, service, message }) {
  const stmt = db.prepare(`
    INSERT INTO contact_messages (first_name, last_name, email, phone, service, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    firstName.trim(),
    lastName ? lastName.trim() : null,
    email.trim(),
    phone ? phone.trim() : null,
    service ? service.trim() : null,
    message ? message.trim() : null
  );
  return result.lastInsertRowid;
}

export function getContactMessages({ q = '', from = '', to = '', page = 1, perPage = 10 } = {}) {
  const whereClauses = [];
  const params = [];

  if (q.trim()) {
    whereClauses.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR service LIKE ? OR message LIKE ?)');
    const term = `%${q.trim()}%`;
    params.push(term, term, term, term, term);
  }

  if (from.trim()) {
    whereClauses.push('DATE(created_at) >= ?');
    params.push(from.trim());
  }

  if (to.trim()) {
    whereClauses.push('DATE(created_at) <= ?');
    params.push(to.trim());
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Count total filtered
  const countStmt = db.prepare(`SELECT COUNT(*) as total FROM contact_messages ${whereSql}`);
  const totalCount = countStmt.get(...params).total;

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const offset = (currentPage - 1) * perPage;

  // List items
  const listStmt = db.prepare(`
    SELECT id, first_name, last_name, email, phone, service, message, created_at
    FROM contact_messages
    ${whereSql}
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `);
  const messages = listStmt.all(...params, perPage, offset);

  // Overall Stats
  const totalAll = db.prepare('SELECT COUNT(*) as c FROM contact_messages').get().c;
  const totalToday = db.prepare('SELECT COUNT(*) as c FROM contact_messages WHERE DATE(created_at) = DATE("now", "localtime")').get().c;
  
  const topServiceRow = db.prepare(`
    SELECT service, COUNT(*) as c 
    FROM contact_messages 
    WHERE service IS NOT NULL AND service != "" 
    GROUP BY service 
    ORDER BY c DESC, service ASC 
    LIMIT 1
  `).get();
  
  const topService = topServiceRow ? getServiceLabel(topServiceRow.service) : 'No data yet';

  // Breakdown by Service
  const serviceRows = db.prepare(`
    SELECT service, COUNT(*) as c 
    FROM contact_messages 
    WHERE service IS NOT NULL AND service != "" 
    GROUP BY service 
    ORDER BY c DESC, service ASC
  `).all();

  const serviceStats = serviceRows.map(row => ({
    label: getServiceLabel(row.service),
    count: row.c,
    percent: totalAll > 0 ? Math.max(6, Math.round((row.c / totalAll) * 100)) : 0
  }));

  return {
    messages,
    totalCount,
    totalPages,
    currentPage,
    stats: {
      all: totalAll,
      today: totalToday,
      top_service: topService
    },
    serviceStats
  };
}

export function deleteContactMessage(id) {
  const stmt = db.prepare('DELETE FROM contact_messages WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export function getAllContactMessagesForExport() {
  const stmt = db.prepare(`
    SELECT id, first_name, last_name, email, phone, service, message, created_at
    FROM contact_messages
    ORDER BY id DESC
  `);
  return stmt.all();
}

export function getBlogComments(postSlug) {
  const stmt = db.prepare(`
    SELECT id, author, email, website, comment, created_at
    FROM blog_comments
    WHERE post_slug = ?
    ORDER BY id DESC
  `);
  return stmt.all(postSlug);
}

export function addBlogComment({ postSlug, author, email, website, comment }) {
  const stmt = db.prepare(`
    INSERT INTO blog_comments (post_slug, author, email, website, comment)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    postSlug,
    author.trim(),
    email.trim(),
    website ? website.trim() : null,
    comment.trim()
  );
  return result.lastInsertRowid;
}

export function deleteBlogComment(id) {
  const stmt = db.prepare('DELETE FROM blog_comments WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export function commentInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  let initials = '';
  for (const part of parts) {
    if (part) {
      initials += part.charAt(0).toUpperCase();
    }
    if (initials.length >= 2) break;
  }
  return initials || 'U';
}
