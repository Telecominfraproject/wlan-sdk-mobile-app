import {StyleSheet} from 'react-native';

export const page = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 24,
  },
  text: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export const pageItem = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
});
