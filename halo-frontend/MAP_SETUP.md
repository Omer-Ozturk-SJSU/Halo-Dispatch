# Interactive Map Setup Guide

## Overview
The Halo Dispatch application now includes an interactive map feature that displays UC Berkeley MLK area with real-time location tracking for emergency calls and police units. This implementation uses **OpenStreetMap** and **Leaflet** - completely free and open source!

## Features
- **Interactive Map**: Real-time map centered on UC Berkeley MLK Student Union
- **Emergency Caller Tracking**: Red pulsing marker showing caller location
- **Police Unit Tracking**: Color-coded markers for different unit statuses
- **Zoom Controls**: Interactive zoom in/out and center map functionality
- **Dark Mode Support**: Map adapts to light/dark theme
- **Real-time Updates**: Police units move in real-time towards caller location
- **No API Keys Required**: Completely free and open source

## Setup Instructions

### ✅ **No Setup Required!**
The map is now completely free and open source. No API keys, tokens, or external services are needed.

### Running the Application
Simply start the development server:
```bash
npm run dev
# or
pnpm dev
```

The interactive map will work immediately without any configuration!

## Map Features

### Caller Location
- **Red pulsing marker** at the emergency caller's location
- Located at UC Berkeley MLK Student Union (2495 Bancroft Way)
- Shows "Emergency Call" label with popup information

### Police Units
- **Orange markers**: Units "En Route" to the scene
- **Blue markers**: Units "Dispatched" but not yet en route
- **Green markers**: Units "Available" for dispatch
- Each marker shows unit ID and ETA in popup

### Controls
- **Zoom In/Out**: Buttons in top-right corner
- **Center Map**: Navigation button to return to UC Berkeley center
- **Interactive Popups**: Click markers for detailed information
- **Smooth Animations**: Units move smoothly across the map

## Technical Details

### Map Provider
- **OpenStreetMap**: Free, open-source mapping data
- **Leaflet**: Lightweight, mobile-friendly interactive maps
- **React-Leaflet**: React components for Leaflet

### Coordinates
- **Center**: UC Berkeley MLK Student Union (37.8697, -122.2601)
- **Caller Location**: 2495 Bancroft Way, Berkeley, CA
- **Default Zoom**: 15 (street level)

### Dependencies
- `leaflet`: Interactive map library
- `react-leaflet`: React components for Leaflet
- `@types/leaflet`: TypeScript definitions

## Advantages of OpenStreetMap

### ✅ **Completely Free**
- No usage limits
- No API keys required
- No credit card needed
- No monthly fees

### ✅ **Open Source**
- Community-driven mapping data
- Transparent and auditable
- No vendor lock-in
- Global coverage

### ✅ **Privacy Friendly**
- No tracking or analytics
- No data collection
- Respects user privacy
- GDPR compliant

### ✅ **Reliable**
- High availability
- Fast loading times
- Regular updates
- Community maintained

## Troubleshooting

### Map Not Loading
1. Check your internet connection
2. Ensure the development server is running
3. Check browser console for any errors

### Performance Issues
- The map uses hardware acceleration when available
- Consider reducing the number of markers for better performance
- Map tiles are cached automatically by the browser

### Customization
- Easy to customize markers and styles
- Can switch to different tile providers
- Supports custom overlays and layers

## Migration from Mapbox

If you were previously using Mapbox:
- ✅ No more API keys needed
- ✅ No more usage limits
- ✅ No more monthly costs
- ✅ Same functionality, better privacy

## Security Notes
- No external API calls to proprietary services
- All map data comes from open-source OpenStreetMap
- No user data is sent to third-party services
- Completely self-contained and secure 