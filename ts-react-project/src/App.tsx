import './App.css';
import React from 'react';
import './helpers/Animation.css';
import ShopPagesGen from './pages/ShopPagesGen';
import { ShopState } from './helpers/AppContext';
import UserProvider from './user_comp/UserContext';

function App() {

  return (
    <UserProvider>
      <ShopState>
        <ShopPagesGen />
      </ShopState>
    </UserProvider>
  );
}

export default App;