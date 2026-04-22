<?php
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => true,   // HTTPS only
    'httponly' => true, // Not accessible via JS
    'samesite' => 'Strict'
]);
session_start();

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Content-Type: application/json; charset=utf-8');

// ====== إعدادات قاعدة البيانات ======
// هذه البيانات مرتبطة الآن بقاعدة بياناتك الحيّة في هوستنجر
$host = "localhost";
$db_name = "u505648754_Seha";
$username = "u505648754_Hash123";
$password = "hhaahh2022H";

try {
    $conn = new PDO("mysql:host={$host};dbname={$db_name};charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false); // True prepared statements
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "فشل الاتصال بقاعدة البيانات"]);
    exit;
}

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

function requireAuth() {
    if(!isset($_SESSION['user_id'])) {
        jsonResponse(['status' => 'error', 'message' => 'غير مصرح لك بالوصول'], 401);
    }
}

function hasPermission($perm) {
    return isset($_SESSION['permissions']) && $_SESSION['permissions'][$perm] == 1;
}

function requirePermission($perm) {
    requireAuth();
    if (!hasPermission($perm)) {
        jsonResponse(['status' => 'error', 'message' => 'ليس لديك صلاحية ' . $perm], 403);
    }
}
?>
