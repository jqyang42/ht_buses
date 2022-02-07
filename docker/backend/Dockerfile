# pull official base image
FROM python:3.9.6-alpine

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev netcat-openbsd

# set work directory (exists in container)
WORKDIR /backend

# install dependencies
RUN pip install --upgrade pip
COPY ./backend/requirements.txt requirements.txt
RUN pip install -r requirements.txt

ENV DJANGO_SETTINGS_MODULE ht_buses.settings

# copy project
COPY ./backend .

# run entrypoint.sh
COPY ./docker/backend/entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//g' /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]