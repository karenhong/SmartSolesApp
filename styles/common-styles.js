import {StyleSheet} from 'react-native';
import SSColors from './colors';

/**
 * TODO @Peijia
 * Styles elements shared between many pages can be defined here
 * For specific style components, create a new js file in this folder and define a new stylesheet
 */
const commonStyles = StyleSheet.create({
  // TODO: left as example. None of these are currently used, please remove when defining your own
  body: {
    backgroundColor: SSColors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: SSColors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: SSColors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: SSColors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default commonStyles;
