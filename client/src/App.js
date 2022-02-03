import React from "react"
import { Redirect, Switch, withRouter } from "react-router-dom"
import "./App.css"
import { TransitionGroup, CSSTransition } from "react-transition-group"

import PublicRoute from "./components/routers/PublicRoute"
import AdminRoute from "./components/routers/AdminRoute"
import SimpleAuthRoute from "./components/routers/SimpleAuthRoute"
import PrivateRoute from "./components/routers/PrivateRoute"

import { LoginContainer } from "./components/pages/LoginPage/LoginContainer"
import { SignupContainer } from "./components/pages/SignupPage/SignupContainer"
import { WelcomeContainer } from "./components/pages/WelcomePage/WelcomeContainer"
import { HomeContainer } from "./components/pages/HomePage/HomeContainer"
import { FormContainer } from "./components/pages/FormPage/FormContainer"
import { EditProfileContainer } from "./components/pages/EditProfilePage/EditProfileContainer";
import { ResultsContainer } from "./components/pages/ResultsPage/ResultsContainer"
import { EditQuestionsContainer } from "./components/pages/EditQuestionsPage/EditQuestionsContainer"
import { EditTutorialsContainer } from "./components/pages/EditTutorialsPage/EditTutorialsContainer"
import { EditProductsContainer } from "./components/pages/EditProductsPage/EditProductsContainer"
import { ResultsAnalysisContainer } from "./components/pages/ResultsAnalysisPage/ResultsAnalysisContainer";

import MyNavBar from "./components/basicComponents/MyNavbar"
import MyFooter from "./components/basicComponents/MyFooter"



function App({ location }) {
  return (
    <div>
      <MyNavBar/>

      <TransitionGroup className="transition-group">
        <CSSTransition
          key={location.key}
          timeout={{ enter: 250, exit: 250 }}
          classNames={'fade'}
        >
          <section className="route-section">
            <Switch location={location}>
              <PublicRoute exact path="/" component={WelcomeContainer} />
              <PublicRoute path="/login" component={LoginContainer} />
              <PublicRoute  path="/signup" component={SignupContainer} />
              <PrivateRoute path="/home" component={HomeContainer} />
              <SimpleAuthRoute path="/diagnostic" component={FormContainer} />
              <SimpleAuthRoute path="/results" component={ResultsContainer} />
              <SimpleAuthRoute path="/edit_profile" component={EditProfileContainer} />
              <AdminRoute path="/edit_questions" component={EditQuestionsContainer} />
              <AdminRoute path="/edit_tutorials" component={EditTutorialsContainer} />
              <AdminRoute path="/edit_products" component={EditProductsContainer} />
              <AdminRoute path="/all_results" component={ResultsAnalysisContainer} />
              <Redirect from="*" to="/" />
            </Switch>     
          </section>
        </CSSTransition>
      </TransitionGroup>

      <MyFooter/>
    </div>

  )
}

export default withRouter(App)
