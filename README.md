# ht_buses
ECE458 Senior Design Project

## docker-test-2 branch: docker prod server :D
### How to get this thing working smh
1. Have this branch in your vcm server or whatever. Make sure that it has the version of dev that you want: `git merge dev` and stuff
    - if you're testing individual stuff, you might want to treat this as `dev`, and branch off to not mess this branch up
3. Update .env file in `/docker/backend/`
4. Make sure you're using the right domain:
    - `docker/nginx/nginx.conf`
      - `server_name`: can be `vcm-#####.vm.duke.edu` if you want, or remove line for localhost
    - `constants.js`: `API_DOMAIN` should match the domain in `server_name`
5. Download [docker](https://docs.docker.com/engine/install/ubuntu/) and [docker-compose](https://docs.docker.com/compose/install/)
  - FYI, docker and docker-compose commands require `sudo` prepended
6. Get the thing running:
  - `sudo docker-compose up --build -d`: builds docker images thru `docker-compose.yml`, and gets them up and running in detached mode (logs don't automatically take up terminal)
  - `sudo docker-compose logs -f`: follows logs output - here's where you see what all the different services built in docker-compose (nginx, backend, db) are saying
  - `sudo docker-compose down --volumes --remove-orphans`: shuts down the images, deletes the volumes, removes any volumes not associated by name anymore. This should be run before bring the images back up!
