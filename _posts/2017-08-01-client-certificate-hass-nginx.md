---
layout: post
title:  "Gist // Create Client Certificates with NGINX for use with Home Assistant"
description: Another Gist that someone asked me to do. Here we use Nginx with self-signed client certificates to frontend Home Assistant (or really anything else)
date:   2017-08-01
tags: [homeassistant, openssl, nginx, linux, home-automation]
comments: true
share: true
---

## 0. Prerequisite: Install OpenSSL

Before we start, we want to make sure you have OpenSSL installed. You can check by running the command:
```bash
$ openssl version
```

If that returns you a version, you're good. If not, then install OpenSSL using

```bash
$ sudo apt update && sudo install openssl
```

## 1. Generate CA Certificate

Now that OpenSSL is installed, we want to first generate a CA certificate. This is so that we can validate the client certificates against this CA to make sure they're valid. It'll ask you a series of questions via a wizard. In my case, I'm doing AES256 encryption, you can do whichever else you feel like; though AES256 is the most common on to use, unless you're in a place where you can't use AES. You should then use the `-3des` method. Keep in mind all the files outputted will be saved in the directory you're working in. Take note of the full path, as you'll need it later for the NGINX configuration. If you're not sure of the full path of the current directory you're in, you can find out by running the `$ pwd` command.

```bash
$ openssl genrsa -aes256 -out ca.privkey 4096
```

You'll then see it generating the key:

```
Generating RSA private key, 4096 bit long modulus
.................................................................................................................++
.........................++
e is 65537 (0x10001)
```

And then get asked to enter a pass phrase for the key, and of course re-enter it to make sure you didn't make a mistake the first time.

```
Enter pass phrase for ca.key:
Verifying - Enter pass phrase for ca.key:
```

Now we want to use this to create a new X509 CA Root Certificate. In this case, we can generate it for 365 days.

```bash
$ openssl req -new -x509 -days 365 -key ca.privkey -out ca.crt
```

You'll be asked to verify the pass phrase you mentioned above, and again, you'll be asked a series of questions, where the values in the square brackets will be the default values if you don't provide a response:

```
Enter pass phrase for ca.privkey:
```
```
You are about to be asked to enter information that will be incorporated into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
---
Country Name (2 letter code) [AU]:
State or Province Name (full name) [Some-State]:
Locality Name (eg, city) []:
Organization Name (eg, company) [Internet Widgits Pty Ltd]:
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:
Email Address []:
```
Your CA certificate has now been created as `ca.crt`.


## 2. Create Client Key + CSR
Now let's create the client key and Certificate Signing Request (CSR). The steps are similar to above, with a couple of slight syntax differences so I won't re-explain it. In this example, I want to create a client cert for Bob's iPad.

```bash
$ openssl genrsa -aes256 -out bobs-ipad.privkey 4096
$ openssl req -new -out bobs-ipad.csr -key bobs-ipad.privkey
```
You'll now have the CSR file and client key files in the directory you're working in.

Let's go ahead and create the certificate for the client
```
$ openssl x509 -req -days 365 -in bobs-ipad.csr -CA ca.crt -CAkey ca.privkey -set_serial 100 -out bobs-ipad.crt
```
You'll be asked for the CA's cert private key again as you're doing an operation against it.

If you look at bobs-ipad.crt now, you should see the certificate!

```bash
$ cat bobs-ipad.crt
```
```
-----BEGIN CERTIFICATE-----
<certificate text goes here>
-----END CERTIFICATE-----
```

## 3. Export Client Cert for Browser Usage

Cool!! Now we need to make something useful of this. Most browsers, utilize the PKCS12 format of certs, so we'll need to export the certs we just created to that format. Once we do this, we can take the output (in the example below, we use the bobs-ipad.p12 file) and install that into our browsers and OS's
```
$ openssl pkcs12 -export -clcerts -in bobs-ipad.crt -inkey bobs-ipad.privkey -out bobs-ipad.p12
```

The way you install it into the browser is usually pretty straight-forward, depending on the browser. Google this part :)

## 4. NGINX Configuration

Within the server block in the NGINX configuration, you'll need to add the following two lines. Note that /path/to/ca.crt should be the whole path to the CA.crt we noted above.
```
# Client Certificate for Authentication - OpenSSL
ssl_client_certificate  /path/to/ca.crt;
ssl_verify_client       on; # this should be set to on so that the server always checks the presented client certs against the CA cert for validity.
```

My whole config looks something like (I have SSL on). Don't let the SSL configuration scare you, its mostly copied and pasted from best practices. You can find that config at [cipherli.st](https://cipherli.st/)

```nginx
server {

        listen                                          443 ssl;
        server_name                                     server.name;

        # Client Certificate for Authentication - OpenSSL
        ssl_client_certificate                          /path/to/ca.crt;
        ssl_verify_client                               on;

        # HTTPS Certificate Information - Let's Encrypt
        ssl_certificate                                 /path/to/letsencrypt/fullchain.pem;
        ssl_certificate_key                             /path/to/letsencrypt/privkey.pem;

        ssl_protocols                                   TLSv1.2;
        ssl_prefer_server_ciphers                       on;
        ssl_ciphers                                     "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
        ssl_ecdh_curve                                  secp384r1;
        ssl_session_cache                               shared:SSL:10m;
        ssl_session_tickets                             off;
        ssl_stapling                                    on;
        ssl_stapling_verify                             on;
        resolver                                        208.67.222.222 208.67.220.220 valid=300s;
        resolver_timeout                                5s;
        add_header  Strict-Transport-Security           "max-age=63072000; includeSubDomains; preload";
        add_header  X-Frame-Options                     DENY;
        add_header  X-Content-Type-Options              nosniff;

        # Logging
        access_log                                      /var/log/nginx-hass-access.log;
        error_log                                       /var/log/nginx-hass-error.log;

        location / {
            proxy_pass                                  http://hass.url:8123/;
            proxy_set_header  Host                      $host;
        }

        location /api/websocket {
            proxy_pass                                  http://hass.url:8123/api/websocket;
            proxy_set_header  Host                      $host;
            proxy_http_version                          1.1;
            proxy_set_header  Upgrade                   $http_upgrade;
            proxy_set_header  Connection                "upgrade";

        }
}
```

That's it! Restart NGINX for the changes to take into effect, and you should be good!

## tl;dr

Run these commands to generate the CA certs, and follow the wizards:

```bash
$ openssl genrsa -aes256 -out ca.privkey 4096
$ openssl req -new -x509 -days 365 -key ca.privkey -out ca.crt
```
Run these commands to create a certificate and export a PKCS12 cert for your browser (in this case, I use bobs-ipad as an example)
```bash
$ openssl genrsa -aes256 -out bobs-ipad.privkey 4096
$ openssl req -new -out bobs-ipad.csr -key bobs-ipad.privkey
$ openssl x509 -req -days 365 -in bobs-ipad.csr -CA ca.crt -CAkey ca.privkey -set_serial 100 -out bobs-ipad.crt
$ openssl pkcs12 -export -clcerts -in bobs-ipad.crt -inkey bobs-ipad.privkey -out bobs-ipad.p12
```
And update your NGINX server block config (replace /path/to/ca.crt with the actual path to your ca.crt file):
```nginx
ssl_client_certificate                          /path/to/ca.crt;
ssl_verify_client                               on;
```
