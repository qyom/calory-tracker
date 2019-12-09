FROM phpdockerio/php72-fpm:latest
WORKDIR /application

# Install selected extensions and other stuff
RUN apt-get update \
  && apt-get -y --no-install-recommends install  php7.2-mysql php-xdebug libmcrypt-dev php7.2-sqlite \
  && apt-get clean; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

# install sqlite
# add /vendor/bin to PATH
# php artisan queue:listen
