import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Home from "./pages/home/Home";
import UserLayout from "./layouts/userlayouts/UserLayout";
import './App.css'

function App() {
    return (
        <UserLayout>
            <Home />
        </UserLayout>
    );
}

export default App;


