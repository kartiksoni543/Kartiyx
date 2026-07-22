<?php

declare(strict_types=1);

function mail_app_config(): array
{
    static $config = null;

    if ($config === null) {
        $config = require __DIR__ . DIRECTORY_SEPARATOR . 'config.php';
    }

    return $config;
}

function mail_log_path(): string
{
    return __DIR__ . DIRECTORY_SEPARATOR . 'contact-form-error.log';
}

function mail_log_failure(string $message, ?Throwable $exception = null): void
{
    $details = '[' . date('Y-m-d H:i:s') . '] ' . $message;

    if ($exception !== null) {
        $details .= ' | ' . $exception->getMessage();
    }

    $details .= PHP_EOL;
    error_log($details, 3, mail_log_path());
}

function mail_mysql_connection(): PDO
{
    $config = mail_app_config();
    $mysql = $config['mysql'] ?? [];

    $host = (string) ($mysql['host'] ?? '127.0.0.1');
    $port = (int) ($mysql['port'] ?? 3306);
    $database = (string) ($mysql['database'] ?? 'gerold_portfolio');
    $username = (string) ($mysql['username'] ?? 'root');
    $password = (string) ($mysql['password'] ?? '');
    $charset = (string) ($mysql['charset'] ?? 'utf8mb4');

    $serverDsn = sprintf('mysql:host=%s;port=%d;charset=%s', $host, $port, $charset);
    $pdo = new PDO($serverDsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $pdo->exec('CREATE DATABASE IF NOT EXISTS `' . str_replace('`', '``', $database) . '` CHARACTER SET ' . $charset . ' COLLATE ' . $charset . '_unicode_ci');
    $pdo->exec('USE `' . str_replace('`', '``', $database) . '`');

    mail_ensure_contact_messages_table($pdo);
    mail_ensure_blog_comments_table($pdo);
    mail_migrate_sqlite_if_needed($pdo);

    return $pdo;
}

function mail_ensure_contact_messages_table(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS contact_messages (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NULL,
            email VARCHAR(190) NOT NULL,
            phone VARCHAR(50) NULL,
            service VARCHAR(120) NULL,
            message TEXT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
}

function mail_migrate_sqlite_if_needed(PDO $pdo): void
{
    $mysqlCount = (int) $pdo->query('SELECT COUNT(*) FROM contact_messages')->fetchColumn();

    if ($mysqlCount > 0) {
        return;
    }

    $sqlitePath = __DIR__ . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'contact_messages.sqlite';

    if (!is_file($sqlitePath)) {
        return;
    }

    try {
        $sqlite = new PDO('sqlite:' . $sqlitePath);
        $sqlite->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $rows = $sqlite->query(
            'SELECT first_name, last_name, email, phone, service, message, created_at
             FROM contact_messages
             ORDER BY id ASC'
        )->fetchAll(PDO::FETCH_ASSOC);

        if ($rows === []) {
            return;
        }

        $insert = $pdo->prepare(
            'INSERT INTO contact_messages (first_name, last_name, email, phone, service, message, created_at)
             VALUES (:first_name, :last_name, :email, :phone, :service, :message, :created_at)'
        );

        foreach ($rows as $row) {
            $insert->execute([
                ':first_name' => $row['first_name'],
                ':last_name' => $row['last_name'] !== '' ? $row['last_name'] : null,
                ':email' => $row['email'],
                ':phone' => $row['phone'] !== '' ? $row['phone'] : null,
                ':service' => $row['service'] !== '' ? $row['service'] : null,
                ':message' => $row['message'] !== '' ? $row['message'] : null,
                ':created_at' => $row['created_at'] !== '' ? $row['created_at'] : date('Y-m-d H:i:s'),
            ]);
        }
    } catch (Throwable $exception) {
        mail_log_failure('SQLite to MySQL migration failed.', $exception);
    }
}

function mail_ensure_blog_comments_table(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS blog_comments (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            post_slug VARCHAR(120) NOT NULL DEFAULT "ui-ux-designers",
            author VARCHAR(100) NOT NULL,
            email VARCHAR(190) NOT NULL,
            website VARCHAR(190) NULL,
            comment TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $columnCheck = $pdo->query("SHOW COLUMNS FROM blog_comments LIKE 'post_slug'")->fetch(PDO::FETCH_ASSOC);
    if ($columnCheck === false) {
        $pdo->exec('ALTER TABLE blog_comments ADD COLUMN post_slug VARCHAR(120) NOT NULL DEFAULT "ui-ux-designers" AFTER id');
    }
}
