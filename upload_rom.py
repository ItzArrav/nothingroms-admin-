#!/usr/bin/env python3
"""
ROM Upload Script for Internet Archive
Uploads ROM files to archive.org with proper metadata
"""

import os
import sys
import subprocess
from pathlib import Path

# Path to the ia executable
IA_PATH = r"C:\Users\dell\AppData\Roaming\Python\Python313\Scripts\ia.exe"

def upload_rom(rom_file_path, rom_name, device_model, android_version, description=""):
    """
    Upload a ROM file to Internet Archive
    
    Args:
        rom_file_path (str): Path to the ROM file
        rom_name (str): Name of the ROM (e.g., "Nothing OS 2.5.2")
        device_model (str): Device model (e.g., "Nothing Phone (1)")
        android_version (str): Android version (e.g., "Android 14")
        description (str): Additional description
    """
    
    # Check if file exists
    if not os.path.exists(rom_file_path):
        print(f"Error: ROM file not found: {rom_file_path}")
        return False
    
    # Create a unique identifier for this item
    rom_file = Path(rom_file_path)
    item_identifier = f"nothing-rom-{device_model.lower().replace(' ', '-').replace('(', '').replace(')', '')}-{rom_name.lower().replace(' ', '-').replace('.', '-')}"
    
    # Prepare metadata
    metadata = {
        "title": f"{rom_name} for {device_model}",
        "description": f"Nothing OS ROM - {rom_name} for {device_model}. {description}",
        "subject": ["Android ROM", "Nothing OS", "Custom ROM", device_model, android_version],
        "creator": "NothingROMs Community",
        "mediatype": "software",
        "collection": "opensource_software",
        "language": "eng",
        "date": "2024"  # Update this to current date
    }
    
    # Build the upload command
    cmd = [IA_PATH, "upload", item_identifier, rom_file_path]
    
    # Add metadata arguments
    for key, value in metadata.items():
        if isinstance(value, list):
            for v in value:
                cmd.extend([f"--metadata={key}:{v}"])
        else:
            cmd.extend([f"--metadata={key}:{value}"])
    
    print(f"Uploading {rom_file.name} to Internet Archive...")
    print(f"Item identifier: {item_identifier}")
    print("This may take a while for large files...")
    
    try:
        # Execute the upload command
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        print("Upload successful!")
        print(f"View your upload at: https://archive.org/details/{item_identifier}")
        print(f"Direct download link: https://archive.org/download/{item_identifier}/{rom_file.name}")
        return True, item_identifier
        
    except subprocess.CalledProcessError as e:
        print(f"Upload failed: {e}")
        print(f"Error output: {e.stderr}")
        return False, None

def main():
    """Main function for command line usage"""
    if len(sys.argv) < 4:
        print("Usage: python upload_rom.py <rom_file_path> <rom_name> <device_model> [android_version] [description]")
        print("Example: python upload_rom.py 'Nothing_OS_2.5.2.zip' 'Nothing OS 2.5.2' 'Nothing Phone (1)' 'Android 14' 'Latest stable build'")
        sys.exit(1)
    
    rom_file_path = sys.argv[1]
    rom_name = sys.argv[2]
    device_model = sys.argv[3]
    android_version = sys.argv[4] if len(sys.argv) > 4 else "Android"
    description = sys.argv[5] if len(sys.argv) > 5 else ""
    
    success, identifier = upload_rom(rom_file_path, rom_name, device_model, android_version, description)
    
    if success:
        print(f"\n✅ Upload completed successfully!")
        print(f"📱 Item ID: {identifier}")
    else:
        print(f"\n❌ Upload failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
