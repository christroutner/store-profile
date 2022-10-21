/*
  Component for looking up a token by its token ID
*/

// Global npm libraries
import React from 'react'
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap'

// Local libraries
import TokenIcon from './token-icon.js'
import JsonDisplay from './json-display.js'

class TokenView extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      balance: '',
      textInput: '',
      wallet: props.wallet,

      // Token data. Initialized with placeholder values.
      iconUrl: null,
      immutableData: null,
      mutableData: null,
      genesisData: null
    }

    // Bind 'this' to event handlers
    this.handleGetTokenData = this.handleGetTokenData.bind(this)

    // _this = this
  }

  render () {
    return (

      <>
        <Container>
          <Row>
            <Col className='text-break' style={{ textAlign: 'center' }}>
              <Form>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Enter a Token ID to lookup the token data:</Form.Label>
                  <Form.Control type='text' placeholder='38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0' onChange={e => this.setState({ textInput: e.target.value })} />
                </Form.Group>

                <Button variant='primary' onClick={this.handleGetTokenData}>
                  Lookup Token
                </Button>
              </Form>
            </Col>
          </Row>
          <br />

          <Row>
            <Col style={{ textAlign: 'center' }}>
              {this.state.balance}
            </Col>
          </Row>
          <br />

          <TokenIcon iconUrl={this.state.iconUrl} />
          <JsonDisplay header='Immutable Data' jsonData={this.state.immutableData} />
          <JsonDisplay header='Mutable Data' jsonData={this.state.mutableData} />
          <JsonDisplay header='Genesis Data & Token Stats' jsonData={this.state.genesisData} />
        </Container>
      </>
    )
  }

  async handleGetTokenData (event) {
    try {
      const textInput = this.state.textInput

      // Exit on invalid input
      // if (!textInput) return
      // if (!textInput.includes('bitcoincash:')) return

      this.setState({
        balance: (<span>Retrieving token data... <Spinner animation='border' /></span>),
        tokenIcon: null,
        immutableData: null,
        mutableData: null,
        genesisData: null
      })

      // const tokenData1 = await this.state.wallet.getTokenData(textInput)
      // console.log(`tokenData1: ${JSON.stringify(tokenData1, null, 2)}`)

      const tokenData2 = await this.state.wallet.getTokenData2(textInput)
      console.log(`tokenData2: ${JSON.stringify(tokenData2, null, 2)}`)

      // Render the token icon if it exists.
      if (tokenData2.tokenIcon) {
        this.setState({ iconUrl: tokenData2.tokenIcon })
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

        this.setState({ immutableData: tokenData2.immutableData })
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

        this.setState({ mutableData: tokenData2.mutableData })
      }

      // Render the genesis data
      if (tokenData2.tokenStats) {
        this.setState({ genesisData: tokenData2.tokenStats })
      }

      this.setState({
        balance: 'Done!'
      })
    } catch (err) {
      this.setState({
        balance: (<p><b>Error</b>: {`${err.message}`}</p>)
      })
    }
  }
}

export default TokenView
