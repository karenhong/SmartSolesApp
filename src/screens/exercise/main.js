import React from 'react';

import ExerciseHeader from './header';
import ExerciseCard from './exercise-card';

import {Container} from 'native-base';

class ExercisePage extends React.Component {
  render() {
    return (
      <Container>
        <ExerciseHeader />
        <ExerciseCard />
      </Container>
    );
  }
}

export default ExercisePage;
