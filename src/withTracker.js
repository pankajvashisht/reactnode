import React, { Component } from "react";
import GoogleAnalytics from "react-ga";

import { Redirect } from "react-router-dom";
GoogleAnalytics.initialize(process.env.REACT_APP_GAID || "UA-115105611-2");

const withTracker = (WrappedComponent, options = {}) => {
  const trackPage = page => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    GoogleAnalytics.set({
      page,
      ...options
    });
    GoogleAnalytics.pageview(page);
  };

  const BASENAME = process.env.REACT_APP_BASENAME || "admin";

  // eslint-disable-next-line
  const HOC = class extends Component {
    state = {
        redriect:false
    }
    componentDidMount() {
      // eslint-disable-next-line
      const page = this.props.location.pathname + this.props.location.search;
      if(page !== '/login'){
        let login_datails = localStorage.getItem('userInfo');
        
        if (typeof login_datails === 'string') {
          login_datails = JSON.parse(localStorage.getItem('userInfo'));
        }
        if (login_datails === null) {
          console.log("pankaj");
          this.setState({redriect:true});
        }
      }
      trackPage(`${BASENAME}${page}`);
    }

    componentDidUpdate(prevProps) {
    
      const currentPage =
        prevProps.location.pathname + prevProps.location.search;
      const nextPage =
        this.props.location.pathname + this.props.location.search;

      if (currentPage !== nextPage) {
        trackPage(`${BASENAME}${nextPage}`);
      }
    }

    render() {
      if(this.state.redriect){
        return  <Redirect to="/login" />;
      }
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
};

export default withTracker;
