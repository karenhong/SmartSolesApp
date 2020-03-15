import React from 'react';

import ExerciseHeader from './header';
import ExerciseCard from './exercise-card';

import {FlatList, Text} from 'react-native';
import {Container} from 'native-base';

const exercises = [
  {
    text: 'Tippy Toes',
    name: 'One',
  },
  {
    text: 'Card One',
    name: 'One',
  },
];

class ExercisePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: exercises,
    };
  }

  render() {
    return (
      <Container>
        <ExerciseHeader />
        <FlatList
          horizontal
          data={this.state.data}
          renderItem={({item: rowData}) => {
            return (
              <ExerciseCard
                title={null}
                image={{uri: rowData.imageUrl}}>
                <Text style={{marginBottom: 10}}>{rowData.title}</Text>
              </ExerciseCard>
            );
          }}
          keyExtractor={(item, index) => index}
        />
      </Container>
    );
  }
}

export default ExercisePage;
