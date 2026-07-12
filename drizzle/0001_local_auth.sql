ALTER TABLE `users`
ADD COLUMN `username` varchar(64),
ADD COLUMN `passwordHash` text,
ADD UNIQUE KEY `users_username_unique` (`username`);
