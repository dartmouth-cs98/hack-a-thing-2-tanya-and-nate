// adapted from https://www.linkedin.com/learning/react-native-essential-training/

import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import {TextInput, StyleSheet} from 'react-native';

class SearchBar extends React.Component {
  static propTypes = {
    searchDeals: PropTypes.func.isRequired,
    initialSearchTerm: PropTypes.string.isRequired,
  };
  state = {
    searchTerm: this.props.initialSearchTerm,
  };
  searchDeals = (searchTerm) => {
    this.props.searchDeals(searchTerm);
    this.inputElement.blur();
  }
  debouncedSearchDeals = debounce(this.searchDeals, 300);
  handleChange = (searchTerm) => {
    this.setState({ searchTerm }, () => {
      this.debouncedSearchDeals(this.state.searchTerm);
    });
  };

  render() {
    return (
      <TextInput
        ref={(inputElement) => { this.inputElement = inputElement; }}
        value={this.state.searchTerm}
        placeholder="Search"
        style={styles.input}
        onChangeText={this.handleChange}
      />
    );
  }
}

const styles = StyleSheet.create({
    input: {
      fontSize: 20,
      height: 40,
      marginHorizontal: 40,
    },
});

export default SearchBar;