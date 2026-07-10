CREATE TABLE `tank_pricing` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`litres_min` integer DEFAULT 0 NOT NULL,
	`litres_max` integer,
	`base_setup` real DEFAULT 0 NOT NULL,
	`per_litre` real DEFAULT 0 NOT NULL,
	`filter_cost` real DEFAULT 0 NOT NULL,
	`heater_cost` real DEFAULT 0 NOT NULL,
	`light_cost` real DEFAULT 0 NOT NULL,
	`substrate_cost` real DEFAULT 0 NOT NULL,
	`decor_cost` real DEFAULT 0 NOT NULL,
	`note` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
