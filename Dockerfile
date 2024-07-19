# Use the official Ubuntu base image
FROM ubuntu:latest

# Update package lists and install Apache2
RUN apt-get update && \
    apt-get install -y apache2 && \
    apt-get clean

# Copy the React build files to the Apache web root directory
COPY . /var/www/html

# Expose port 80 to the outside world
EXPOSE 80

# Start the Apache2 service
CMD ["apache2ctl", "-D", "FOREGROUND"]
