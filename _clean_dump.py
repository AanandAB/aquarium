"""Clean a D1 export: strip d1_migrations + CREATE TABLE/INDEX, keep PRAGMA + DELETEs + INSERTs."""
import re

with open(r'C:\Users\aanan\Desktop\AANAND AB\PROJECTS\aquarium\drizzle\seed-dump.sql', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Step 1: strip d1_migrations
cleaned = []
skip = False
for line in lines:
    if 'd1_migrations' in line:
        if 'CREATE TABLE' in line and not line.rstrip().endswith(');'):
            skip = True
            continue
        continue
    if skip:
        if line.rstrip().endswith(');'):
            skip = False
        continue
    cleaned.append(line)

# Step 2: strip CREATE TABLE / INDEX blocks
final = []
skip_create = False
for line in cleaned:
    stripped = line.lstrip()
    if stripped.startswith('CREATE TABLE') or stripped.startswith('CREATE INDEX') or stripped.startswith('CREATE UNIQUE INDEX'):
        if line.rstrip().endswith(');'):
            continue
        skip_create = True
        continue
    if skip_create:
        if line.rstrip().endswith(');'):
            skip_create = False
        continue
    final.append(line)

# Step 3: find table names
table_names = set()
for line in final:
    m = re.match(r'INSERT INTO "(\w+)"', line)
    if m:
        table_names.add(m.group(1))

# Step 4: prepend DELETEs in FK-safe order
delete_order = [
    'fish_compatibility', 'planner_presets', 'homepage_sections',
    'nav_items', 'gallery_items', 'testimonials', 'faqs', 'offers',
    'blog_posts', 'fish', 'products', 'media', 'categories',
    'site_settings', 'users', 'settings'
]

output = ['PRAGMA defer_foreign_keys=TRUE;\n']
for tbl in delete_order:
    if tbl in table_names:
        output.append(f'DELETE FROM "{tbl}";\n')
output.extend(final)

out_path = r'C:\Users\aanan\Desktop\AANAND AB\PROJECTS\aquarium\drizzle\seed-dump-clean.sql'
with open(out_path, 'w', encoding='utf-8') as f:
    f.writelines(output)

fish_count = sum(1 for l in output if 'INSERT INTO "fish"' in l)
prod_count = sum(1 for l in output if 'INSERT INTO "products"' in l)
print(f'Lines: {len(output)} | fish: {fish_count} | products: {prod_count}')
print(f'Tables: {[t for t in delete_order if t in table_names]}')
