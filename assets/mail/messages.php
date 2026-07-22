<?php

declare(strict_types=1);

session_start();

require __DIR__ . DIRECTORY_SEPARATOR . 'db.php';

$config = mail_app_config();
$serviceLabels = [
    'braning' => 'Branding Design',
    'web' => 'Web Design',
    'uxui' => 'UI/UX Design',
    'app' => 'App Design',
];

function value_or_null(string $value): ?string
{
    $trimmed = trim($value);
    return $trimmed === '' ? null : $trimmed;
}

function filters(string $q, string $from, string $to): array
{
    $clauses = [];
    $params = [];

    if ($q !== '') {
        $clauses[] = '(first_name LIKE :term OR last_name LIKE :term OR email LIKE :term OR service LIKE :term OR message LIKE :term)';
        $params[':term'] = '%' . $q . '%';
    }
    if ($from !== '') {
        $clauses[] = 'DATE(created_at) >= :from_date';
        $params[':from_date'] = $from;
    }
    if ($to !== '') {
        $clauses[] = 'DATE(created_at) <= :to_date';
        $params[':to_date'] = $to;
    }

    return [$clauses === [] ? '' : ' WHERE ' . implode(' AND ', $clauses), $params];
}

function bind_all(PDOStatement $statement, array $params): void
{
    foreach ($params as $key => $value) {
        $statement->bindValue($key, $value, PDO::PARAM_STR);
    }
}

function export_messages(PDO $pdo, string $type): void
{
    $rows = $pdo->query(
        'SELECT id, first_name, last_name, email, phone, service, message, created_at
         FROM contact_messages
         ORDER BY id DESC'
    )->fetchAll(PDO::FETCH_ASSOC);

    if ($type === 'csv') {
        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="contact-messages.csv"');
        $out = fopen('php://output', 'wb');
        fputcsv($out, ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Service', 'Message', 'Created At']);
        foreach ($rows as $row) {
            fputcsv($out, $row);
        }
        fclose($out);
        exit;
    }

    if ($type === 'json') {
        header('Content-Type: application/json; charset=UTF-8');
        header('Content-Disposition: attachment; filename="contact-messages-backup.json"');
        echo json_encode([
            'exported_at' => date('c'),
            'storage' => 'mysql',
            'messages' => $rows,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if ($type === 'sql') {
        header('Content-Type: application/sql; charset=UTF-8');
        header('Content-Disposition: attachment; filename="contact-messages-backup.sql"');
        echo "CREATE TABLE IF NOT EXISTS `contact_messages` (\n";
        echo "  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,\n";
        echo "  `first_name` VARCHAR(100) NOT NULL,\n";
        echo "  `last_name` VARCHAR(100) NULL,\n";
        echo "  `email` VARCHAR(190) NOT NULL,\n";
        echo "  `phone` VARCHAR(50) NULL,\n";
        echo "  `service` VARCHAR(120) NULL,\n";
        echo "  `message` TEXT NULL,\n";
        echo "  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n";
        echo "  PRIMARY KEY (`id`)\n";
        echo ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";
        foreach ($rows as $row) {
            $values = [
                $row['id'],
                $pdo->quote((string) $row['first_name']),
                $row['last_name'] === null ? 'NULL' : $pdo->quote((string) $row['last_name']),
                $pdo->quote((string) $row['email']),
                $row['phone'] === null ? 'NULL' : $pdo->quote((string) $row['phone']),
                $row['service'] === null ? 'NULL' : $pdo->quote((string) $row['service']),
                $row['message'] === null ? 'NULL' : $pdo->quote((string) $row['message']),
                $pdo->quote((string) $row['created_at']),
            ];
            echo 'INSERT INTO `contact_messages` (`id`, `first_name`, `last_name`, `email`, `phone`, `service`, `message`, `created_at`) VALUES (' . implode(', ', $values) . ");\n";
        }
        exit;
    }
}

$q = trim((string) ($_GET['q'] ?? $_POST['q'] ?? ''));
$from = trim((string) ($_GET['from'] ?? $_POST['from'] ?? ''));
$to = trim((string) ($_GET['to'] ?? $_POST['to'] ?? ''));
$page = max(1, (int) ($_GET['page'] ?? $_POST['page'] ?? 1));
$perPage = 10;
$loginError = '';
$error = '';
$status = '';
$messages = [];
$stats = ['all' => 0, 'today' => 0, 'top_service' => 'No data yet'];
$serviceStats = [];
$isAuthenticated = isset($_SESSION['contact_messages_authenticated']) && $_SESSION['contact_messages_authenticated'] === true;

if (isset($_GET['logout'])) {
    $_SESSION = [];
    session_destroy();
    header('Location: messages.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['admin_password'])) {
    if (hash_equals((string) $config['admin_password'], (string) $_POST['admin_password'])) {
        $_SESSION['contact_messages_authenticated'] = true;
        header('Location: messages.php');
        exit;
    }
    $loginError = 'Invalid password.';
}

if (!$isAuthenticated) {
    ?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Login</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:Segoe UI,sans-serif;background:#120b22;color:#fff}.card{width:min(420px,calc(100% - 32px));padding:28px;border-radius:18px;background:#1b1134;border:1px solid #6f42ff}input,button{width:100%;padding:14px 16px;border-radius:12px}input{margin:12px 0;background:#0d0818;color:#fff;border:1px solid #6f42ff}button{border:0;background:linear-gradient(90deg,#6f42ff,#9d6bff);color:#fff;font-weight:700}.err{color:#ff8585}</style></head><body><main class="card"><h1>Admin Login</h1><p>Enter the password to view stored messages.</p><?php if ($loginError !== ''): ?><p class="err"><?= htmlspecialchars($loginError, ENT_QUOTES, 'UTF-8') ?></p><?php endif; ?><form method="post"><input type="password" name="admin_password" required><button type="submit">View Messages</button></form></main></body></html>
    <?php
    exit;
}

try {
    $pdo = mail_mysql_connection();

    if (isset($_GET['export'])) {
        export_messages($pdo, (string) $_GET['export']);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_message_id'])) {
        $delete = $pdo->prepare('DELETE FROM contact_messages WHERE id = :id');
        $delete->execute([':id' => (int) $_POST['delete_message_id']]);
        $query = ['status' => $delete->rowCount() > 0 ? 'deleted' : 'missing'];
        if ($q !== '') { $query['q'] = $q; }
        if ($from !== '') { $query['from'] = $from; }
        if ($to !== '') { $query['to'] = $to; }
        if ($page > 1) { $query['page'] = $page; }
        header('Location: messages.php?' . http_build_query($query));
        exit;
    }

    if (isset($_GET['status'])) {
        $status = $_GET['status'] === 'deleted' ? 'Message deleted.' : 'Message was already removed.';
    }

    $stats['all'] = (int) $pdo->query('SELECT COUNT(*) FROM contact_messages')->fetchColumn();
    $stats['today'] = (int) $pdo->query('SELECT COUNT(*) FROM contact_messages WHERE DATE(created_at)=CURDATE()')->fetchColumn();
    $top = $pdo->query('SELECT service, COUNT(*) c FROM contact_messages WHERE service IS NOT NULL AND service != "" GROUP BY service ORDER BY c DESC, service ASC LIMIT 1')->fetch(PDO::FETCH_ASSOC);
    if ($top !== false) {
        $stats['top_service'] = (string) ($serviceLabels[$top['service']] ?? $top['service']);
    }

    $serviceRows = $pdo->query('SELECT service, COUNT(*) c FROM contact_messages WHERE service IS NOT NULL AND service != "" GROUP BY service ORDER BY c DESC, service ASC')->fetchAll(PDO::FETCH_ASSOC);
    foreach ($serviceRows as $row) {
        $serviceStats[] = [
            'label' => (string) ($serviceLabels[$row['service']] ?? $row['service']),
            'count' => (int) $row['c'],
        ];
    }

    [$where, $params] = filters($q, $from, $to);
    $count = $pdo->prepare('SELECT COUNT(*) FROM contact_messages' . $where);
    bind_all($count, $params);
    $count->execute();
    $filteredCount = (int) $count->fetchColumn();
    $pages = max(1, (int) ceil($filteredCount / $perPage));
    $page = min($page, $pages);
    $offset = ($page - 1) * $perPage;

    $list = $pdo->prepare('SELECT id, first_name, last_name, email, phone, service, message, created_at FROM contact_messages' . $where . ' ORDER BY id DESC LIMIT :limit OFFSET :offset');
    bind_all($list, $params);
    $list->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $list->bindValue(':offset', $offset, PDO::PARAM_INT);
    $list->execute();
    $messages = $list->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $exception) {
    mail_log_failure('Failed to load MySQL messages page.', $exception);
    $error = 'Could not load messages from MySQL. Check contact-form-error.log.';
    $filteredCount = 0;
    $pages = 1;
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Contact Messages</title>
<style>
body{margin:0;font-family:Segoe UI,sans-serif;background:#120b22;color:#fff}
.page{width:min(1240px,calc(100% - 32px));margin:32px auto}
.header,.toolbar,.cards,.backups,.pager,.actions,.modal-head,.modal-foot{display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between}
.panel,.box{background:#1b1134;border:1px solid #6f42ff;border-radius:18px;box-shadow:0 18px 40px rgba(0,0,0,.2)}
.panel{overflow:hidden}.cards{margin:20px 0}.box{padding:18px;flex:1 1 220px}.muted{color:#b8addb}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 16px;border-radius:12px;text-decoration:none;border:0;cursor:pointer;font-weight:700;color:#fff;background:linear-gradient(90deg,#6f42ff,#9d6bff)}
.btn.alt{background:#26193f;border:1px solid #6f42ff}.btn.reply{background:linear-gradient(90deg,#2f6bff,#55a2ff)}.btn.view{background:linear-gradient(90deg,#4a36b8,#7f63ff)}.btn.danger{background:linear-gradient(90deg,#8b1e4b,#c13f6a)}.btn.small{min-height:36px;padding:0 12px}
.toolbar,.status,.pager{padding:18px}.status.ok{color:#8fffb0}.status.err{color:#ff8585}
input{min-height:42px;padding:0 12px;border-radius:12px;border:1px solid #6f42ff;background:#0d0818;color:#fff}.search{flex:1 1 260px}
table{width:100%;border-collapse:collapse;min-width:940px}th,td{padding:14px 16px;text-align:left;border-bottom:1px solid rgba(111,66,255,.2)}th{background:#2f1d59;font-size:12px;letter-spacing:.08em;text-transform:uppercase}.table-wrap{overflow:auto}
.chart{margin:20px 0;padding:18px}.row{display:grid;grid-template-columns:minmax(140px,220px) 1fr auto;gap:12px;align-items:center;margin-top:12px}.track{height:12px;border-radius:999px;background:#2a1947;overflow:hidden}.bar{height:100%;background:linear-gradient(90deg,#6f42ff,#a780ff)}
.preview{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;max-width:320px}.modal{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.7);padding:24px}.modal:target{display:flex}.modal-card{width:min(720px,100%);max-height:85vh;overflow:auto;background:#1b1134;border:1px solid #6f42ff;border-radius:18px}.modal-head,.modal-foot,.modal-body{padding:20px}.modal-head,.modal-foot{border-bottom:1px solid rgba(111,66,255,.2)}.modal-foot{border-top:1px solid rgba(111,66,255,.2);border-bottom:0}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.label{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#b8addb;margin:0 0 6px}.msg{white-space:pre-wrap}
@media (max-width:720px){.grid,.row{grid-template-columns:1fr}}
</style>
</head>
<body>
<main class="page">
    <div class="header">
        <div><h1>Contact Messages</h1><p class="muted">Stored submissions from the "Let's work together" form.</p></div>
        <a class="btn alt" href="messages.php?logout=1">Log Out</a>
    </div>

    <section class="cards">
        <div class="box"><div class="muted">Total Messages</div><h2><?= $stats['all'] ?></h2></div>
        <div class="box"><div class="muted">Messages Today</div><h2><?= $stats['today'] ?></h2></div>
        <div class="box"><div class="muted">Top Service</div><h2><?= htmlspecialchars($stats['top_service'], ENT_QUOTES, 'UTF-8') ?></h2></div>
    </section>

    <section class="box chart">
        <div class="header"><div><h2>Service Breakdown</h2><p class="muted">Counts across all MySQL messages.</p></div></div>
        <?php if ($serviceStats === []): ?>
            <p class="muted">No service data available yet.</p>
        <?php else: ?>
            <?php foreach ($serviceStats as $stat): ?>
                <?php $percent = $stats['all'] > 0 ? max(6, (int) round(($stat['count'] / $stats['all']) * 100)) : 0; ?>
                <div class="row">
                    <div><?= htmlspecialchars($stat['label'], ENT_QUOTES, 'UTF-8') ?></div>
                    <div class="track"><div class="bar" style="width: <?= $percent ?>%;"></div></div>
                    <div class="muted"><?= $stat['count'] ?></div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </section>

    <section class="box backups">
        <div><h2>Backup And Export</h2><p class="muted">Download the current MySQL data.</p></div>
        <div class="actions">
            <a class="btn" href="messages.php?export=csv">CSV Export</a>
            <a class="btn alt" href="messages.php?export=json">JSON Backup</a>
            <a class="btn alt" href="messages.php?export=sql">SQL Backup</a>
        </div>
    </section>

    <section class="panel" style="margin-top:20px">
        <div class="toolbar">
            <form class="toolbar" method="get" action="messages.php" style="padding:0;flex:1;justify-content:flex-start">
                <input class="search" type="search" name="q" value="<?= htmlspecialchars($q, ENT_QUOTES, 'UTF-8') ?>" placeholder="Search by name, email, service, or message">
                <input type="date" name="from" value="<?= htmlspecialchars($from, ENT_QUOTES, 'UTF-8') ?>">
                <input type="date" name="to" value="<?= htmlspecialchars($to, ENT_QUOTES, 'UTF-8') ?>">
                <button class="btn" type="submit">Search</button>
                <?php if ($q !== '' || $from !== '' || $to !== ''): ?><a class="btn alt" href="messages.php">Clear</a><?php endif; ?>
            </form>
        </div>
        <?php if ($status !== ''): ?><div class="status ok"><?= htmlspecialchars($status, ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?>
        <?php if ($error !== ''): ?><div class="status err"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div><?php else: ?>
            <div class="status"><?= $filteredCount ?> message<?= $filteredCount === 1 ? '' : 's' ?> found.</div>
            <div class="table-wrap">
                <table>
                    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Service</th><th>Message</th><th>Received</th><th>Actions</th></tr></thead>
                    <tbody>
                    <?php foreach ($messages as $message): ?>
                        <tr>
                            <td><?= (int) $message['id'] ?></td>
                            <td><?= htmlspecialchars(trim((string) $message['first_name'] . ' ' . (string) $message['last_name']), ENT_QUOTES, 'UTF-8') ?></td>
                            <td><?= htmlspecialchars((string) $message['email'], ENT_QUOTES, 'UTF-8') ?></td>
                            <td class="muted"><?= htmlspecialchars((string) $message['phone'], ENT_QUOTES, 'UTF-8') ?></td>
                            <td class="muted"><?= htmlspecialchars((string) ($serviceLabels[$message['service']] ?? $message['service']), ENT_QUOTES, 'UTF-8') ?></td>
                            <td><div class="preview"><?= htmlspecialchars((string) $message['message'], ENT_QUOTES, 'UTF-8') ?></div></td>
                            <td class="muted"><?= htmlspecialchars((string) $message['created_at'], ENT_QUOTES, 'UTF-8') ?></td>
                            <td>
                                <div class="actions">
                                    <a class="btn view small" href="#m<?= (int) $message['id'] ?>">View</a>
                                    <a class="btn reply small" href="mailto:<?= rawurlencode((string) $message['email']) ?>?subject=<?= rawurlencode('Re: Your contact form message') ?>">Reply</a>
                                    <form method="post" onsubmit="return confirm('Delete this message?');" style="margin:0">
                                        <input type="hidden" name="delete_message_id" value="<?= (int) $message['id'] ?>">
                                        <input type="hidden" name="q" value="<?= htmlspecialchars($q, ENT_QUOTES, 'UTF-8') ?>">
                                        <input type="hidden" name="from" value="<?= htmlspecialchars($from, ENT_QUOTES, 'UTF-8') ?>">
                                        <input type="hidden" name="to" value="<?= htmlspecialchars($to, ENT_QUOTES, 'UTF-8') ?>">
                                        <input type="hidden" name="page" value="<?= $page ?>">
                                        <button class="btn danger small" type="submit">Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <?php if ($pages > 1): ?>
                <div class="pager">
                    <div class="muted">Page <?= $page ?> of <?= $pages ?></div>
                    <div class="actions">
                        <?php $prev = ['q' => $q, 'from' => $from, 'to' => $to, 'page' => max(1, $page - 1)]; ?>
                        <?php $next = ['q' => $q, 'from' => $from, 'to' => $to, 'page' => min($pages, $page + 1)]; ?>
                        <?php if ($page > 1): ?><a class="btn alt" href="messages.php?<?= htmlspecialchars(http_build_query($prev), ENT_QUOTES, 'UTF-8') ?>">Previous</a><?php endif; ?>
                        <?php if ($page < $pages): ?><a class="btn alt" href="messages.php?<?= htmlspecialchars(http_build_query($next), ENT_QUOTES, 'UTF-8') ?>">Next</a><?php endif; ?>
                    </div>
                </div>
            <?php endif; ?>
        <?php endif; ?>
    </section>
</main>

<?php foreach ($messages as $message): ?>
    <div class="modal" id="m<?= (int) $message['id'] ?>">
        <div class="modal-card">
            <div class="modal-head">
                <h2>Message #<?= (int) $message['id'] ?></h2>
                <a class="btn alt small" href="#">x</a>
            </div>
            <div class="modal-body">
                <div class="grid">
                    <div><p class="label">Name</p><p><?= htmlspecialchars(trim((string) $message['first_name'] . ' ' . (string) $message['last_name']), ENT_QUOTES, 'UTF-8') ?></p></div>
                    <div><p class="label">Email</p><p><?= htmlspecialchars((string) $message['email'], ENT_QUOTES, 'UTF-8') ?></p></div>
                    <div><p class="label">Phone</p><p><?= htmlspecialchars((string) $message['phone'], ENT_QUOTES, 'UTF-8') ?></p></div>
                    <div><p class="label">Service</p><p><?= htmlspecialchars((string) ($serviceLabels[$message['service']] ?? $message['service']), ENT_QUOTES, 'UTF-8') ?></p></div>
                    <div><p class="label">Received</p><p><?= htmlspecialchars((string) $message['created_at'], ENT_QUOTES, 'UTF-8') ?></p></div>
                </div>
                <div style="margin-top:20px"><p class="label">Message</p><p class="msg"><?= htmlspecialchars((string) $message['message'], ENT_QUOTES, 'UTF-8') ?></p></div>
            </div>
            <div class="modal-foot">
                <a class="btn reply" href="mailto:<?= rawurlencode((string) $message['email']) ?>?subject=<?= rawurlencode('Re: Your contact form message') ?>">Reply</a>
                <a class="btn alt" href="#">Close</a>
            </div>
        </div>
    </div>
<?php endforeach; ?>
</body>
</html>
