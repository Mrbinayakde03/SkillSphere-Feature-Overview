import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';

export const PublicLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
