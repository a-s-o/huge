import React from 'react';
import { getData } from '../../common/request';
import styles from './style.css';

export default class LandingPage extends React.Component {
   static displayName = 'LandingPage'

   componentWillMount () {
      console.log(
         '[LandingPage] will mount with server response: ',
         this.props.data.landing
      );
   }

   static fetchData (/*params*/) {
      return getData('/landing');
   }

   signUp = () => {
      alert('Sign Up!');
   }

   render () {
      let { title } = this.props.data.landing;

      return (
         <div className={styles.content}>
            <h1 className={styles.heading}>{title}</h1>
            <p className={styles.lead}>Create an account to get started!</p>
            <button
               className={styles.signUpButton}
               onClick={this.signUp}>Sign up</button>
         </div>
      );
   }
}
