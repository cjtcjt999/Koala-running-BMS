import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import App from './App'
import Login from './pages/login'
import Admin from './admin'
import DashBoard from './pages/dashBoard'
import UserInfo from './pages/user/userInfo'
import AdminInfo from './pages/user/adminInfo'
import BmCompleted from './pages/order/bm/bmCompleted'
import BmProgress from './pages/order/bm/bmProgress'
import BmRequest from './pages/order/bm/bmRequest'
import DnCompleted from './pages/order/dn/dnCompleted'
import DnProgress from './pages/order/dn/dnProgress'
import DnRequest from './pages/order/dn/dnRequest'
import Address from './pages/address'
import Feedback from './pages/feedback'
import Cashout from './pages/cashout'
import Nomatch from './pages/nomatch'

export default class Router extends React.Component {
  render() {
    return (
      <HashRouter>
        <App>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/admin" render={() => 
              <Admin>
                <Switch>
                  <Route path="/admin/dashBoard" component={DashBoard} />
                  <Route path="/admin/user/userInfo" component={UserInfo} />
                  <Route path="/admin/user/adminInfo" component={AdminInfo} />
                  <Route path="/admin/order/bm/completed" component={BmCompleted} />
                  <Route path="/admin/order/bm/progress" component={BmProgress} />
                  <Route path="/admin/order/bm/request" component={BmRequest} />
                  <Route path="/admin/order/dn/completed" component={DnCompleted} />
                  <Route path="/admin/order/dn/progress" component={DnProgress} />
                  <Route path="/admin/order/dn/request" component={DnRequest} />
                  <Route path="/admin/address" component={Address} />
                  <Route path="/admin/feedback" component={Feedback} />
                  <Route path="/admin/cashout" component={Cashout} />
                  <Route component={Nomatch} />
                </Switch>
              </Admin>
            } />
            <Redirect path="/" to="/login" exact={true}/>
          </Switch>
        </App>
      </HashRouter>
    )
  }
}
