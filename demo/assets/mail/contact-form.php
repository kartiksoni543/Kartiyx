<?php

declare(strict_types=1);

require __DIR__ . DIRECTORY_SEPARATOR . 'db.php';

header('Content-Type: application/json; charset=UTF-8');

function respond(int $statusCode, bool $success, string $message): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Invalid request method. Submit the form from the website.');
}

$firstName = trim((string) ($_POST['conName'] ?? ''));
$lastName = trim((string) ($_POST['conLName'] ?? ''));
$email = trim((string) ($_POST['conEmail'] ?? ''));
$phone = trim((string) ($_POST['conPhone'] ?? ''));
$service = trim((string) ($_POST['conService'] ?? ''));
$message = trim((string) ($_POST['conMessage'] ?? ''));

if ($firstName === '') {
    respond(422, false, 'First name is required.');
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'A valid email address is required.');
}

if ($service === '') {
    respond(422, false, 'Please choose a service.');
}

try {
    $pdo = mail_mysql_connection();

    $statement = $pdo->prepare(
        'INSERT INTO contact_messages (first_name, last_name, email, phone, service, message)
         VALUES (:first_name, :last_name, :email, :phone, :service, :message)'
    );

    $statement->execute([
        ':first_name' => $firstName,
        ':last_name' => $lastName !== '' ? $lastName : null,
        ':email' => $email,
        ':phone' => $phone !== '' ? $phone : null,
        ':service' => $service,
        ':message' => $message !== '' ? $message : null,
    ]);

    respond(200, true, 'Message stored successfully in MySQL.');
} catch (Throwable $exception) {
    mail_log_failure('Failed to store contact form submission in MySQL.', $exception);
    respond(500, false, 'The server could not store the message in MySQL. Check contact-form-error.log.');
}
