#!/bin/bash
echo ""
echo "🇮🇳  Sarkari Sahayak — AI Government Scheme Finder"
echo "=================================================="
echo ""

# Start backend
echo "▶ Starting backend (port 3001)..."
cd backend && npm install --silent && node server.js &
BACKEND_PID=$!
sleep 2

# Start frontend
echo "▶ Starting frontend (port 5173)..."
cd ../frontend && npm install --silent && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers running!"
echo ""
echo "   🌐 App:     http://localhost:5173"
echo "   🔧 API:     http://localhost:3001/api/health"
echo ""
echo "Press Ctrl+C to stop both servers."

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
