#!/bin/bash
echo "========================================"
echo "Novel Reader - Local Test Server"
echo "========================================"
echo ""
echo "Starting server on http://localhost:8000"
echo ""
echo "Open your browser and go to:"
echo "http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "========================================"
python3 -m http.server 8000
