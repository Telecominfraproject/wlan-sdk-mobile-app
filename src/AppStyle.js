import {StyleSheet} from 'react-native';

export const pageStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'center',
    flex: 0,
    padding: 24,
  },
  text: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export const pageItemStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  containerButton: {
    height: 40,
    marginBottom: 10,
    minWidth: 200,
  },
  inputText: {
    height: 40,
    marginBottom: 10,
    width: '100%',
    borderBottomWidth: 1,
    textAlign: 'center',
  },
});
