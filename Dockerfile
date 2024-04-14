# https://dockerize.io/guides/docker-nuxtjs-guide

# Local build: "docker build -t git-anon ."
# Start: "docker run -p 3000:3000 -v <destination path>:/usr/src/git-anon/data git-anon"

FROM node:lts-alpine

# Create destination directory
RUN mkdir -p /usr/src/git-anon
WORKDIR /usr/src/git-anon

# Update and install dependency
RUN apk update && apk upgrade
RUN apk add git gpg openrc openssh
RUN rc-update add sshd

# Copy the app, note .dockerignore
COPY . /usr/src/git-anon/

# Install dependencies
RUN npm install --omit=dev
RUN npm run build

# Expose port 3000 which nuxt uses
EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Start the application
CMD [ "npm", "run", "start" ]
