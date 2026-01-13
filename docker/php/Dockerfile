FROM php:8.1-apache

RUN a2enmod rewrite \
 && docker-php-ext-install mysqli pdo pdo_mysql

WORKDIR /var/www/html
COPY app/ /var/www/html/

RUN chown -R www-data:www-data /var/www/html
