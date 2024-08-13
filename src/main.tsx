import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.tsx'
import './index.css'
import { OutlineProvider } from '@dls-controls/cs-web-lib'

ReactDOM.render(
  <OutlineProvider>
    <App />
  </OutlineProvider>,
  document.getElementById('root')
)
