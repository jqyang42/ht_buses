###########
# BUILDER #
###########

# pull official base image
FROM python:3.9.6-alpine as builder

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev netcat-openbsd

# lint
RUN pip install --upgrade pip
# RUN pip install flake8==3.9.2
# COPY . .
# RUN flake8 --ignore=E501,F401 .

# install dependencies
COPY ./backend/requirements.txt requirements.txt
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels -r requirements.txt


#########
# FINAL #
#########

# pull official base image
FROM python:3.9.6-alpine

# create directory for the app user
RUN mkdir -p /home/app

# create the app user
RUN addgroup -S app && adduser -S app -G app

# create the appropriate directories
ENV HOME=/home/app
ENV APP_HOME=/home/app/backend
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# install dependencies
RUN apk update && apk add libpq
COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --no-cache /wheels/*

# copy entrypoint.sh
COPY ./docker/backend/entrypoint.sh $APP_HOME/entrypoint.sh
RUN sed -i 's/\r$//g'  $APP_HOME/entrypoint.sh
RUN chmod +x  $APP_HOME/entrypoint.sh

# copy project
COPY ./backend $APP_HOME

# chown all the files to the app user
RUN chown -R app:app $APP_HOME

# change to the app user
USER app

# run entrypoint.sh
ENTRYPOINT ["/home/app/backend/entrypoint.sh"]

# # pull official base image
# FROM python:3.9.6-alpine

# # set environment variables
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# # install psycopg2 dependencies
# RUN apk update \
#     && apk add postgresql-dev gcc python3-dev musl-dev netcat-openbsd

# # set work directory (exists in container)
# WORKDIR /backend

# # install dependencies
# RUN pip install --upgrade pip
# COPY ./backend/requirements.txt requirements.txt
# RUN pip install -r requirements.txt

# ENV DJANGO_SETTINGS_MODULE ht_buses.settings

# # copy project
# COPY ./backend .

# # run entrypoint.sh
# COPY ./docker/backend/entrypoint.sh /entrypoint.sh
# RUN sed -i 's/\r$//g' /entrypoint.sh
# RUN chmod +x /entrypoint.sh
# ENTRYPOINT ["/entrypoint.sh"]