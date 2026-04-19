<?php
// ============================================
// ملف مؤقت لإعادة تعيين كلمة مرور المدير
// احذف هذا الملف فور استخدامه!
// ============================================

require_once 'config.php';

$newPassword = '777310';
$newHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);

$stmt = $conn->prepare("UPDATE users SET password_hash = ? WHERE username = 'u@seha-sa.life'");
$stmt->execute([$newHash]);

if ($stmt->rowCount() > 0) {
    echo json_encode([
        'status' => 'success',
        'message' => 'تم تحديث كلمة المرور بنجاح! احذف هذا الملف الآن من api/reset-pass.php',
        'hash_preview' => substr($newHash, 0, 20) . '...'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'لم يتم العثور على المستخدم أو حدث خطأ'
    ]);
}
?>
