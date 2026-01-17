CREATE TABLE `order_items` (
	`id` varchar(128) NOT NULL,
	`orderId` varchar(128) NOT NULL,
	`productId` varchar(128) NOT NULL,
	`product_title` varchar(255) NOT NULL,
	`quantity` int NOT NULL,
	`price_at_pos` int NOT NULL,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` varchar(128) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`total_price` int NOT NULL,
	`status` varchar(50) DEFAULT 'COMPLETED',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
