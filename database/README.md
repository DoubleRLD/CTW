# Database Setup

Run these files against a fresh MySQL database, in this exact order:

1. schema.sql              — creates all tables
2. seed.sql                 — Georgia schools + email domains
3. dorms_seed.sql           — on-campus dorm data
4. add_favorites_table.sql  — adds the Favorites table
5. off_campus_gsu_seed.sql  — off-campus listings near GSU

Example:
```powershell
mysql -u <user> -p<password> <database> < schema.sql
mysql -u <user> -p<password> <database> < seed.sql
mysql -u <user> -p<password> <database> < dorms_seed.sql
mysql -u <user> -p<password> <database> < add_favorites_table.sql
mysql -u <user> -p<password> <database> < off_campus_gsu_seed.sql
```
