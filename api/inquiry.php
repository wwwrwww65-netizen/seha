<?php
require_once 'config.php';

// الاستعلام عن الإجازة باستخدام GET
$serviceCode = trim($_GET['serviceCode'] ?? '');
$idNumber = trim($_GET['idNumber'] ?? '');

if (!$serviceCode || !$idNumber) {
    jsonResponse(['status' => 'error', 'message' => 'يرجى إدخال رمز الخدمة ورقم الهوية'], 400);
}

$stmt = $conn->prepare("SELECT id, name, id_number as idNumber, report_date as reportDate, start_date as startDate, end_date as endDate, doctor, job, companion, relation FROM leaves WHERE id = ? AND id_number = ? LIMIT 1");
$stmt->execute([$serviceCode, $idNumber]);
$leave = $stmt->fetch(PDO::FETCH_ASSOC);

if ($leave) {
    jsonResponse([
        'status' => 'success',
        'data' => $leave
    ]);
} else {
    jsonResponse(['status' => 'not_found', 'message' => 'لا توجد بيانات مسجلة لهذا الطلب حالياً. يرجى التأكد من الرموز المدخلة.'], 404);
}
?>
