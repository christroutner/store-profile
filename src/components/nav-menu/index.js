/*
  This component controlls the navigation menu.

  Inspired from this example:
  https://codesandbox.io/s/react-bootstrap-hamburger-menu-example-rnud4?from-embed
*/

// Global npm libraries
import React from 'react'
import { Nav, Navbar, Image } from 'react-bootstrap'
import Logo from './localtradelist01.png'

function NavMenu (props) {
  const handleClickEvent = (menuItem) => {
    // Pass the selected menu item up to the parent component.
    props.menuHandler(menuItem, props.appData)
  }

  return (
    <>
      <Navbar collapseOnSelect expand='xxxl' bg='dark' variant='dark' style={{ paddingRight: '20px' }}>
        <Navbar.Brand href='https://localtradelist.com' style={{ paddingLeft: '20px' }}>
          <Image src={Logo} thumbnail width='50' />{' '}
          Store Profile
        </Navbar.Brand>

        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='mr-auto'>
            <Nav.Link href='#' onClick={(e) => handleClickEvent(0)}>Store Profile</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default NavMenu
