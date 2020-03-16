import React from 'react';

import ExerciseHeader from './header';
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
  },
  {
    title: 'Something',
    type: 'Balance and Strengthening',
    imageUrl: require('../../../resources/exercises/temp.png'),
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
        <ExerciseHeader />
        <Grid style={{padding: 20}}>
          <Row size={1}>
            <H3 style={{fontWeight: 'bold', color: SSColors.darkGray}}>
              Exercises
            </H3>
          </Row>
          <Row size={10}>
            <View style={{flex: 1}}>
              <Paginator
                data={this.state.exercises}
                renderItem={({item: rowData}) => {
                  return (
                    <View
                      style={{
                        width: itemWidth,
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 20,
                      }}>
                      <ExerciseCard
                        title={rowData.title}
                        imageUrl={rowData.imageUrl}
                        type={rowData.type}
                      />
                    </View>
                  );
                }}
                keyExtractor={(item, index) => index}
                itemWidth={itemWidth}
              />
            </View>
          </Row>
            <Row size={2}/>
        </Grid>
      </Container>
    );
  }
}

export default ExercisePage;
