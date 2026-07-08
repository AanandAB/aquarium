CREATE TABLE `activity_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`user_email` text,
	`action` text NOT NULL,
	`entity` text,
	`entity_id` text,
	`meta` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE INDEX `activity_user_idx` ON `activity_logs` (`user_id`);--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` text PRIMARY KEY NOT NULL,
	`event` text NOT NULL,
	`path` text,
	`item_type` text,
	`item_id` text,
	`referrer` text,
	`session_id` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE INDEX `analytics_event_idx` ON `analytics_events` (`event`);--> statement-breakpoint
CREATE INDEX `analytics_created_idx` ON `analytics_events` (`created_at`);--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text,
	`content` text,
	`cover_image` text,
	`category_id` text,
	`tags` text,
	`author` text DEFAULT 'Happy Aquarium',
	`status` text DEFAULT 'draft' NOT NULL,
	`read_time` integer,
	`published_at` integer,
	`scheduled_at` integer,
	`featured` integer DEFAULT false NOT NULL,
	`meta_title` text,
	`meta_description` text,
	`keywords` text,
	`og_image` text,
	`canonical` text,
	`noindex` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_slug_idx` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE INDEX `blog_status_idx` ON `blog_posts` (`status`);--> statement-breakpoint
CREATE INDEX `blog_category_idx` ON `blog_posts` (`category_id`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text DEFAULT 'fish' NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text,
	`image` text,
	`color` text,
	`parent_id` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`meta_title` text,
	`meta_description` text,
	`keywords` text,
	`og_image` text,
	`canonical` text,
	`noindex` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `categories_kind_idx` ON `categories` (`kind`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_kind_slug_idx` ON `categories` (`kind`,`slug`);--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text DEFAULT 'enquiry' NOT NULL,
	`name` text,
	`phone` text,
	`email` text,
	`item_type` text,
	`item_id` text,
	`item_name` text,
	`message` text,
	`status` text DEFAULT 'new' NOT NULL,
	`notes` text,
	`source` text DEFAULT 'website',
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `enquiries_type_idx` ON `enquiries` (`type`);--> statement-breakpoint
CREATE INDEX `enquiries_status_idx` ON `enquiries` (`status`);--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` text PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `fish` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`scientific_name` text,
	`category_id` text,
	`short_description` text,
	`description` text,
	`care_guide` text,
	`origin` text,
	`temperature_min` real,
	`temperature_max` real,
	`ph_min` real,
	`ph_max` real,
	`difficulty` text DEFAULT 'beginner',
	`aggression` text DEFAULT 'peaceful',
	`water_type` text DEFAULT 'freshwater',
	`tank_size_min` integer,
	`adult_size` real,
	`lifespan` text,
	`diet` text,
	`compatibility` text,
	`price` real,
	`offer_price` real,
	`currency` text DEFAULT 'INR' NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`availability` text DEFAULT 'available',
	`varieties` text,
	`hero_image` text,
	`gallery` text,
	`video` text,
	`featured` integer DEFAULT false NOT NULL,
	`trending` integer DEFAULT false NOT NULL,
	`is_imported` integer DEFAULT false NOT NULL,
	`is_new_arrival` integer DEFAULT false NOT NULL,
	`tags` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`meta_title` text,
	`meta_description` text,
	`keywords` text,
	`og_image` text,
	`canonical` text,
	`noindex` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `fish_slug_idx` ON `fish` (`slug`);--> statement-breakpoint
CREATE INDEX `fish_category_idx` ON `fish` (`category_id`);--> statement-breakpoint
CREATE INDEX `fish_featured_idx` ON `fish` (`featured`);--> statement-breakpoint
CREATE INDEX `fish_trending_idx` ON `fish` (`trending`);--> statement-breakpoint
CREATE INDEX `fish_published_idx` ON `fish` (`published`);--> statement-breakpoint
CREATE TABLE `fish_compatibility` (
	`id` text PRIMARY KEY NOT NULL,
	`fish_a_id` text NOT NULL,
	`fish_b_id` text NOT NULL,
	`level` text DEFAULT 'semi' NOT NULL,
	`note` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `compat_pair_idx` ON `fish_compatibility` (`fish_a_id`,`fish_b_id`);--> statement-breakpoint
CREATE TABLE `gallery_items` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`caption` text,
	`type` text DEFAULT 'image' NOT NULL,
	`url` text NOT NULL,
	`thumbnail_url` text,
	`kind` text DEFAULT 'showcase' NOT NULL,
	`width` integer,
	`height` integer,
	`featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `gallery_kind_idx` ON `gallery_items` (`kind`);--> statement-breakpoint
CREATE TABLE `homepage_sections` (
	`id` text PRIMARY KEY NOT NULL,
	`section_type` text NOT NULL,
	`title` text,
	`subtitle` text,
	`config` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `homepage_sort_idx` ON `homepage_sections` (`sort_order`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`key` text NOT NULL,
	`url` text NOT NULL,
	`mime_type` text,
	`type` text DEFAULT 'image' NOT NULL,
	`size` integer,
	`width` integer,
	`height` integer,
	`alt` text,
	`folder` text DEFAULT 'uploads',
	`uploaded_by` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_key_idx` ON `media` (`key`);--> statement-breakpoint
CREATE INDEX `media_folder_idx` ON `media` (`folder`);--> statement-breakpoint
CREATE TABLE `nav_items` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`url` text NOT NULL,
	`parent_id` text,
	`location` text DEFAULT 'header' NOT NULL,
	`icon` text,
	`description` text,
	`is_external` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `nav_location_idx` ON `nav_items` (`location`);--> statement-breakpoint
CREATE TABLE `offers` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`description` text,
	`image` text,
	`badge` text,
	`discount_text` text,
	`cta_text` text,
	`cta_link` text,
	`placement` text DEFAULT 'homepage_banner' NOT NULL,
	`start_at` integer,
	`end_at` integer,
	`active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `offers_active_idx` ON `offers` (`active`);--> statement-breakpoint
CREATE INDEX `offers_placement_idx` ON `offers` (`placement`);--> statement-breakpoint
CREATE TABLE `planner_presets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`image` text,
	`tank_size_min` integer,
	`tank_size_max` integer,
	`budget_min` real,
	`budget_max` real,
	`experience` text DEFAULT 'beginner',
	`fish_ids` text,
	`product_ids` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`category_id` text,
	`sku` text,
	`brand` text,
	`short_description` text,
	`description` text,
	`specs` text,
	`price` real,
	`offer_price` real,
	`currency` text DEFAULT 'INR' NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`availability` text DEFAULT 'available',
	`hero_image` text,
	`gallery` text,
	`video` text,
	`featured` integer DEFAULT false NOT NULL,
	`trending` integer DEFAULT false NOT NULL,
	`is_imported` integer DEFAULT false NOT NULL,
	`is_new_arrival` integer DEFAULT false NOT NULL,
	`tags` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`meta_title` text,
	`meta_description` text,
	`keywords` text,
	`og_image` text,
	`canonical` text,
	`noindex` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_idx` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`category_id`);--> statement-breakpoint
CREATE INDEX `products_featured_idx` ON `products` (`featured`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` text PRIMARY KEY DEFAULT 'default' NOT NULL,
	`store_name` text DEFAULT 'Happy Aquarium' NOT NULL,
	`tagline` text,
	`description` text,
	`phone` text,
	`whatsapp` text,
	`email` text,
	`address_line` text,
	`area` text,
	`city` text,
	`state` text,
	`pincode` text,
	`map_lat` real,
	`map_lng` real,
	`map_embed_url` text,
	`directions_url` text,
	`opening_hours` text,
	`logo` text,
	`favicon` text,
	`socials` text,
	`ga_id` text,
	`meta_pixel` text,
	`theme` text,
	`meta_title` text,
	`meta_description` text,
	`keywords` text,
	`og_image` text,
	`canonical` text,
	`noindex` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_name` text NOT NULL,
	`avatar` text,
	`rating` integer DEFAULT 5 NOT NULL,
	`review` text NOT NULL,
	`image` text,
	`video` text,
	`location` text,
	`featured` integer DEFAULT false NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'viewer' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`last_login_at` integer,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);