<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=UTF-8');

function json_response(bool $success, string $message, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'Invalid request method.', 405);
}

if (!empty($_POST['website'] ?? '')) {
    json_response(true, 'Thank you! Your inquiry has been sent.');
}

function field(string $key): string
{
    return trim((string)($_POST[$key] ?? ''));
}

function clean_header_value(string $value): string
{
    return str_replace(["\r", "\n"], '', $value);
}

$to = 'info@eshappytours.com';
$from = 'ES Happy Tours Website <info@eshappytours.com>';

$name = field('name');
$email = field('email');
$phone = field('phone');
$persons = field('persons');
$tourType = field('tour_type');
$destination = field('destination');
$package = field('package');
$date = field('date');
$message = field('message');
$pageUrl = field('page_url');
$referrer = field('referrer');
$submittedAt = field('submitted_at');
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

if ($name === '' || $phone === '' || $persons === '' || $tourType === '') {
    json_response(false, 'Please fill in your name, phone number, number of persons, and tour type.', 422);
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(false, 'Please enter a valid email address.', 422);
}

$safeName = clean_header_value($name);
$replyTo = $email !== '' ? clean_header_value($email) : 'info@eshappytours.com';
$subject = 'Travel inquiry from ' . $safeName;

$bodyLines = [
    'New inquiry from ES Happy Tours website',
    '',
    'Full Name: ' . $name,
    'Email: ' . ($email !== '' ? $email : 'Not provided'),
    'Phone / Viber: ' . $phone,
    'Number of Persons: ' . $persons,
    'Tour Type: ' . $tourType,
    'Destination: ' . ($destination !== '' ? $destination : 'Not specified'),
    'Selected Package: ' . ($package !== '' ? $package : 'Not selected'),
    'Preferred Travel Date: ' . ($date !== '' ? $date : 'Not specified'),
    '',
    'Message:',
    $message !== '' ? $message : 'No additional message.',
    '',
    'Submission Details:',
    'Page URL: ' . ($pageUrl !== '' ? $pageUrl : 'Not provided'),
    'Referrer: ' . ($referrer !== '' ? $referrer : 'Not provided'),
    'Submitted At: ' . ($submittedAt !== '' ? $submittedAt : gmdate('c')),
    'IP Address: ' . $ipAddress,
];

$headers = [
    'From: ' . $from,
    'Reply-To: ' . $replyTo,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail($to, $subject, implode("\n", $bodyLines), implode("\r\n", $headers));

if (!$sent) {
    json_response(false, 'Unable to send inquiry right now. Please try again later.', 500);
}

json_response(true, 'Thank you! Your inquiry has been sent. Our team will contact you within 24 hours.');
