"use client"

import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, Navigation, Clock, MapPin, Car, Shield, Heart } from 'lucide-react'
import dynamic from 'next/dynamic'

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface InteractiveMapProps {
  callerLocation: {
    lat: number
    lng: number
    address: string
    accuracy: number
  }
  policeUnits: Array<{
    id: string
    lat: number
    lng: number
    status: string
    eta: number
    type: string
  }>
  mapZoom: number
  onZoomChange: (zoom: number) => void
  darkMode?: boolean
}

// Enhanced custom marker icons with better styling
const createCallerIcon = () => {
  return L.divIcon({
    className: 'caller-marker',
    html: `
      <div class="caller-marker-container">
        <div class="caller-pulse-ring"></div>
        <div class="caller-marker-core">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#dc2626" stroke="white" stroke-width="2"/>
            <path d="M12 6v6l4 2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="caller-label">
          <span>EMERGENCY</span>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  })
}

const createUnitIcon = (status: string, eta: number, type: string) => {
  const statusColors = {
    'En Route': { bg: '#f97316', border: '#ea580c', text: '#fff' },
    'Dispatched': { bg: '#3b82f6', border: '#2563eb', text: '#fff' },
    'Available': { bg: '#3b82f6', border: '#2563eb', text: '#fff' }
  }
  
  const colors = statusColors[status as keyof typeof statusColors] || statusColors['Available']
  
  // Get the appropriate icon based on unit type with better sizing
  const getUnitIcon = () => {
    switch (type) {
      case 'Police':
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" fill="white"/>
          <path d="M12 9l-3 3 3 3 3-3-3-3z" fill="${colors.bg}"/>
        </svg>`
      case 'EMS':
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
          <path d="M12 6l-2 4h4l-2-4z" fill="${colors.bg}"/>
        </svg>`
      case 'Fire':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
          </svg>`
      default:
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="white"/>
          <path d="M12 6v6l4 2" stroke="${colors.bg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    }
  }
  
  return L.divIcon({
    className: `unit-marker`,
    html: `
      <div class="unit-marker-container">
        <div class="unit-marker-core" style="background: ${colors.bg}; border-color: ${colors.border};">
          ${getUnitIcon()}
        </div>
        <div class="unit-label" style="background: ${colors.bg}; color: ${colors.text};">
          <span>${Math.floor(eta)}:${Math.floor((eta % 1) * 60).toString().padStart(2, '0')}</span>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

// Routing component to draw lines between units and caller
function RoutingLines({ policeUnits }: { 
  policeUnits: Array<{ id: string; lat: number; lng: number; status: string; path?: any }>
}) {
  const map = useMap()
  
  // Generate route lines for units that have a path
  const routeLines = policeUnits
    .filter(unit => unit.path && unit.path.coordinates)
    .map(unit => {
      // OSRM provides [lng, lat], Leaflet needs [lat, lng]
      const positions = unit.path.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])
      
      const color = unit.status === 'En Route' ? '#f97316' : '#3b82f6'
      const weight = unit.status === 'En Route' ? 4 : 3
      const opacity = unit.status === 'En Route' ? 0.8 : 0.6
      
      return (
        <Polyline
          key={unit.id}
          positions={positions}
          color={color}
          weight={weight}
          opacity={opacity}
          dashArray={unit.status === 'En Route' ? '10, 5' : '5, 5'}
        />
      )
    })
  
  return <>{routeLines}</>
}

// Enhanced map controls
function MapControls({ onZoomIn, onZoomOut, onCenter }: { 
  onZoomIn: () => void
  onZoomOut: () => void
  onCenter: () => void
}) {
  return (
    <div className="map-controls">
      <Button
        size="sm"
        variant="outline"
        className="map-control-btn"
        onClick={onZoomIn}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="map-control-btn"
        onClick={onZoomOut}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="map-control-btn"
        onClick={onCenter}
      >
        <Navigation className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Rename the current export to InteractiveMapComponent
const InteractiveMapComponent = function InteractiveMap({
  callerLocation,
  policeUnits,
  mapZoom,
  onZoomChange,
  darkMode = false
}: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [currentTime, setCurrentTime] = useState(Date.now())

  // UC Berkeley MLK Student Union coordinates
  const centerLocation = {
    lng: -122.2601,
    lat: 37.8697
  }

  // Update time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut()
    }
  }

  const handleCenterMap = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([centerLocation.lat, centerLocation.lng], 15, {
        duration: 2
      })
    }
  }

  const handleMapReady = () => {
    if (mapRef.current) {
      setMapLoaded(true)
      
      // Listen for zoom changes
      mapRef.current.on('zoomend', () => {
        onZoomChange(mapRef.current!.getZoom())
      })
    }
  }

  // Calculate total response time
  const totalResponseTime = Math.min(...policeUnits.map(unit => unit.eta))
  const activeUnits = policeUnits.filter(unit => unit.status === 'En Route' || unit.status === 'Dispatched')

  // Format time as MM:SS
  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes)
    const secs = Math.floor((minutes % 1) * 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[centerLocation.lat, centerLocation.lng]}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        whenReady={handleMapReady}
        zoomControl={false}
        ref={mapRef}
        className="enhanced-map"
      >
        {/* Clean Apple Maps-style tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />
        
        {/* Dark mode overlay */}
        {darkMode && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            opacity={0.8}
          />
        )}

        {/* Routing lines */}
        <RoutingLines policeUnits={policeUnits} />

        {/* Caller marker */}
        <Marker 
          position={[callerLocation.lat, callerLocation.lng]} 
          icon={createCallerIcon()}
        >
          <Popup className="enhanced-popup">
            <div className="caller-popup">
              <div className="popup-header emergency">
                <MapPin className="h-4 w-4" />
                <span>Emergency Call</span>
              </div>
              <div className="popup-content">
                <p className="address">{callerLocation.address}</p>
                <p className="accuracy">GPS Accuracy: {callerLocation.accuracy}m</p>
                <div className="response-info">
                  <div className="eta-display">
                    <Clock className="h-3 w-3" />
                    <span>ETA: {formatTime(totalResponseTime)}</span>
                  </div>
                  <div className="units-display">
                    <Car className="h-3 w-3" />
                    <span>{activeUnits.length} units responding</span>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Response unit markers */}
        {policeUnits.map((unit) => (
          <Marker
            key={unit.id}
            position={[unit.lat, unit.lng]}
            icon={createUnitIcon(unit.status, unit.eta, unit.type)}
          >
            <Popup className="enhanced-popup">
              <div className="unit-popup">
                <div className={`popup-header ${unit.status.toLowerCase().replace(' ', '-')}`}>
                  {unit.type === 'Police' && <Shield className="h-4 w-4" />}
                  {unit.type === 'EMS' && <Heart className="h-4 w-4" />}
                  {unit.type === 'Fire' && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>}
                  <span>{unit.id}</span>
                </div>
                <div className="popup-content">
                  <div className="status-badge">
                    <span className={`status ${unit.status.toLowerCase().replace(' ', '-')}`}>
                      {unit.status}
                    </span>
                  </div>
                  <div className="eta-info">
                    <Clock className="h-3 w-3" />
                    <span>ETA: {formatTime(unit.eta)}</span>
                  </div>
                  {unit.status === 'En Route' && (
                    <div className="route-info">
                      <span>🚗 En route to emergency</span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Enhanced controls */}
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onCenter={handleCenterMap}
        />
      </MapContainer>

      {/* Enhanced Map Legend */}
      <div className="map-legend">
        <div className="legend-header">
          <span>Response Units</span>
        </div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-marker emergency"></div>
            <span>Emergency Call</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker en-route"></div>
            <span>En Route ({policeUnits.filter(u => u.status === 'En Route').length})</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker dispatched"></div>
            <span>Dispatched ({policeUnits.filter(u => u.status === 'Dispatched').length})</span>
          </div>
        </div>
      </div>

      {/* Response Time Display */}
      <div className="response-time-display">
        <div className="time-header">
          <Clock className="h-4 w-4" />
          <span>Response Time</span>
        </div>
        <div className="time-value">
          <span className="minutes">{formatTime(totalResponseTime)}</span>
        </div>
      </div>

      {/* Enhanced CSS Styles */}
      <style jsx global>{`
        .enhanced-map {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        /* Caller Marker Styles */
        .caller-marker-container {
          position: relative;
          width: 48px;
          height: 48px;
        }

        .caller-pulse-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 48px;
          height: 48px;
          border: 3px solid #dc2626;
          border-radius: 50%;
          animation: pulse-ring 2s infinite;
          opacity: 0.6;
        }

        .caller-marker-core {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 24px;
          height: 24px;
          background: #dc2626;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
        }

        .caller-label {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: #dc2626;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 8px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        /* Unit Marker Styles */
        .unit-marker-container {
          position: relative;
          width: 40px;
          height: 40px;
        }

        .unit-marker-core {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }

        .unit-marker-core svg {
          width: 16px;
          height: 16px;
        }

        .unit-label {
          position: absolute;
          top: -6px;
          right: -2px;
          padding: 1px 4px;
          border-radius: 8px;
          font-size: 8px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          font-family: monospace;
        }

        /* Map Controls */
        .map-controls {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 1000;
        }

        .map-control-btn {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }

        .map-control-btn:hover {
          background: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        /* Enhanced Popups */
        .enhanced-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border: none;
          padding: 0;
        }

        .enhanced-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
          min-width: 200px;
        }

        .popup-header {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 16px 8px;
          font-weight: 600;
          font-size: 14px;
          border-bottom: 1px solid #f3f4f6;
        }

        .popup-header.emergency {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .popup-header.en-route {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .popup-header.dispatched {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .popup-content {
          padding: 12px 16px;
        }

        .address {
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
        }

        .accuracy {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .response-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .eta-display, .units-display {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #374151;
        }

        .status-badge {
          margin-bottom: 8px;
        }

        .status {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status.en-route {
          background: #fef3c7;
          color: #d97706;
        }

        .status.dispatched {
          background: #dbeafe;
          color: #2563eb;
        }

        .eta-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #374151;
          margin-bottom: 4px;
        }

        .route-info {
          font-size: 11px;
          color: #6b7280;
          font-style: italic;
        }

        /* Map Legend */
        .map-legend {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          z-index: 1000;
          min-width: 180px;
        }

        .legend-header {
          font-weight: 600;
          font-size: 12px;
          color: #374151;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .legend-items {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #6b7280;
        }

        .legend-marker {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .legend-marker.emergency {
          background: #dc2626;
        }

        .legend-marker.en-route {
          background: #f97316;
        }

        .legend-marker.dispatched {
          background: #3b82f6;
        }

        /* Response Time Display */
        .response-time-display {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          z-index: 1000;
          text-align: center;
        }

        .time-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .time-value {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 2px;
        }

        .time-value .minutes {
          font-size: 20px;
          font-weight: 700;
          color: #dc2626;
          font-family: monospace;
        }

        /* Animations */
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.6;
          }
        }

        /* Dark mode adjustments */
        .dark .map-legend,
        .dark .response-time-display {
          background: rgba(31, 41, 55, 0.95);
          border-color: rgba(75, 85, 99, 0.3);
        }

        .dark .legend-header {
          color: #d1d5db;
        }

        .dark .legend-item {
          color: #9ca3af;
        }

        .dark .time-header {
          color: #9ca3af;
        }
      `}</style>
    </div>
  )
}

// Export the component with dynamic import to prevent SSR issues
const DynamicInteractiveMap = dynamic(() => Promise.resolve(InteractiveMapComponent), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Loading map...</p>
      </div>
    </div>
  )
})

export default DynamicInteractiveMap 