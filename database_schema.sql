CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'مستخدم',
  `status` varchar(20) DEFAULT 'active',
  `perm_admin_access` tinyint(1) DEFAULT 0,
  `perm_add_leave` tinyint(1) DEFAULT 0,
  `perm_edit_leave` tinyint(1) DEFAULT 0,
  `perm_delete_leave` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `leaves` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `id_number` varchar(50) NOT NULL,
  `type` varchar(50) DEFAULT 'government',
  `report_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `doctor` varchar(255) DEFAULT NULL,
  `job` varchar(255) DEFAULT NULL,
  `companion` varchar(255) DEFAULT NULL,
  `relation` varchar(100) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_id_number` (`id_number`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- حساب المدير الافتراضي | كلمة المرور: 777310
-- لتغيير كلمة المرور بعد الرفع، ادخل للوحة التحكم > الإعدادات > تغيير كلمة المرور
INSERT INTO `users` (`username`, `password_hash`, `role`, `status`, `perm_admin_access`, `perm_add_leave`, `perm_edit_leave`, `perm_delete_leave`) VALUES
('u@seha-sa.life', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'مدير نظام', 'active', 1, 1, 1, 1);
