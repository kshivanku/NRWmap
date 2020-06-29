import React from "react";
import {useState, useEffect} from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import Tabletop from 'tabletop';
import Source from '../components/Source'
import './index.css'

const IndexPage = () => {

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 23.8859,
    longitude: 45.0792,
    zoom: 2
  })

  const [selectedCountry, setSelectedCountry] = useState(null)

  const setBackgroundColor = (nrw) => {
    if(nrw < 20) {
      return "#47CF73"
    } else if (nrw >= 40) {
      return "#FF3C41"
    } else {
      return "#FCD000"
    }
  }

  const setMarkerSize = (pop) => {
    
  }

  const [data, setData] = useState([]);

  useEffect(()=> {
    Tabletop.init({
      key: '1YvbT0-2VkS3cNYpwkgiQBzB0UMfsS-DTmbo-vsmoy48',
      callback: googleData => {
        console.log('google sheet data --->', googleData);
        setData(googleData)
      },
      simpleSheet: true
    })

    const listener = (e) => {
      if(e.key === "Escape") {
        setSelectedCountry(null)
      }
    }

    window.addEventListener("keydown", listener)

  }, [])

  return (
    <>
      <ReactMapGL 
        {...viewport} 
        mapboxApiAccessToken={process.env.GATSBY_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/kshivanku/ck4vr9icb2z261clkwtwf076v"
        onViewportChange = {nextViewport => setViewport(nextViewport)}
      >
        {data.map(item => (
          <Marker
            key={item["Supplied population"]}
            latitude = {Number(item.latitude)}
            longitude = {Number(item.longitude)}
          >
            <button
              className = "marker" 
              style={{
                // width: `${Number(item["Supplied population"])/10000000}px`,
                // height: `${Number(item["Supplied population"])/10000000}px`,
                // borderRadius: `${Number(item["Supplied population"])/10000000}px`,
                backgroundColor:`${setBackgroundColor(Number(item['Level of NRW %']))}`
              }}
              onClick = {() => {
                setSelectedCountry(item)
              }}
            >
            </button>
          </Marker>
        ))}
        {selectedCountry && (
          <Popup
            latitude = {Number(selectedCountry.latitude)}
            longitude = {Number(selectedCountry.longitude)}
            onClose = {() => setSelectedCountry(null)}
          >
            <div className="popup">
              <h1>{selectedCountry.Country}</h1>
              <ul>
                <li>
                  <p className="key">Level of NRW %: </p>
                  <p className="value">{selectedCountry["Level of NRW %"]}</p>
                </li>
                <li>
                  <p className="key">% of urban population using piped water: </p>
                  <p className="value">{selectedCountry["% of urban population using piped water"]}</p>
                </li>
                <li>
                  <p className="key">Supplied population: </p>
                  <p className="value">{selectedCountry["Supplied population"]}</p>
                </li>
                <li>
                  <p className="key">Free from contamination: </p>
                  <p className="value">{selectedCountry["Free from contamination"]}</p>
                </li>
                <li>
                  <p className="key">Available when needed: </p>
                  <p className="value">{selectedCountry["Available when needed"]}</p>
                </li>
              </ul>
            </div>
          </Popup>
        )}
      </ReactMapGL>
      <Source />
    </>
  );
}

export default IndexPage
