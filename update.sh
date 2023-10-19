#!/bin/bash

# Ask the user if they are using LXC or other
read -p "Are you using LXC? (yes/no): " lxc_choice

if [ "$lxc_choice" == "yes" ]; then
    # Ask for the container name
    read -p "Enter the container name: " container_name
    # Go inside the LXC container
    lxc exec "$container_name" -- bash -c 'git clone -b v1 https://YourUsername:YourPassword@github.com/your/repo.git && cd repo'
    # Copy and replace .js files inside the LXC container
    lxc exec "$container_name" -- bash -c 'cp /var/lib/tomcat9/webapps/ima2/dhis-web-tracker-capture/app-*.js /path/to/your/clone/'
else
    # Ask for the file path
    read -p "Enter the file path (e.g., /path/to/your/file.js): " file_path
    # Verify that the file_path exists and is a .js file
    if [ -f "$file_path" ] && [[ "$file_path" == *.js ]]; then
        # Clone the repository
        git clone -b v1 https://YourUsername:YourPassword@github.com/your/repo.git && cd repo
        # Copy and replace .js file
        cp app-*.js "$file_path"
    else
        echo "The specified file does not exist or is not a .js file."
        exit 1
    fi
fi
