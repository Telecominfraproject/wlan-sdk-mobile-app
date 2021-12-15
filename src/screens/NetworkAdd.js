import React, { useState, useRef } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { marginTopDefault, pageStyle, pageItemStyle, paddingHorizontalDefault } from '../AppStyle';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectCurrentAccessPointId, selectWifiNetworks } from '../store/SubscriberInformationSlice';
import { handleApiError } from '../api/apiHandler';
import { getGuestNetworkIndex, getNetworkBandsSelectorItems, addNetwork } from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';
import ItemPickerWithLabel from '../components/ItemPickerWithLabel';

const NetworkAdd = props => {
  // The sectionZIndex is used to help with any embedded picker/dropdown. Start with a high enough
  // value that it'll cover each section. The sections further up the view should have higher numbers
  var sectionZIndex = 20;
  var pickerZIndex = 20;
  // Need to use refs so that the async tasks can have proper access to these state changes
  const scrollRef = useRef();
  // Selectors
  const currentAccessPointId = useSelector(selectCurrentAccessPointId);
  const wifiNetworks = useSelector(selectWifiNetworks);
  // States
  const [loading, setLoading] = useState(false);
  const [wifiNetworkType, setWifiNetworkType] = useState('main');
  const [wifiNetworkName, setWifiNetworkName] = useState();
  const [wifiNetworkPassword, setWifiNetworkPassword] = useState();
  const [wifiNetworkEncryption, setWifiNetworkEncryption] = useState('wpa2');
  const [wifiNetworkBands, setWifiNetworkBands] = useState([]);

  const hasGuestNetwork = () => {
    // Check to see if it has a guest network
    if (getGuestNetworkIndex(wifiNetworks) === null) {
      return false;
    } else {
      return true;
    }
  };

  const onCancelPress = () => {
    props.navigation.goBack();
  };

  const onSubmitPress = async () => {
    try {
      let networkJsonObject = {
        type: wifiNetworkType,
        name: wifiNetworkName,
        password: wifiNetworkPassword,
        encryption: wifiNetworkEncryption,
        bands: wifiNetworkBands,
      };

      setLoading(true);

      await addNetwork(currentAccessPointId, networkJsonObject);

      setLoading(false);

      // On success just go back
      props.navigation.goBack();
    } catch (error) {
      setLoading(false);

      handleApiError(strings.errors.titleNetwork, error);
      // Need to throw the error to ensure the caller cleans up
      throw error;
    }
  };

  // Styles
  const componentStyles = StyleSheet.create({
    sectionAccordion: {
      marginTop: marginTopDefault,
    },
    buttonLeft: {
      marginRight: paddingHorizontalDefault / 2,
      flex: 1,
    },
    buttonRight: {
      marginLeft: paddingHorizontalDefault / 2,
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView ref={scrollRef} contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPostLogin}>
          <AccordionSection
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: sectionZIndex-- }])}
            title={strings.network.settings}
            disableAccordion={true}
            isLoading={loading}>
            <ItemPickerWithLabel
              key="type"
              label={strings.network.type}
              value={wifiNetworkType}
              setValue={setWifiNetworkType}
              disabled={hasGuestNetwork()}
              items={[
                { label: strings.network.selectorTypeMain, value: 'main' },
                { label: strings.network.selectorTypeGuest, value: 'guest' },
              ]}
              zIndex={pickerZIndex--}
            />
            <ItemTextWithLabelEditable
              key="name"
              label={strings.network.name}
              value={wifiNetworkName}
              placeholder={strings.messages.empty}
              onEdit={setWifiNetworkName}
            />
            <ItemTextWithLabelEditable
              key="password"
              label={strings.network.password}
              value={wifiNetworkPassword}
              placeholder={strings.messages.empty}
              type="password"
              onEdit={setWifiNetworkPassword}
            />
            <ItemPickerWithLabel
              key="encryption"
              label={strings.network.encryption}
              value={wifiNetworkEncryption}
              setValue={setWifiNetworkEncryption}
              items={[
                { label: strings.network.selectorEncryptionWpa2, value: 'wpa2' },
                { label: strings.network.selectorEncryptionWpa, value: 'wpa' },
                { label: strings.network.selectorEncryptionWep, value: 'wep' },
              ]}
              zIndex={pickerZIndex--}
            />
            <ItemPickerWithLabel
              key="bands"
              label={strings.network.bands}
              value={wifiNetworkBands}
              setValue={setWifiNetworkBands}
              multiple={true}
              items={getNetworkBandsSelectorItems(null)}
              zIndex={pickerZIndex--}
            />
          </AccordionSection>

          <View style={pageItemStyle.containerButtons}>
            <ButtonStyled
              style={componentStyles.buttonLeft}
              title={strings.buttons.cancel}
              type="outline"
              onPress={onCancelPress}
            />
            <ButtonStyled
              style={componentStyles.buttonRight}
              title={strings.buttons.add}
              type="filled"
              onPress={onSubmitPress}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NetworkAdd;
