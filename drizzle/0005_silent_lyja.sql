ALTER TABLE `orders` MODIFY COLUMN `status` varchar(50) DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE `orders` ADD `type` varchar(20) DEFAULT 'TAKEAWAY';--> statement-breakpoint
ALTER TABLE `orders` ADD `table_number` varchar(10);