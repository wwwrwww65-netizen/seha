<?php
require_once 'config.php';

$action = $_GET['action'] ?? '';

if ($action === 'login') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['status' => 'error'], 405);
    $data = json_decode(file_get_contents('php://input'), true);
    
    $username = trim($data['username'] ?? '');
    $password = trim($data['password'] ?? '');
    
    if (!$username || !$password) jsonResponse(['status' => 'error', 'message' => 'بيانات غير مكتملة'], 400);

    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? LIMIT 1");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password_hash'])) {
        if ($user['status'] !== 'active') {
             jsonResponse(['status' => 'inactive', 'message' => 'الحساب موقوف']);
        }

        // Regenerate session ID to prevent session fixation
        session_regenerate_id(true);
        
        // Setup session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['login_time'] = time();
        $_SESSION['permissions'] = [
            'admin_access' => $user['perm_admin_access'],
            'add_leave' => $user['perm_add_leave'],
            'edit_leave' => $user['perm_edit_leave'],
            'delete_leave' => $user['perm_delete_leave']
        ];
        
        jsonResponse(['status' => 'success']);
    } else {
        jsonResponse(['status' => 'error', 'message' => 'اسم المستخدم أو كلمة المرور غير صحيحة'], 401);
    }
}

elseif ($action === 'logout') {
    session_destroy();
    jsonResponse(['status' => 'success']);
}

elseif ($action === 'me') {
    if (isset($_SESSION['user_id'])) {
        jsonResponse([
            'status' => 'success',
            'user' => [
                'id' => $_SESSION['user_id'],
                'username' => $_SESSION['username'],
                'role' => $_SESSION['role'],
                'permissions' => $_SESSION['permissions']
            ]
        ]);
    } else {
        jsonResponse(['status' => 'error'], 401);
    }
}
?>
