import React from 'react';
import { Sniper } from '../Sniper/Sniper';
import styles from './Home.scss';

export const Home = (): JSX.Element => {
  return (
    <div className={styles.container} data-tid="container">
      <h2>Home</h2>
      <Sniper />
    </div>
  );
};
