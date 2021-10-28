import {StyleSheet} from 'react-native';
import {useStore} from './Store';

export function primaryColor() {
  let brandInfo = useStore.getState().brandInfo;

  if (brandInfo && brandInfo.primaryColor) {
    return brandInfo.primaryColor;
  }

  return '#2194f3';
}

export function primaryColorStyle() {
  return {
    color: primaryColor(),
  };
}

export const pageStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    padding: 34,
    color: '#101010',
    fontWeight: 'bold',
    backgroundColor: '#eeeeee',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export const pageItemStyle = StyleSheet.create({
  title: {
    fontSize: 36,
    marginBottom: 14,
  },
  description: {
    fontSize: 14,
    marginBottom: 40,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  containerButton: {
    height: 40,
    marginBottom: 10,
    width: '100%',
  },
  inputText: {
    height: 40,
    marginBottom: 10,
    width: '100%',
    borderColor: '#bbbbbb',
    borderWidth: 1,
    textAlign: 'left',
    backgroundColor: '#ffffff',
    paddingLeft: 8,
    paddingRight: 8,
  },
  buttonText: {
    textAlign: 'center',
  },
});
