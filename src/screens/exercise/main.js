import React from 'react';

import ExerciseCard from './exercise-card';
import Paginator from './paginator';

import {Dimensions, View} from 'react-native';
import {Container, H3} from 'native-base';
import {Row, Grid} from 'react-native-easy-grid';
import SSColors from '../../styles/colors';

const exercises = [
  {
    title: 'Tippy-toes balance',
    type: 'Balance and Strengthening',
    imageUrl: require('../../../resources/exercises/tippy-toes-still.png'),
    videoUrl: 'https://www.youtube.com/watch?v=9hRRbq6wjKo',
  },
  {
    title: 'The Stork Step',
    type: 'Balance and Strengthening',
    imageUrl: require('../../../resources/exercises/stork-step-still.png'),
    videoUrl: 'https://www.youtube.com/watch?v=i0uao-VKw9Q',
  },
];

const itemWidth = Dimensions.get('window').width;

class ExercisePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: exercises,
    };
  }

  render() {
    return (
      <Container>
        <Grid>
          <Row size={1} style={{paddingLeft: 20, paddingTop: 20}}>
            <H3 style={{fontWeight: 'bold', color: SSColors.darkGray}}>
              Exercises
            </H3>
          </Row>
          <Row size={14}>
            <View style={{flex: 1}}>
              <Paginator
                data={this.state.exercises}
                renderItem={({item: rowData}) => {
                  return (
                    <View
                      style={{
                        width: itemWidth,
                        paddingTop: 20,
                        paddingLeft: 20,
                        paddingRight: 20,
                      }}>
                      <ExerciseCard
                        title={rowData.title}
                        imageUrl={rowData.imageUrl}
                        type={rowData.type}
                      />
                    </View>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                itemWidth={itemWidth}
              />
            </View>
          </Row>
          <Row size={1} />
        </Grid>
      </Container>
    );
  }
}

export default ExercisePage;
