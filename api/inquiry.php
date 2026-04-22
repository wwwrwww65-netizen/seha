<?php
require_once 'config.php';

$action = $_GET['action'] ?? '';

if ($action === 'inquiry') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['status' => 'error'], 405);
    $data = json_decode(file_get_contents('php://input'), true);
    
    $serviceCode = trim($data['serviceCode'] ?? '');
    $idNumber = trim($data['idNumber'] ?? '');
    
    if (!$serviceCode || !$idNumber) jsonResponse(['status' => 'error'], 400);

    $stmt = $conn->prepare("SELECT id, name, id_number as idNumber, report_date as reportDate, start_date as startDate, end_date as endDate, doctor, job, companion, relation FROM leaves WHERE id = ? AND id_number = ? LIMIT 1");
    $stmt->execute([$serviceCode, $idNumber]);
    $leave = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($leave) {
        jsonResponse([
            'status' => 'success',
            'data' => $leave
        ]);
    } else {
        jsonResponse(['status' => 'not_found']);
    }
}
?>
