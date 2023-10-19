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

# Check if the branch exists in the GitHub repository
if ! git ls-remote --exit-code --heads "https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/dhis2scripts/icdiframe.git" "$dhis2_version" &> /dev/null; then
    echo "Error: The specified DHIS2 version ($dhis2_version) is not supported in the repository."
    exit 1
fi

# Ask the user if they are using LXC or other
read -p "Are you using LXC? (yes/no): " lxc_choice
if [ "$lxc_choice" == "yes" ]; then
    # Ask for the container name
    read -p "Enter the container name: " container_name
    # Go inside the LXC container
    lxc exec "$container_name" -- bash -c "git clone -b $dhis2_version https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/dhis2scripts/icdiframe.git"
    # Copy and replace .js files inside the LXC container

   # Run the command inside the LXC container to find the first matching file
   first_matching_file=$(lxc exec "$container_name" -- /bin/bash -c "directory='/var/lib/tomcat9/webapps/$container_name/dhis-web-tracker-capture/'; first_matching_file=\$(find \"\$directory\" -type f -name 'app-*.js' | head -n 1); echo \"\$first_matching_file\"")

# Check if a matching file was found in the container
if [ -n "$first_matching_file" ]; then
    echo "The first matching file in the container is: $first_matching_file"

    # Clone the repository with the specified DHIS2 version as the branch
    lxc exec "$container_name" -- bash -c "git clone -b $dhis2_version https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/dhis2scripts/icdiframe.git"

    # Find the file with the same name in the cloned files
    file_to_replace=$(lxc exec "$container_name" -- /bin/bash -c "find icdiframe -name \"\$(basename \"$first_matching_file\")\" | head -n 1")

    if [ -n "$file_to_replace" ]; then
        # Create a backup of the original file in the container
        lxc exec "$container_name" -- /bin/bash -c "cp \"$first_matching_file\" \"$first_matching_file.bak\""
    
        # Replace the file in the container
        lxc exec "$container_name" -- /bin/bash -c "cp \"$file_to_replace\" \"$first_matching_file\""
        echo "Replaced the file in the container with $file_to_replace."
    else
        echo "No matching file found in the cloned files."
    fi
else
    echo "No matching file found in the specified directory in the container."
fi
else
    # Ask for the file path
    read -p "Enter the file path (e.g., /path/to/your/file.js): " file_path
    # Verify that the file_path exists and is a .js file
    if [ -f "$file_path" ] && [[ "$file_path" == *.js ]]; then
        # Clone the repository with the specified DHIS2 version as the branch
    git clone -b "$dhis2_version" "https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/dhis2scripts/icdiframe.git" && cd icdiframe

    # Find the file with the same name in the cloned files
    file_to_replace=$(find . -name "$(basename "$file_path")" | head -n 1)

    if [ -n "$file_to_replace" ]; then
        # Create a backup of the original file
        mv "$file_path" "$file_path.bak"
        # Replace the file with the one from the cloned files
        mv "$file_to_replace" "$file_path"
        echo "Replaced the file with $file_to_replace."
    else
        echo "No matching file found in the cloned files."
    fi
    else
        echo "The specified file does not exist or is not a .js file."
        exit 1
    fi
fi
