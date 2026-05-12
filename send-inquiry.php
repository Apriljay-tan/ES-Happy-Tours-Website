<?php
declare(strict_types=1);

ini_set('display_errors', '0');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

const SMTP_HOST = 'smtp.hostinger.com';
const SMTP_PORT = 465;
const SMTP_USERNAME = 'info@eshappytours.com';
const SMTP_PASSWORD_PLACEHOLDER = 'YOUR_HOSTINGER_EMAIL_PASSWORD_HERE';
const SMTP_FROM_EMAIL = 'info@eshappytours.com';
const SMTP_FROM_NAME = 'ES Happy Tours Website';
const INQUIRY_TO_EMAIL = 'info@eshappytours.com';
const SUCCESS_MESSAGE = 'Thank you! Your inquiry has been sent. Our team will contact you within 24 hours.';
const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_SECONDS = 600;

function json_response(bool $success, string $message, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

function sanitize_text(string $value, int $maxLength): string
{
    $value = strip_tags($value);
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = preg_replace('/[^\P{C}\n\t]+/u', '', $value) ?? '';
    $value = trim($value);

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength, 'UTF-8');
    }

    return substr($value, 0, $maxLength);
}

function post_field(string $key, int $maxLength = 500): string
{
    $value = $_POST[$key] ?? '';
    if (is_array($value)) {
        return '';
    }

    return sanitize_text((string) $value, $maxLength);
}

function post_first_field(array $keys, int $maxLength = 500): string
{
    foreach ($keys as $key) {
        $value = post_field($key, $maxLength);
        if ($value !== '') {
            return $value;
        }
    }

    return '';
}

function clean_header_value(string $value): string
{
    return trim(preg_replace('/[\r\n]+/', ' ', $value) ?? '');
}

function clean_body_value(string $value): string
{
    return trim(str_replace(["\r\n", "\r"], "\n", $value));
}

function smtp_read($socket): string
{
    $response = '';

    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;

        if (strlen($line) >= 4 && $line[3] === ' ') {
            break;
        }
    }

    return $response;
}

function smtp_expect($socket, array $expectedCodes, string $context): string
{
    $response = smtp_read($socket);
    $code = (int) substr($response, 0, 3);

    if (!in_array($code, $expectedCodes, true)) {
        throw new RuntimeException("SMTP error during {$context}: {$response}");
    }

    return $response;
}

function smtp_command($socket, string $command, array $expectedCodes, string $context): void
{
    fwrite($socket, $command . "\r\n");
    smtp_expect($socket, $expectedCodes, $context);
}

function smtp_escape_data(string $message): string
{
    $message = str_replace(["\r\n", "\r"], "\n", $message);
    $message = str_replace("\n", "\r\n", $message);
    $message = preg_replace('/^\./m', '..', $message) ?? $message;

    return $message . "\r\n.\r\n";
}

function client_ip_address(): string
{
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    return filter_var($ipAddress, FILTER_VALIDATE_IP) ? $ipAddress : 'Unknown';
}

function enforce_rate_limit(string $ipAddress): void
{
    if ($ipAddress === 'Unknown') {
        return;
    }

    $rateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR)
        . DIRECTORY_SEPARATOR
        . 'esht_inquiry_rate_'
        . hash('sha256', $ipAddress)
        . '.json';

    $now = time();
    $attempts = [];

    if (is_file($rateFile)) {
        $raw = file_get_contents($rateFile);
        $decoded = is_string($raw) ? json_decode($raw, true) : null;
        if (is_array($decoded)) {
            $attempts = array_filter($decoded, static fn ($timestamp) => is_int($timestamp) && ($now - $timestamp) < RATE_LIMIT_WINDOW_SECONDS);
        }
    }

    if (count($attempts) >= MAX_REQUESTS_PER_WINDOW) {
        json_response(false, 'Too many inquiries were submitted recently. Please wait a few minutes and try again.', 429);
    }

    $attempts[] = $now;
    file_put_contents($rateFile, json_encode(array_values($attempts)), LOCK_EX);
}

function smtp_password(): string
{
    static $password = null;

    if ($password !== null) {
        return $password;
    }

    $configPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'private_config' . DIRECTORY_SEPARATOR . 'es-happy-mail.php';

    if (!is_file($configPath)) {
        $password = SMTP_PASSWORD_PLACEHOLDER;
        return $password;
    }

    $config = require $configPath;

    if (is_array($config)) {
        $loadedPassword = $config['smtp_password'] ?? '';
    } else {
        $loadedPassword = is_string($config) ? $config : '';
    }

    $password = is_string($loadedPassword) && trim($loadedPassword) !== ''
        ? trim($loadedPassword)
        : SMTP_PASSWORD_PLACEHOLDER;

    return $password;
}

function send_smtp_mail(string $to, string $replyTo, string $subject, string $body): void
{
    if (smtp_password() === SMTP_PASSWORD_PLACEHOLDER) {
        throw new InvalidArgumentException('SMTP password is not configured.');
    }

    $errorNumber = 0;
    $errorMessage = '';
    $socket = stream_socket_client(
        'ssl://' . SMTP_HOST . ':' . SMTP_PORT,
        $errorNumber,
        $errorMessage,
        20,
        STREAM_CLIENT_CONNECT
    );

    if ($socket === false) {
        throw new RuntimeException("Could not connect to SMTP server: {$errorMessage}");
    }

    stream_set_timeout($socket, 20);

    try {
        smtp_expect($socket, [220], 'connection');
        smtp_command($socket, 'EHLO eshappytours.com', [250], 'EHLO');
        smtp_command($socket, 'AUTH LOGIN', [334], 'AUTH LOGIN');
        smtp_command($socket, base64_encode(SMTP_USERNAME), [334], 'SMTP username');
        smtp_command($socket, base64_encode(smtp_password()), [235], 'SMTP password');
        smtp_command($socket, 'MAIL FROM:<' . SMTP_FROM_EMAIL . '>', [250], 'MAIL FROM');
        smtp_command($socket, 'RCPT TO:<' . $to . '>', [250, 251], 'RCPT TO');
        smtp_command($socket, 'DATA', [354], 'DATA');

        $fromName = clean_header_value(SMTP_FROM_NAME);
        $safeSubject = clean_header_value($subject);
        $safeReplyTo = clean_header_value($replyTo);

        $message = implode("\r\n", [
            'Date: ' . date(DATE_RFC2822),
            'From: ' . $fromName . ' <' . SMTP_FROM_EMAIL . '>',
            'To: ' . $to,
            'Reply-To: ' . $safeReplyTo,
            'Subject: ' . $safeSubject,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            'Message-ID: <' . bin2hex(random_bytes(16)) . '@eshappytours.com>',
            '',
            $body,
        ]);

        fwrite($socket, smtp_escape_data($message));
        smtp_expect($socket, [250], 'message send');
        smtp_command($socket, 'QUIT', [221, 250], 'QUIT');
    } finally {
        fclose($socket);
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'Only POST requests are allowed.', 405);
}

if (post_field('website') !== '') {
    json_response(true, SUCCESS_MESSAGE);
}

$ipAddress = client_ip_address();
enforce_rate_limit($ipAddress);

$name = clean_body_value(post_field('name', 120));
$email = clean_body_value(post_field('email', 180));
$phone = clean_body_value(post_field('phone', 60));
$persons = clean_body_value(post_field('persons', 3));
$tourType = clean_body_value(post_field('tour_type', 80));
$destination = clean_body_value(post_field('destination', 120));
$selectedPackage = clean_body_value(post_first_field(['selected_package', 'package'], 180));
$travelDate = clean_body_value(post_first_field(['travel_date', 'date'], 40));
$message = clean_body_value(post_field('message', 2000));
$pageUrl = clean_body_value(post_field('page_url', 500));
$referrer = clean_body_value(post_field('referrer', 500));
$submittedAt = clean_body_value(post_field('submitted_at', 80));

if ($name === '' || $phone === '' || $persons === '' || $tourType === '') {
    json_response(false, 'Please complete all required fields before submitting.', 422);
}

$personCount = filter_var($persons, FILTER_VALIDATE_INT, [
    'options' => [
        'min_range' => 1,
        'max_range' => 50,
    ],
]);

if ($personCount === false) {
    json_response(false, 'Please enter a valid number of persons from 1 to 50.', 422);
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(false, 'Please enter a valid email address or leave the email field blank.', 422);
}

$safeCustomerEmail = $email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)
    ? clean_header_value($email)
    : '';

$replyTo = $safeCustomerEmail !== ''
    ? $safeCustomerEmail
    : SMTP_FROM_EMAIL;

$subjectName = clean_header_value($name);
$subject = 'Travel inquiry from ' . ($subjectName !== '' ? $subjectName : 'ES Happy Tours website');

$emailBody = implode("\n", [
    'New ES Happy Tours inquiry',
    '',
    'Full Name: ' . $name,
    'Email: ' . ($email !== '' ? $email : 'Not provided'),
    'Phone / Viber: ' . $phone,
    'Number of Persons: ' . $personCount,
    'Tour Type: ' . $tourType,
    'Destination: ' . ($destination !== '' ? $destination : 'Not provided'),
    'Selected Package: ' . ($selectedPackage !== '' ? $selectedPackage : 'Not provided'),
    'Preferred Travel Date: ' . ($travelDate !== '' ? $travelDate : 'Not provided'),
    'Message:',
    $message !== '' ? $message : 'Not provided',
    '',
    'Page URL: ' . ($pageUrl !== '' ? $pageUrl : 'Not provided'),
    'Referrer: ' . ($referrer !== '' ? $referrer : 'Direct visit'),
    'Submitted At: ' . ($submittedAt !== '' ? $submittedAt : date('c')),
    'IP Address: ' . $ipAddress,
]);

try {
    send_smtp_mail(INQUIRY_TO_EMAIL, $replyTo, $subject, $emailBody);
    json_response(true, SUCCESS_MESSAGE);
} catch (InvalidArgumentException $exception) {
    json_response(false, 'SMTP password is not configured. Please contact the site administrator.', 500);
} catch (Throwable $exception) {
    error_log('ES Happy Tours inquiry SMTP error: ' . $exception->getMessage());
    json_response(false, 'Unable to send inquiry right now. Please check the SMTP settings and try again.', 500);
}
