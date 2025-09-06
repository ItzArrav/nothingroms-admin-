#!/usr/bin/env python3
"""
Simple BitTorrent solution for ROM distribution
Creates torrents for ROM files - completely free
"""

import os
import subprocess
import json
from pathlib import Path

def create_torrent(rom_file_path, tracker_urls=None):
    """
    Create a torrent file for a ROM
    
    Args:
        rom_file_path (str): Path to the ROM file
        tracker_urls (list): List of tracker URLs (optional)
    """
    
    if not os.path.exists(rom_file_path):
        print(f"Error: ROM file not found: {rom_file_path}")
        return False
    
    rom_file = Path(rom_file_path)
    torrent_name = f"{rom_file.stem}.torrent"
    torrent_path = rom_file.parent / torrent_name
    
    # Default free trackers if none provided
    if not tracker_urls:
        tracker_urls = [
            "udp://tracker.openbittorrent.com:80/announce",
            "udp://tracker.opentrackr.org:1337/announce",
            "udp://9.rarbg.to:2710/announce",
            "udp://exodus.desync.com:6969/announce",
            "udp://tracker.torrent.eu.org:451/announce"
        ]
    
    # Build tracker arguments
    tracker_args = []
    for tracker in tracker_urls:
        tracker_args.extend(["-a", tracker])
    
    # Create torrent using transmission-create (if available)
    try:
        cmd = ["transmission-create"] + tracker_args + ["-o", str(torrent_path), str(rom_file_path)]
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        print(f"✅ Torrent created: {torrent_name}")
        return True, str(torrent_path)
        
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("transmission-create not found. Install qBittorrent or Transmission first.")
        print("Or use any torrent client to manually create torrents.")
        return False, None

def generate_magnet_link(torrent_path):
    """Generate magnet link from torrent file"""
    try:
        # This would require a torrent library like libtorrent-python
        # For now, just show instructions
        print(f"📎 To get magnet link:")
        print(f"1. Open {torrent_path} in your torrent client")
        print(f"2. Right-click and copy magnet link")
        print(f"3. Add the magnet link to your website")
        return True
    except Exception as e:
        print(f"Error generating magnet link: {e}")
        return False

def main():
    """Main function"""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python create_torrent.py <rom_file_path>")
        print("Example: python create_torrent.py 'Nothing_OS_2.5.2.zip'")
        sys.exit(1)
    
    rom_file_path = sys.argv[1]
    
    print(f"Creating torrent for: {os.path.basename(rom_file_path)}")
    success, torrent_path = create_torrent(rom_file_path)
    
    if success:
        print(f"\n🎉 Success! Torrent file created.")
        print(f"📁 Torrent file: {torrent_path}")
        print(f"\n📋 Next steps:")
        print(f"1. Upload the .torrent file to your GitHub repo")
        print(f"2. Start seeding the ROM file")
        print(f"3. Add download links to your website")
        
        generate_magnet_link(torrent_path)
    else:
        print(f"\n❌ Failed to create torrent")

if __name__ == "__main__":
    main()
