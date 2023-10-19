#!/bin/bash

# Set the username
GITHUB_USERNAME="dhis2scripts"

# Ask the user for their GitHub personal access token
read -p "Enter your Access Token: " GITHUB_TOKEN

# Perform a simple Git operation to verify the token
if ! git ls-remote --exit-code "https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/dhis2scripts/icdiframe.git" &> /dev/null; then
    echo "Error: The provided Access Token is invalid."
    exit 1
fi

# Ask the user for the DHIS2 version
read -p "Enter the DHIS2 version (e.g. 2.40 etc.): " dhis2_version

# Ask the user if they are using LXC or other
read -p "Are you using LXC? (yes/no): " lxc_choice

if [ "$lxc_choice" == "yes" ]; then
    # Ask for the container name
    read -p "Enter the container name: " container_name

    # Remove the cloned repository and restore the original file in the container
    lxc exec "$container_name" -- /bin/bash -c "rm -rf icdiframe && mv \"$first_matching_file.bak\" \"$first_matching_file\""

    echo "Changes undone in the LXC container."
else
    # Ask for the file path
    read -p "Enter the file path (e.g., /path/to/your/file.js): " file_path

    if [ -f "$file_path" ] && [[ "$file_path" == *.js ]]; then
        # Remove the cloned repository and restore the original file
        cd /path/to/your/clone && rm -rf icdiframe && mv "$file_path.bak" "$file_path"
        
        echo "Changes undone in the local file system."
    else
        echo "The specified file does not exist or is not a .js file."
    fi
fi
