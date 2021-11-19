import React, { useCallback, useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { marginTopDefault, okColor, warnColor, errorColor, pageStyle } from '../AppStyle';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { wifiClientsApi, wiredClientsApi, handleApiError } from '../api/apiHandler';
import { showGeneralError } from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ItemTextWithIcon from '../components/ItemTextWithIcon';

const DeviceList = props => {
  const [wiredClients, setWiredClients] = useState();
  const [loadingWiredClients, setLoadingWiredClients] = useState(false);
  const [wifiClients, setWifiClients] = useState();
  const [loadingWifiClients, setLoadingWifiClients] = useState(false);

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to becareful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      // TODO: Get the current accessPoint Id from state
      getWiredClients();
      getWifiClients();

      // Return function of what should be done on 'focus out'
      return () => {};
      // Disable the eslint warning, as we want to change only on navigation changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation]),
  );

  const getWiredClients = async accessPointToQuery => {
    if (!wiredClientsApi) {
      return;
    }

    try {
      if (!accessPointToQuery) {
        // If there is no access point to query, then clear the clients
        setWiredClients(null);
        return;
      }

      if (!wiredClients) {
        // Only set the loading flag is there is currently no information. If there is already
        // information consider this a refresh so no need to show the user.
        setLoadingWiredClients(true);
      }

      const response = await wiredClientsApi.getWiredClients(accessPointToQuery.id);
      console.log(response.data);
      if (response && response.data) {
        setWiredClients(response.data);
      } else {
        console.error('Invalid response from getWiredClients');
        showGeneralError(strings.errors.titleNetwork, strings.errors.invalidResponse);
      }
    } catch (error) {
      handleApiError(strings.errors.titleNetwork, error);
    } finally {
      setLoadingWiredClients(false);
    }
  };

  const getWifiClients = async accessPointToQuery => {
    if (!wifiClientsApi) {
      return;
    }

    try {
      if (!accessPointToQuery) {
        // If there is no access point to query, then clear the clients
        setWifiClients(null);
        return;
      }

      if (!wifiClients) {
        // Only set the loading flag is there is currently no information. If there is already
        // information consider this a refresh so no need to show the user.
        setLoadingWifiClients(true);
      }

      const response = await wifiClientsApi.getWifiClients(accessPointToQuery.id);
      console.log(response.data);
      if (response && response.data) {
        setWifiClients(response.data);
      } else {
        console.error('Invalid response from getWifiClients');
        showGeneralError(strings.errors.titleNetwork, strings.errors.invalidResponse);
      }
    } catch (error) {
      handleApiError(strings.errors.titleNetwork, error);
    } finally {
      setLoadingWifiClients(false);
    }
  };

  const getClientName = client => {
    if (!client) {
      return strings.messages.empty;
    }

    return client.name;
  };

  const getClientIcon = client => {
    return require('../assets/laptop-solid.png');
  };

  const getClientIconTint = client => {
    // Random choice for the moment, until the actual device parsing is implemented
    let choice = Math.floor(Math.random() * 10) % 3;

    switch (choice) {
      case 2:
        return errorColor;

      case 1:
        return warnColor;

      default:
      case 0:
        return okColor;
    }
  };

  const onClientPress = async client => {
    props.navigation.navigate('DeviceDetails', { clientDetails: client });
  };

  // Styles
  const componentStyles = StyleSheet.create({
    sectionAccordion: {
      marginTop: marginTopDefault,
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.deviceList.wiredClients}
            isLoading={loadingWiredClients}>
            {wiredClients &&
              wiredClients.map(item => {
                return (
                <ItemTextWithIcon
                  label={getClientName(item)}
                  key={item.macAddress}
                  icon={getClientIcon(item)}
                  iconTintColor={getClientIconTint(item)}
                  onPress={() => onClientPress(item)}
                  />
                );
              })}
          </AccordionSection>

          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.deviceList.wifiClients}
            isLoading={loadingWifiClients}>
            {wifiClients &&
              wifiClients.map(item => {
                return (
                <ItemTextWithIcon
                  label={getClientName(item)}
                  key={item.macAddress}
                  icon={getClientIcon(item)}
                  iconTintColor={getClientIconTint(item)}
                  onPress={() => onClientPress(item)}
                  />
                );
              })}
          </AccordionSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeviceList;
