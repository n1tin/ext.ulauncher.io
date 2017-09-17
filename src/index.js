import React from 'react'
import ReactDOM from 'react-dom'
import App from './app/App'
import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import promiseMiddleware from 'redux-promise-middleware'
import { composeWithDevTools } from 'redux-devtools-extension'
import registerServiceWorker from './registerServiceWorker'
import reducer from './app/reducers'

import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './layout/css/animate.css'
import './layout/css/style.css'
import './layout/css/custom.css'

const store = createStore(reducer, composeWithDevTools(applyMiddleware(promiseMiddleware())))
const render = App => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}

render(App)
registerServiceWorker()

if (module.hot) {
  module.hot.accept('./app/App', () => {
    const NextApp = require('./app/App').default
    render(NextApp)
  })
}