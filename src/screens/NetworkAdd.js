import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import { marginTopDefault, pageStyle, pageItemStyle, paddingHorizontalDefault } from '../AppStyle';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { selectCurrentAccessPointId, selectSubscriberInformation } from '../store/SubscriberInformationSlice';
import { handleApiError } from '../api/apiHandler';
import { addNetwork } from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';
import ItemPickerWithLabel from '../components/ItemPickerWithLabel';

const NetworkAdd = props => {
  // The sectionZIndex is used to help with any embedded picker/dropdown. Start with a high enough
  // value that it'll cover each section. The sections further up the view should have higher numbers
  var sectionZIndex = 20;
  // Need to use refs so that the async tasks can have proper access to these state changes
  const scrollRef = useRef();
  // States
  const [loading, setLoading] = useState(false);
  const [wifiNetworkType, setWifiNetworkType] = useState();
  const [wifiNetworkName, setWifiNetworkName] = useState();
  const [wifiNetworkPassword, setWifiNetworkPassword] = useState();
  const [wifiNetworkEncryption, setWifiNetworkEncryption] = useState();
  const [wifiNetworkBands, setWifiNetworkBands] = useState([]);
  const currentAccessPointId = useSelector(selectCurrentAccessPointId);
  const subscriberInformation = useSelector(selectSubscriberInformation);

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

      console.log(networkJsonObject);

      setLoading(true);

      await addNetwork(subscriberInformation, currentAccessPointId, networkJsonObject);

      // On success just go back
      props.navigation.goBack();
    } catch (error) {
      setLoading(false);

      handleApiError(strings.errors.titleNetwork, error);
      // Need to throw the error to ensure the caller cleans up
      throw error;
    } finally {
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
              items={[
                { label: strings.network.selectorTypeMain, value: 'main' },
                { label: strings.network.selectorTypeGuest, value: 'guest' },
              ]}
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
            />
            <ItemPickerWithLabel
              key="bands"
              label={strings.network.bands}
              value={wifiNetworkBands}
              setValue={setWifiNetworkBands}
              multiple={true}
              items={[
                { label: strings.network.selectorBands2g, value: '2G' },
                { label: strings.network.selectorBands5g, value: '5G' },
                { label: strings.network.selectorBands5gl, value: '5GL' },
                { label: strings.network.selectorBands5gu, value: '5GU' },
                { label: strings.network.selectorBands6g, value: '6G' },
              ]}
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
