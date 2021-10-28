import { StyleSheet } from 'react-native';
import { useStore } from './Store';

export function primaryColor() {
  let brandInfo = useStore.getState().brandInfo;

  if (brandInfo && brandInfo.primaryColor) {
    return brandInfo.primaryColor;
  }

  return '#2194f3';
}

export function primaryColorStyle() {
  return StyleSheet.create({
    color: primaryColor(),
  });
}

export const pageStyle = StyleSheet.create({
  container: {
    // Layout
    flexDirection: 'column',
    flexWrap: 'nowrap',
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'center',
    // Content
    padding: 34,
    backgroundColor: '#eeeeee',
    // Base Text
    fontSize: 14,
    fontWeight: 'bold',
    color: '#101010',
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
    width: '100%',
    marginBottom: 10,
  },
  inputText: {
    // Layout
    height: 40,
    width: '100%',
    marginBottom: 10,
    paddingLeft: 8,
    paddingRight: 8,
    // Background and Border
    backgroundColor: '#ffffff',
    borderColor: '#bbbbbb',
    borderWidth: 1,
    // Text
    textAlign: 'left',
  },
  buttonText: {
    textAlign: 'center',
  },
});
