// adapted from https://www.linkedin.com/learning/react-native-essential-training/

import React from 'react';
import {View, Text, Animated, Easing, Dimensions, StyleSheet,} from 'react-native';
import ajax from './ajax';
import DealList from './DealList';
import DealDetail from './DealDetail';
import SearchBar from './SearchBar';

class App extends React.Component {
  state = {
    deals: [],
    dealsFromSearch: [],
    currentDealId: null,
    activeSearchTerm: '',
  };

  // animation upon opening app, text moves from side to side
  titleXPos = new Animated.Value(0);
  animateTitle = (direction = 1) => {
    const width = Dimensions.get('window').width - 150;
    Animated.timing(this.titleXPos, {
      toValue: direction * (width / 2),
      duration: 1000,
      easing: Easing.ease,
    }).start(({finished}) => {
      if (finished) {
        this.animateTitle(-1 * direction);
      }
    });
  };

  // animate the title until deals has been initialized with all deals
  async componentDidMount() {
    this.animateTitle();
    const deals = await ajax.fetchInitialDeals(); 
    this.setState({ deals });
  }

  // if anything has been entered in the search bar, initialize dealsFromSearch with results
  searchDeals = async (searchTerm) => {
    let dealsFromSearch = [];
    if (searchTerm) {
      dealsFromSearch = await ajax.fetchDealSearchResults(searchTerm);
    }
    this.setState({ dealsFromSearch, activeSearchTerm: searchTerm });
  };

  setCurrentDeal = (dealId) => {
    this.setState({
      currentDealId: dealId,
    });
  };

  unsetCurrentDeal = () => {
    this.setState({
      currentDealId: null,
    });
  };

  currentDeal = () => {
    return this.state.deals.find((deal) => deal.key === this.state.currentDealId);
  };

  render() {
    if (this.state.currentDealId) {
      return (
        <View style={styles.main}>
          <DealDetail
            initialDealData={this.currentDeal()}
            onBack={this.unsetCurrentDeal}
          />
        </View>
      );
    }

    // if search deals exist, show those, otherwise show all deals
    // should improve this by displaying "no results" when a search has no results
    const dealsToDisplay = (this.state.dealsFromSearch.length > 0) ? this.state.dealsFromSearch : this.state.deals;
    // ((this.state.dealsFromSearch === 0 && this.state.activeSearchTerm.length > 0) || (this.state.dealsFromSearch.length)) > 0 ? this.state.dealsFromSearch : this.state.deals;

    
    if (dealsToDisplay.length > 0) {
      return (
        <View style={styles.main}>
          <SearchBar
            searchDeals={this.searchDeals}
            initialSearchTerm={this.state.activeSearchTerm}
          />
          <DealList deals={dealsToDisplay} onItemPress={this.setCurrentDeal} />
        </View>
      );
    }

    return (
      <Animated.View style={[{ left: this.titleXPos }, styles.container]}>
        <Text style={styles.header}>Bakesale</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    marginTop: 30,
  },
  header: {
    fontSize: 40,
  },
});

export default App;