import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import routes from "./routes";
import withTracker from "./withTracker";

import "bootstrap/dist/css/bootstrap.min.css";
import "./asset/styles/shards-dashboards.1.1.0.min.css";



export default () => {
  const [title,updateTitle] = useState('Home'); 
  const login_datails = localStorage.getItem('userInfo');
  useEffect(() => {
    document.title = `2TigersLCC-${title}`;
  })
   return(
          <Router basename={process.env.REACT_APP_BASENAME || ""}>
            <div>
              {routes.map((route, index) => {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={withTracker(props => {
                      updateTitle(route.page)
                      return (
                        <route.layout {...props}>
                          <route.component {...props} />
                        </route.layout>
                      );
                    })}
                  />
                );
              })}
            </div>
          </Router>
        );
    }
