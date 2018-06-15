---
layout: post
author: "Rohan Karamandi"
title:  "Gist // Running NGINX and CertBot Containers on the Same Host"
description: A lot of people run into the problem of running Let's Encrypt's CertBot Tool and an NGINX on the same container host. A big part of this has to do with CertBot needing either port 80 or 443 open for the tool  to work as intended. This tends to conflict with NGINX as most people usually use port 80 (HTTP) or 443 (HTTPS) for their reverse proxy. Section 1 outlines how to configure NGINX to get this to work, and Section 2 is the Docker command to run CertBot.
date:   2017-05-29
tags: [letsencrypt, ssl, nginx, linux, certbot]
comments: true
share: true
---

## The Problem

A lot of people run into the problem of running Let's Encrypt's CertBot Tool and an NGINX on the same container host. A big part of this has to do with CertBot needing either port 80 or 443 open for the tool  to work as intended. This tends to conflict with NGINX as most people usually use port 80 (HTTP) or 443 (HTTPS) for their reverse proxy. Section 1 outlines how to configure NGINX to get this to work, and Section 2 is the Docker command to run CertBot.

## 1. NGINX Configuration

I use Docker Compose (docker-compose) for my NGINX server. My docker-compose.yml file looks something like this:

```yaml
nginx:
  image: "nginx:latest"
  container_name: nginx
  volumes:
    - /docker/nginx/conf:/etc/nginx:ro
    - /docker/nginx/www/:/var/www:ro
    - /certs/letsencrypt:/etc/letsencrypt:ro
    - /var/run/docker.sock:/tmp/docker.sock:ro
    - /var/log:/var/log
  ports:
    - 80:80
    - 443:443
  restart: always
```

I use my NGINX configuration files externally and map the volume into the container as read-only (there should be no reason for the server to have to write anything to the config files). More importantly, I have an external `www` folder pointing to `/var/www/`. The CertBot container will be writing to that in webroot mode.

I'm storing the certificates from Let's Encrypt in `/certs/letsencrypt/` on my host machine. The NGINX server will have read-only access to this volume, whereas the CertBot container will have read-write access, since it actually needs to store the generated certificate here.

My site configuration looks something like the below - don't forget to change it up from `example.com`:

```nginx
server {

  listen            80;
  server_name       *.example.com example.com;
  return            301     https://$host$request_uri;

  # Write Access and Error logs
  access_log        /var/log/nginx/.access.log;
  error_log         /var/log/nginx/error.log;

  # CertBot needs either port 80 or 443 open to connect to the
  location /.well-known/ {
    alias           /var/www/letsencrypt;
  }
}
```

We can then start the container(s) by using the `docker-compose up -d` command (the `-d` runs it in daemon mode so it runs in the background rather than in your face).

## 2. CertBot

The official CertBot Docker image runs more like a one-time script rather than a Docker container that runs for an extended period of time. Containers stop running when the intended task/process is finished executing, and as such, once the CertBot is done generating/creating the cert, it will end itself. My CertBot container looks something like this. Notice I'm not using docker-compose on this as I don't want it executing every time I start my NGINX server. As convenient as that is, the ACME servers that Let's Encrypt hosts only allow for a few renewals per week, so you want to use this sparingly.

```shell
$ docker run -it --rm --name certbot \
  -v /certs/letsencrypt:/etc/letsencrypt \
  -v /var/log/letsencrypt:/var/log/letsencrypt \
  -v /docker/nginx/www/letsencrypt:/var/www/.well-known \
  quay.io/letsencrypt/letsencrypt -t certonly \
  --agree-tos --renew-by-default \
  --webroot -w /var/www \
  -d example.com
```

From this point, you can create a shell script and add that to your crontab, to renew every 60 days or whenever you feel is a good idea.
