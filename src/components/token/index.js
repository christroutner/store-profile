/*
  Component for looking up a token by its token ID
*/

// Global npm libraries
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap'

// Local libraries
import TokenIcon from './token-icon.js'
import JsonDisplay from './json-display.js'
import StoreInfo from './store-info'

// class TokenView extends React.Component {
//   constructor (props) {
//     super(props)

function TokenView (props) {
  const appData = props.appData

  // State for this component
  const [iconUrl, setIconUrl] = useState(null)
  const [iconLink, setIconLink] = useState('')
  const [immutableData, setImmutableData] = useState(null)
  const [mutableData, setMutableData] = useState(null)
  const [genesisData, setGenesisData] = useState(null)
  const [textInput, setTextInput] = useState(appData.tokenId)
  const [status, setStatus] = useState('')

  // Startup state
  const [asyncInitStarted, setAsyncInitStarted] = useState(false)

  const explorerData = {
    iconUrl,
    setIconUrl,
    iconLink,
    setIconLink,
    immutableData,
    setImmutableData,
    mutableData,
    setMutableData,
    genesisData,
    setGenesisData,
    textInput,
    setTextInput,
    status,
    setStatus,
    asyncInitStarted,
    setAsyncInitStarted
  }
  appData.explorerData = explorerData

  useEffect(() => {
    async function init () {
      if (!asyncInitStarted) {
        try {
          setAsyncInitStarted(true)

          // If the query parameter passed in a token ID, the process it.
          if (textInput) {
            handleGetTokenData(appData)
          }
        } catch (err) {
          // Top level function. Do not throw an error.
          console.error('Error in token/index.js useEffect(): ', err)
        }
      }
    }
    init()
  })

  return (

    <>
      <Container>
        <Row>
          <Col className='text-break' style={{ textAlign: 'center' }}>
            <Form>
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label>Enter the Store's Token ID to pull up the profile for that Store:</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0'
                  onChange={e => setTextInput(e.target.value)}
                  value={textInput}
                  onKeyPress={e => handleEnter(e, appData)}
                />
              </Form.Group>

              <Button variant='primary' onClick={e => handleUpdateUrl(appData)}>
                Lookup Store
              </Button>
            </Form>
          </Col>
        </Row>
        <br />

        <Row>
          <Col style={{ textAlign: 'center' }}>
            {status}
          </Col>
        </Row>
        <br />

        <TokenIcon iconUrl={iconUrl} iconLink={iconLink} />
        
        <StoreInfo appData={appData} />

        <Row>
          <Col>
            <h2>Token Metadata</h2>
          </Col>
        </Row>

        <JsonDisplay header='Immutable Data' jsonData={immutableData} />
        <JsonDisplay header='Mutable Data' jsonData={mutableData} />
        <JsonDisplay header='Genesis Data & Token Stats' jsonData={genesisData} />
      </Container>
    </>
  )
}

// Prevents reloading of the page if the user hits the enter button while
// typeing in the form.
function handleEnter (event, appData) {
  if (event.key === 'Enter') {
    event.preventDefault()
    // this.handleGetTokenData()
    handleUpdateUrl(appData)
  }
}

// Update the URL so that the token ID is loaded through a query parameter.
function handleUpdateUrl (appData) {
  const textInput = appData.explorerData.textInput

  window.location.href = `/?tokenid=${textInput}`
}

async function handleGetTokenData (appData) {
  try {
    // Try to get the Token ID from the form input first.
    let textInput = appData.textInput
    // If form is empty, get Token ID from query parameter in URL.
    if (!textInput) textInput = appData.tokenId
    // If they are both empty, then exit this function.
    if (!textInput) return
    console.log('handleGetTokenData() textInput: ', textInput)
    console.log('appData.tokenId: ', appData.tokenId)

    // Initialize state
    appData.explorerData.setStatus(<span>Retrieving token data... <Spinner animation='border' /></span>)
    appData.explorerData.setIconUrl(null)
    appData.explorerData.setImmutableData(null)
    appData.explorerData.setMutableData(null)
    appData.explorerData.setGenesisData(null)

    // const tokenData1 = await this.state.wallet.getTokenData(textInput)
    // console.log(`tokenData1: ${JSON.stringify(tokenData1, null, 2)}`)

    const tokenData2 = await appData.wallet.getTokenData2(textInput)
    console.log(`tokenData2: ${JSON.stringify(tokenData2, null, 2)}`)

    // Render the token icon if it exists.
    if (tokenData2.optimizedTokenIcon) {
      // this.useState({ iconUrl: tokenData2.optimizedTokenIcon })
      appData.explorerData.setIconUrl(tokenData2.optimizedTokenIcon)
    } else if (tokenData2.tokenIcon) {
      // this.useState({ iconUrl: tokenData2.tokenIcon })
      appData.explorerData.setIconUrl(tokenData2.tokenIcon)
    } else {
      // this.useState({ iconUrl: '' })
      appData.explorerData.setIconUrl('')
    }

    // Add a link to the token icon if it exists
    if (tokenData2.optimizedFullSizedUrl) {
      // this.useState({ iconLink: tokenData2.optimizedFullSizedUrl })
      appData.explorerData.setIconLink(tokenData2.optimizedFullSizedUrl)
    } else if (tokenData2.fullSizedUrl) {
      // this.useState({ iconLink: tokenData2.fullSizedUrl })
      appData.explorerData.setIconLink(tokenData2.fullSizedUrl)
    } else {
      // this.useState({ iconLink: '' })
      appData.explorerData.setIconLink('')
    }

    // Render the immutable data if it exists
    if (tokenData2.immutableData) {
      // Attempt to parse JSON in the user Data
      try {
        tokenData2.immutableData.userData = JSON.parse(tokenData2.immutableData.userData)
      } catch (err) {
        /* exit quietly */
      }

      // Attempt to parse the jsonLd data
      try {
        tokenData2.immutableData.jsonLd = JSON.parse(tokenData2.immutableData.jsonLd)
      } catch (err) {
        /* exit quietly */
      }

      // this.useState({ immutableData: tokenData2.immutableData })
      appData.explorerData.setImmutableData(tokenData2.immutableData)
    }

    // Render the mutable data if it exists
    if (tokenData2.mutableData) {
      // Attempt to parse JSON in the user Data
      try {
        tokenData2.mutableData.userData = JSON.parse(tokenData2.mutableData.userData)
      } catch (err) {
        /* exit quietly */
      }

      // Attempt to parse the jsonLd data
      try {
        tokenData2.mutableData.jsonLd = JSON.parse(tokenData2.mutableData.jsonLd)
      } catch (err) {
        /* exit quietly */
      }

      // this.useState({ mutableData: tokenData2.mutableData })
      appData.explorerData.setMutableData(tokenData2.mutableData)
    }

    // Render the genesis data
    if (tokenData2.tokenStats) {
      // this.useState({ genesisData: tokenData2.tokenStats })
      appData.explorerData.setGenesisData(tokenData2.tokenStats)
    }

    appData.explorerData.setStatus('Done!')
  } catch (err) {
    appData.explorerData.setStatus(<p><b>Error</b>: {`${err.message}`}</p>)
  }
}

export default TokenView
