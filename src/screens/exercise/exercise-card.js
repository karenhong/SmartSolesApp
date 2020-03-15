import React, {Component} from 'react';
import {Image, Row, Grid} from 'react-native';
import SSColors from '../../styles/colors';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  H2,
  H3,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';

export default class ExerciseCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Content>
          <Card>
            <CardItem cardBody>
              <Image
                source={this.props.imageUrl}
                style={{height: 200, width: 500, flex: 1}}
              />
            </CardItem>
            <CardItem>
              <H2>{this.props.title}</H2>
            </CardItem>
            <CardItem>
              <H3 style={{backgroundColor: SSColors.lighter}}>
                {this.props.type}
              </H3>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
