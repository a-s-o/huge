import React from "react";
import { Route, DefaultRoute, RouteHandler, Link } from "react-router";

import HomePage from "../pages/home/page";


export default class LoggedInRouter extends React.Component {

   static getRoutes () {
      return (
         <Route name="app" path="/" handler={LoggedInRouter}>
            <DefaultRoute name="home" handler={HomePage} />
         </Route>
      );
   }

   render () {
      return (
         <div id="container">
            <div id="navigation">
               <header>
                  <ul>
                     <li><Link to="home">Home</Link></li>
                  </ul>
               </header>
            </div>

            <RouteHandler {...this.props} />
         </div>
      );
   }

}
