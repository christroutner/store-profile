/*
  Component that extracts store information from token mutable data, and renders
  the info onto the DOM.
*/

// Global npm libraries
import React from 'react'
import { Row, Col, Image } from 'react-bootstrap'

function StoreInfo(props) {
  const appData = props.appData

  if(!appData.explorerData.mutableData) {
    return null
  }

  const products = getProducts(appData)

  return (
    <>
      <Row>
        <Col>
          <h2>Store Information</h2>

          <p>
            <b>Name:</b> {appData.explorerData.mutableData.jsonLd.storeData.name}
          </p>

          <p>
            <b>Description:</b> {appData.explorerData.mutableData.jsonLd.storeData.description}
          </p>

          <p>
            <b>More Information Link:</b>{' '}
            <a
              href={appData.explorerData.mutableData.jsonLd.storeData.moreInfoLink}
              rel="noreferrer"
              target="_blank">
              {appData.explorerData.mutableData.jsonLd.storeData.moreInfoLink}
            </a>
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3>Products</h3>
        </Col>
      </Row>
      {products}
    </>
  )
}

// Turn an array of raw product data into an array of JSX objects.
function getProducts(appData) {
  try {
    const products = appData.explorerData.mutableData.jsonLd.storeData.products

    const outAry = []

    for(let i=0; i < products.length; i++) {
      const thisProduct = products[i]

      const jsxObj = (
        <div key={`product-${i}`}>
          <Row>
            <Col style={{padding: '10px'}}>
              <b>Name:</b> {thisProduct.name}
            </Col>
          </Row>
          <Row>
            <Col style={{padding: '10px'}}>
              <b>Description:</b> {thisProduct.desc}
              <br />
            </Col>
          </Row>
          {
            thisProduct.price ? (
              <Row>
                <Col>
                  <b>Price:</b> {thisProduct.price}
                </Col>
              </Row>
            ) : null
          }

          <Row>
            <Col>
              <Image fluid thumbnail src={thisProduct.imgUrl} />
            </Col>
          </Row>
          <br /><br />
        </div>
      )

      outAry.push(jsxObj)
    }

    return outAry
  } catch(err) {
    console.error('Error in getProducts(): ', err.message)
    throw err
  }
}

export default StoreInfo
