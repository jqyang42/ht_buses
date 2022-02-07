# pull official base image
FROM python:3.9.6-alpine

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev

# set work directory (exists in container)
WORKDIR /backend

# install dependencies
RUN pip install --upgrade pip
COPY ./backend/requirements.txt requirements.txt
RUN pip install -r requirements.txt

# copy project
COPY ./backend .