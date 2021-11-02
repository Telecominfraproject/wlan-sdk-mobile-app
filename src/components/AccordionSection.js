import React, { useState } from 'react';
import { primaryColor, whiteColor } from '../AppStyle';
import { StyleSheet, TouchableOpacity, View, Text, Image, ActivityIndicator } from 'react-native';

const AccordionSection = props => {
  const [showChildren, setShowChildren] = useState(true);

  const getTitle = () => {
    return props.title;
  };

  const hasAccordion = () => {
    return props.disableAccordion ? false : true;
  };

  const getChildrenCount = () => {
    return React.Children.count(props.children);
  };

  const getCaretIcon = () => {
    return showChildren ? require('../assets/angle-down-solid.png') : require('../assets/angle-right-solid.png');
  };

  const onHeaderPress = async () => {
    showChildren ? setShowChildren(false) : setShowChildren(true);
  };

  const accordionSectionStyle = StyleSheet.create({
    container: {
      width: '100%',
    },
    touchableContainer: {
      width: '100%',
    },
    headerContainer: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      flex: 0,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 13,
      backgroundColor: primaryColor,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    headerEndContainer: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      flex: 0,
      alignItems: 'center',
    },
    headerText: {
      fontSize: 12,
      textTransform: 'uppercase',
      color: whiteColor,
    },
    headerCaret: {
      height: 16,
      width: 16,
      resizeMode: 'contain',
      tintColor: whiteColor,
    },
    itemsContainer: {
      backgroundColor: whiteColor,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      flexDirection: 'column',
      flexWrap: 'nowrap',
      width: '100%',
    },
  });

  return (
    <View style={accordionSectionStyle.container}>
      <TouchableOpacity
        style={accordionSectionStyle.touchableContainer}
        onPress={onHeaderPress}
        disabled={!hasAccordion()}>
        <View style={accordionSectionStyle.headerContainer}>
          <Text style={accordionSectionStyle.headerText}>{getTitle()}</Text>
          {hasAccordion() ? (
            <View style={accordionSectionStyle.headerEndContainer}>
              <Text style={accordionSectionStyle.headerText}>{getChildrenCount()}</Text>
              <Image style={accordionSectionStyle.headerCaret} source={getCaretIcon()} />
            </View>
          ) : (
            <View />
          )}
        </View>
      </TouchableOpacity>
      {props.isLoading ? (
        <View style={accordionSectionStyle.itemsContainer}>
          <ActivityIndicator size="large" color={primaryColor} animating={props.isLoading} />
        </View>
      ) : showChildren ? (
        <View style={accordionSectionStyle.itemsContainer}>{props.children}</View>
      ) : (
        <View />
      )}
    </View>
  );
};

export default AccordionSection;
