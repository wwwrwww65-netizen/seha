<?php
require_once 'config.php';
requireAuth();

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($action === 'list' && $method === 'GET') {
    $stmt = $conn->query("SELECT id, name, id_number as idNumber, type, report_date as reportDate, start_date as startDate, end_date as endDate, doctor, job, companion, relation FROM leaves ORDER BY created_at DESC");
    jsonResponse(['status' => 'success', 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}
elseif ($action === 'add' && $method === 'POST') {
    requirePermission('add_leave');
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Generate ID if missing
    $id = empty($data['id']) ? 'LV-' . rand(100000, 999999) : trim($data['id']);
    
    $stmt = $conn->prepare("INSERT INTO leaves (id, name, full_name, id_number, type, report_date, start_date, end_date, doctor, job, companion, relation, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    try {
        $stmt->execute([
            $id,
            $data['name'] ?? '',
            $data['fullName'] ?? '',
            $data['idNumber'] ?? '',
            $data['type'] ?? 'government',
            $data['reportDate'] ?? null,
            $data['startDate'] ?? null,
            $data['endDate'] ?? null,
            $data['doctor'] ?? '',
            $data['job'] ?? '',
            $data['companion'] ?? '',
            $data['relation'] ?? '',
            $_SESSION['user_id']
        ]);
        jsonResponse(['status' => 'success', 'id' => $id]);
    } catch (PDOException $e) {
        $errorMsg = $e->getMessage();
        // Check for duplicate entry
        if (strpos($errorMsg, 'Duplicate entry') !== false || strpos($errorMsg, '1062') !== false) {
            jsonResponse(['status' => 'error', 'message' => 'عذراً، هذا المعرف موجود مسبقاً. يرجى استخدام معرف آخر أو تركه فارغاً للتوليد التلقائي'], 400);
        } else {
            jsonResponse(['status' => 'error', 'message' => 'خطأ في قاعدة البيانات: ' . $errorMsg], 500);
        }
    }
}
elseif ($action === 'edit' && $method === 'POST') {
    requirePermission('edit_leave');
    $data = json_decode(file_get_contents('php://input'), true);
    $oldId = trim($data['oldId'] ?? '');
    $newId = trim($data['id'] ?? '');

    // التحقق من وجود الـ ID القديم
    $checkStmt = $conn->prepare("SELECT id FROM leaves WHERE id = ?");
    $checkStmt->execute([$oldId]);
    if (!$checkStmt->fetch()) {
        jsonResponse(['status' => 'error', 'message' => 'الإجازة غير موجودة'], 404);
    }

    // إذا تغير الـ ID، نتحقق من عدم وجود الـ ID الجديد مسبقاً
    if ($oldId !== $newId) {
        $duplicateCheck = $conn->prepare("SELECT id FROM leaves WHERE id = ?");
        $duplicateCheck->execute([$newId]);
        if ($duplicateCheck->fetch()) {
            jsonResponse(['status' => 'error', 'message' => 'عذراً، رقم الإجازة هذا موجود مسبقاً. يرجى استخدام رقم آخر'], 400);
        }

        // تحديث الـ ID وجميع الحقول الأخرى
        $stmt = $conn->prepare("UPDATE leaves SET id=?, name=?, full_name=?, id_number=?, type=?, report_date=?, start_date=?, end_date=?, doctor=?, job=?, companion=?, relation=? WHERE id=?");
        $stmt->execute([
            $newId,
            $data['name'] ?? '',
            $data['fullName'] ?? '',
            $data['idNumber'] ?? '',
            $data['type'] ?? 'government',
            $data['reportDate'] ?? null,
            $data['startDate'] ?? null,
            $data['endDate'] ?? null,
            $data['doctor'] ?? '',
            $data['job'] ?? '',
            $data['companion'] ?? '',
            $data['relation'] ?? '',
            $oldId
        ]);
    } else {
        // إذا لم يتغير الـ ID، تحديث باقي الحقول فقط
        $stmt = $conn->prepare("UPDATE leaves SET name=?, full_name=?, id_number=?, type=?, report_date=?, start_date=?, end_date=?, doctor=?, job=?, companion=?, relation=? WHERE id=?");
        $stmt->execute([
            $data['name'] ?? '',
            $data['fullName'] ?? '',
            $data['idNumber'] ?? '',
            $data['type'] ?? 'government',
            $data['reportDate'] ?? null,
            $data['startDate'] ?? null,
            $data['endDate'] ?? null,
            $data['doctor'] ?? '',
            $data['job'] ?? '',
            $data['companion'] ?? '',
            $data['relation'] ?? '',
            $oldId
        ]);
    }
    jsonResponse(['status' => 'success']);
}
elseif ($action === 'delete' && $method === 'POST') {
    requirePermission('delete_leave');
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? '';
    
    $stmt = $conn->prepare("DELETE FROM leaves WHERE id = ?");
    $stmt->execute([$id]);
    jsonResponse(['status' => 'success']);
}
elseif ($action === 'delete_multiple' && $method === 'POST') {
    requirePermission('delete_leave');
    $data = json_decode(file_get_contents('php://input'), true);
    $ids = $data['ids'] ?? [];
    
    if (empty($ids)) jsonResponse(['status' => 'success']);
    
    $in  = str_repeat('?,', count($ids) - 1) . '?';
    $sql = "DELETE FROM leaves WHERE id IN ($in)";
    $stmt = $conn->prepare($sql);
    $stmt->execute($ids);
    jsonResponse(['status' => 'success']);
}
elseif ($action === 'get' && $method === 'GET') {
    $id = $_GET['id'] ?? '';
    $stmt = $conn->prepare("SELECT id, name, full_name as fullName, id_number as idNumber, type, report_date as reportDate, start_date as startDate, end_date as endDate, doctor, job, companion, relation FROM leaves WHERE id = ?");
    $stmt->execute([$id]);
    $leave = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($leave) jsonResponse(['status' => 'success', 'data' => $leave]);
    else jsonResponse(['status' => 'not_found'], 404);
}
?>
