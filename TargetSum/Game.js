import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, Button } from 'react-native';
import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';

class Game extends Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired
  };
  currentSum = 0
  gameStatus = 'PLAYING';
  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds
  };
  randomNumbers = Array.from({ length: this.props.randomNumberCount }).map(() => 1 + Math.floor(10 * Math.random()));
  target = this.randomNumbers.slice(0, this.props.randomNumberCount - 2).reduce((acc, curr) => acc + curr, 0);
  shuffledRandomNumbers = shuffle(this.randomNumbers);

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(
      (prevState) => {
          return { remainingSeconds: prevState.remainingSeconds - 1 };
        },
        () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.intervalId);
          }
        }
      );
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  isNumberSelected = numberIndex => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  selectNumber = numberIndex => {
    this.setState(prevState => ({
      selectedIds: [...prevState.selectedIds, numberIndex]
    }));
  };

  componentDidUpdate(nextProps, nextState) {
    if (nextState.selectedIds !== this.state.selectedIds || nextState.remainingSeconds == 0) {
      this.currentSum = this.calcCurrentSum();
      this.gameStatus = this.calcGameStatus();
    }
  }
  calcCurrentSum = () => {
    return this.state.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr];
      }, 0);
  }

  calcGameStatus = () => {
    const sumSelected = this.state.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr];
    }, 0);

    if (this.state.remainingSeconds === 0 || sumSelected > this.target) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    }
    if (sumSelected === this.target) {
      return 'WON';
    }
  };

  render() {
    const gameStatus = this.gameStatus;
    const currentSum = this.currentSum;
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>
        <View style={styles.randomContainer}>
          {this.shuffledRandomNumbers.map((randomNumber, index) => (
            <RandomNumber
              key={index}
              id={index}
              number={randomNumber}
              isDisabled={
                this.isNumberSelected(index) 
              }
              onPress={this.selectNumber}
            />
          ))}
        </View>
        {(this.gameStatus !== 'PLAYING' || this.state.remainingSeconds < 1) && (
            <Button title="Play Again" onPress={this.props.onPlayAgain} />
        )}
        {(this.gameStatus !== 'PLAYING' || this.state.remainingSeconds < 1) && (
            <Text style={styles.countdown}></Text>
        )}
        {(this.gameStatus !== 'PLAYING' || this.state.remainingSeconds < 1) && (
            <Text style={styles.countdown}></Text>
        )}

        {(this.gameStatus === 'PLAYING' && this.state.remainingSeconds !== 0) && (
            <Text style={styles.countdown}>
            Sum: {currentSum}
            </Text>
        )}

        {(this.gameStatus === 'PLAYING' && this.state.remainingSeconds !== 0) && (
            <Text style={styles.countdown}>
            Time: {this.state.remainingSeconds} seconds
            </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  countdown: {
    fontSize: 30,
    textAlign: 'center',
    margin: 60
  },
  target: {
    fontSize: 50,
    textAlign: 'center',
    margin: 80
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  STATUS_PLAYING: {
    backgroundColor: '#E4E4E4'
  },
  STATUS_WON: {
    backgroundColor: 'green'
  },
  STATUS_LOST: {
    backgroundColor: 'red'
  }
});

export default Game;