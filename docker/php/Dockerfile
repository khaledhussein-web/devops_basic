# 1. Base image: Linux + Apache + PHP 8.1
FROM php:8.1-apache

# 2. Enable Apache rewrite module (good practice)
RUN a2enmod rewrite

# 3. Install PHP extensions (MySQL support – needed later)
RUN docker-php-ext-install mysqli pdo pdo_mysql

# 4. Set working directory
WORKDIR /var/www/html

# 5. Copy application files into the container
COPY ../app/ /var/www/html/

# 6. Fix permissions (Apache user)
RUN chown -R www-data:www-data /var/www/html

# 7. Expose Apache port
EXPOSE 80
