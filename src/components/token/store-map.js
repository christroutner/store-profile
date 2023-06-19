/*
  Component to generate a Leaflet map with a pin of where the store
  is located.
*/

// Global npm libraries
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
// import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Generate a Leaflet map, centered on the store.
function StoreMap (props) {
  const appData = props.appData
  // console.log('appData: ', appData)

  try {
    const geo = appData.explorerData.mutableData.jsonLd.storeData.location.geo
    // console.log('geo: ', geo)

    const mapCenterLat = geo.latitude
    const mapCenterLong = geo.longitude
    const zoom = 8

    return (
      <>
        <MapContainer
          center={[mapCenterLat, mapCenterLong]}
          zoom={zoom}
          style={{ height: '70vh' }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          <Pin appData={appData} />

        </MapContainer>
      </>
    )
  } catch (err) {
    console.log('Error trying to retrieve map coordinates.')

    return null
  }
}

// Generate a pin icon on the map at the location defined in the store mutable data.
function Pin (props) {
  const appData = props.appData

  const map = useMap()
  // console.log('map: ', map)

  const geo = appData.explorerData.mutableData.jsonLd.storeData.location.geo
  const mapCenterLat = geo.latitude
  const mapCenterLong = geo.longitude

  const icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png'
  })

  const pin = L.marker([mapCenterLat, mapCenterLong], { id: 'store', icon })
  pin.addTo(map)
}

export default StoreMap
