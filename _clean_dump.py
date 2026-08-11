"""Simple D1 dump cleaner: remove d1_migrations, CREATE TABLE/INDEX, keep PRAGMA + INSERTs + add DELETEs."""
import re

with open(r'C:\Users\aanan\Desktop\AANAND AB\PROJECTS\aquarium\drizzle\seed-dump.sql', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Step 1: Remove d1_migrations CREATE TABLE block + INSERTs
cleaned = []
skip_until_semicolon = False
for line in lines:
    # Detect d1_migrations CREATE TABLE (multi-line)
    if 'CREATE TABLE' in line and 'd1_migrations' in line:
        if line.rstrip().endswith(');'):
            continue
        skip_until_semicolon = True
        continue
    if skip_until_semicolon:
        if line.rstrip().endswith(');'):
            skip_until_semicolon = False
        continue
    # Skip d1_migrations INSERTs (single-line)
    if 'INSERT INTO' in line and 'd1_migrations' in line:
        continue
    cleaned.append(line)

# Step 2: Remove all CREATE TABLE / CREATE INDEX blocks
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

# Step 3: Find table names from INSERTs
table_names = set()
for line in final:
    m = re.match(r'INSERT INTO "(\w+)"', line)
    if m:
        table_names.add(m.group(1))

# Step 4: Add DELETEs before INSERTs
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

print(f'Lines: {len(output)}')
print(f'Tables with DELETEs: {[t for t in delete_order if t in table_names]}')
fish_count = sum(1 for l in output if 'INSERT INTO "fish"' in l)
print(f'Fish INSERTs in output: {fish_count}')
