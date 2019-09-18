import React from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";

export default class UserActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      redirect:false,
      information:JSON.parse(localStorage.getItem('userInfo'))
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
  }

  logout = () => {
    localStorage.clear();
    this.setState({redirect:true});
  }

  toggleUserActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    if(this.state.redirect){
      return <Redirect to='login' />
    }
    if(this.state.information === 'undefined'){
      return <Redirect to='login' />
    }
    return (
      <NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
        <DropdownToggle
          style={{ cursor: 'pointer' }}
          caret
          tag={NavLink}
          className="text-nowrap px-3"
        >
          <img
            className="user-avatar rounded-circle mr-2"
            src={require('./../../../../images/avatars/0.jpg')}
            alt="User Avatar"
          />{' '}
          <span className="d-none d-md-inline-block">
            {this.state.information != null
              ? this.state.information.name
              : null}
          </span>
        </DropdownToggle>
        <Collapse tag={DropdownMenu} right small open={this.state.visible}>
          <DropdownItem tag={Link} to="profile">
            <i className="material-icons">&#xE7FD;</i> Profile
          </DropdownItem>
          {this.state.information.admin_role === 1?( <DropdownItem tag={Link} to="transaction">
            <i className="material-icons">&#xE896;</i> Transactions
          </DropdownItem>):null  }

          <DropdownItem divider />
          <DropdownItem onClick={this.logout} className="text-danger">
            <i className="material-icons text-danger">&#xE879;</i> Logout
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }
}
