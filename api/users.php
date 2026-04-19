<?php
require_once 'config.php';
requirePermission('admin_access');

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($action === 'list' && $method === 'GET') {
    $stmt = $conn->query("SELECT id, username, role, status, perm_admin_access, perm_add_leave, perm_edit_leave, perm_delete_leave FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format permissions for frontend
    foreach($users as &$u) {
        $u['permissions'] = [
            'admin_access' => (bool)$u['perm_admin_access'],
            'add_leave' => (bool)$u['perm_add_leave'],
            'edit_leave' => (bool)$u['perm_edit_leave'],
            'delete_leave' => (bool)$u['perm_delete_leave']
        ];
    }
    jsonResponse(['status' => 'success', 'data' => $users]);
}
elseif ($action === 'add' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['username']) || empty($data['password'])) {
        jsonResponse(['status' => 'error', 'message' => 'بيانات غير مكتملة'], 400);
    }

    $hash = password_hash($data['password'], PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("INSERT INTO users (username, password_hash, role, status, perm_admin_access, perm_add_leave, perm_edit_leave, perm_delete_leave) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    try {
        $stmt->execute([
            $data['username'],
            $hash,
            $data['role'] ?? 'مستخدم',
            $data['status'] ?? 'active',
            $data['permissions']['admin_access'] ?? 0,
            $data['permissions']['add_leave'] ?? 0,
            $data['permissions']['edit_leave'] ?? 0,
            $data['permissions']['delete_leave'] ?? 0
        ]);
        jsonResponse(['status' => 'success']);
    } catch (PDOException $e) {
         jsonResponse(['status' => 'error', 'message' => 'اسم المستخدم موجود مسبقاً'], 400);
    }
}
elseif ($action === 'update' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? '';
    
    // Updates username / password only for the current user for now
    if ($id != $_SESSION['user_id']) {
        jsonResponse(['status' => 'error', 'message' => 'لا يمكنك تعديل حسابات الآخرين'], 403);
    }

    $username = $data['data']['username'] ?? $_SESSION['username'];
    
    if (!empty($data['data']['password'])) {
        // Needs old password verification
        $oldPass = $data['oldPassword'] ?? '';
        $stmt = $conn->prepare("SELECT password_hash FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($oldPass, $user['password_hash'])) {
            jsonResponse(['status' => 'error', 'message' => 'كلمة المرور القديمة غير صحيحة'], 403);
        }
        
        $hash = password_hash($data['data']['password'], PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE users SET username = ?, password_hash = ? WHERE id = ?");
        $stmt->execute([$username, $hash, $id]);
    } else {
        $stmt = $conn->prepare("UPDATE users SET username = ? WHERE id = ?");
        $stmt->execute([$username, $id]);
    }
    
    $_SESSION['username'] = $username;
    jsonResponse(['status' => 'success']);
}
elseif ($action === 'delete' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? '';
    if ($id == $_SESSION['user_id']) {
        jsonResponse(['status' => 'error', 'message' => 'لا يمكنك حذف حسابك الشخصي'], 403);
    }
    
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);
    jsonResponse(['status' => 'success']);
}
elseif ($action === 'toggle_status' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? '';
    if ($id == $_SESSION['user_id']) {
        jsonResponse(['status' => 'error', 'message' => 'لا يمكنك إيقاف حسابك الشخصي'], 403);
    }
    
    // toggle between 'active' and 'inactive'
    $stmt = $conn->prepare("UPDATE users SET status = IF(status='active', 'inactive', 'active') WHERE id = ?");
    $stmt->execute([$id]);
    jsonResponse(['status' => 'success']);
}
?>
