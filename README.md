# ht_buses
ECE458 Senior Design Project

## Updating prod
### Update the repo
1. Navigate to repo location: `cd ~/ht_buses`
2. Verify branch is `prod-ev#` or `test-prod-ev#`: `git status`
3. Update: `git pull`
### Update backend
1. Verify gunicorn is active and running: `sudo systemctl status gunicorn`
2. Restart gunicorn: `sudo systemctl restart gunicorn`
3. Verify gunicorn is active and running: `sudo systemctl status gunicorn`
### Update frontend
1. Navigate to frontend folder: `cd ~/ht_buses/frontend`
2. Install any new npm packages: `npm install`
3. Create production build of react app: `npm run build`
4. Create a separate terminal.
5. Navigate to where nginx looks for react static files: `cd /var/www/ht_buses/html`
6. Remove all files: `sudo rm -r *`
7. From terminal where `run build` was called, copy files into emptied folder: `cp -r build/* /var/www/ht_buses/html`
## done!
