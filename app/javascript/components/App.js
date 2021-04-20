import React, { Component } from "react"
import mockCards from './mockData.js'
import mockBinders from './mockBinderSleeves.js'
import mockUsers from './mockUsers.js'
import mockRankings from'./mockRankings'
import AboutUs from './pages/AboutUs'
import CardShow from './pages/CardShow'
import ClaimBooster from './pages/ClaimBooster'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Rankings from './pages/Rankings'
import Splash from './pages/Splash'
import BinderShow from './pages/BinderShow'
import UserCardIndex from './pages/UserCardIndex'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import Header from "./components/Header.js"
import Footer from "./components/Footer.js"

class App extends Component{
  constructor(props){
    super(props)
    this.state = {
      cards: [],
      bindersleeves: [],
      users: mockUsers,
      rankings: mockRankings,
      isUserEligible: false
    }
  }

  componentDidMount(){
    if (this.props.current_user) {
      this.dailyCardEligibilityCheck(this.props.current_user.id)
    }
    this.binderIndex()
    this.cardIndex()
  }

  binderIndex = () => {
    fetch("http://127.0.0.1:3000/binders")
    .then(response => {
      return response.json()
    })
    .then(bindersleevesArray => {
      this.setState({ bindersleeves: bindersleevesArray })
    })
    .catch(errors => {
      console.log("index errors:", errors)
    })
  }

  dailyCardEligibilityCheck = (user_id) => {
    fetch(`http://127.0.0.1:3000/eligibility_check/${user_id}`)
    .then(response => {
      return response.json()
    })
    .then(isEligible => {
      console.log('dailyCardEligibilityCheck', isEligible)
      this.setState({ isUserEligible: isEligible })
    })
    .catch(errors => {
      console.log("index errors:", errors)
    })
  }

  claimDailyCard = (user_id) => {
    fetch(`http://127.0.0.1:3000/dailycard/${user_id}`, {
      method: "POST"
    })
    .then(response => {
      console.log('response', response)
      if(response.status === 422){
        alert("Something is wrong with your submission.")
      }
      return response.json()
    })
    .then(payload => {
      console.log('payload', payload)
      this.setState({ isUserEligible: false })
      this.binderIndex()
    })
    .catch(errors => {
      console.log("create errors:", errors)
    })
  }

  claimBoosterPack = (user_id) => {
    fetch(`http://127.0.0.1:3000/boosterpack/${user_id}`, {
      method: "POST"
    })
    .then(response => {
      console.log('response', response)
      if(response.status === 422){
        alert("Something is wrong with your submission.")
      }
      return response.json()
    })
    .then(payload => {
      console.log('payload', payload)
      this.binderIndex()
    })
    .catch(errors => {
      console.log("create errors:", errors)
    })
  }

  cardIndex = () => {
    fetch("http://127.0.0.1:3000/cards")
    .then(response => {
      return response.json()
    })
    .then(cardsArray => {
      this.setState({ cards: cardsArray })
    })
    .catch(errors => {
      console.log("index errors:", errors)
    })
  }

  render () {
    const {
      logged_in,
      sign_in_route,
      sign_out_route,
      new_user_route,
      current_user,
    } = this.props
    const { cards } = this.state
    return (
      <>
      <Router>
        {
        !( window.location.pathname === '/') && 
        
          <Header logged_in={logged_in}
            sign_in_route={sign_in_route}
            sign_out_route={sign_out_route}
            new_user_route={new_user_route}
            current_user={current_user}
            isUserEligible={this.state.isUserEligible}
            bindersleeves={this.state.bindersleeves}
            claimDailyCard={this.claimDailyCard}
            claimBoosterPack={this.claimBoosterPack}
          />
         } 
        <Switch>
          <Route exact path = "/" component={ Splash } />
          <Route path="/home" render={ (props) => <Home cards={ this.state.cards } /> } />
          <Route path = "/aboutus" component={ AboutUs } />
          <Route path = "/rankings" render= { (props)=> <Rankings rankings={ this.state.rankings }
          /> } />
          <Route path="/cardshow/:id" render = {(props) => {
            const id = +props.match.params.id
            const card = this.state.cards.find(card => card.id === id)
            return (<CardShow card={card}/>)}
            } />
          {/* <Route path= "/claimcard" component={ ClaimCard } /> */}
          <Route path= "/claimbooster" component={ ClaimBooster } />

          <Route
              path="/usercardindex"
              render={ (props) => {
                  const usersBinders = this.state.bindersleeves.filter(binder => {
                    return binder.user_id === current_user.id
                  })
                  return <UserCardIndex usersBinders={usersBinders} />
              }}
            />
          <Route path="/bindershow/:id" render = {(props) => {
            const id = +props.match.params.id
            const binder = this.state.bindersleeves.find(binder => binder.id === id)
            return (<BinderShow binder={binder}/>)}
            } />
          <Route component={ NotFound }/>
        </Switch>
        
        {/* // !( window.location.pathname === '/') &&  */}
        <Footer />
        
      </Router>
      </>
    );
  }
}

export default App
