<?php
// ملف تشخيص مؤقت - احذفه بعد الاستخدام فوراً
require_once 'config.php';

$testPassword = '777310';

// جلب كافة المستخدمين من قاعدة البيانات
$stmt = $conn->query("SELECT id, username, role, status, LEFT(password_hash, 30) as hash_preview FROM users");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

// تحديث كلمة مرور المدير مباشرة
$newHash = password_hash($testPassword, PASSWORD_BCRYPT, ['cost' => 10]);
$update = $conn->prepare("UPDATE users SET password_hash = ? WHERE id = 1");
$update->execute([$newHash]);

// التحقق من نجاح التحديث
$stmt2 = $conn->query("SELECT username, password_hash FROM users WHERE id = 1");
$user = $stmt2->fetch(PDO::FETCH_ASSOC);

$verifyResult = password_verify($testPassword, $user['password_hash']);

echo json_encode([
    'users_in_db' => $users,
    'password_update' => 'done',
    'verify_777310' => $verifyResult ? 'SUCCESS ✅' : 'FAILED ❌',
    'new_hash_sample' => substr($newHash, 0, 25) . '...',
    'IMPORTANT' => 'DELETE THIS FILE NOW!'
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
