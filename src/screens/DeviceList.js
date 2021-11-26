import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import { marginTopDefault, pageStyle, whiteColor } from '../AppStyle';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { wifiClientsApi, wiredClientsApi, handleApiError, wifiNetworksApi } from '../api/apiHandler';
import {
  showGeneralError,
  displayValue,
  getClientIcon,
  getClientConnectionIcon,
  getClientConnectionStatusColor,
} from '../Utils';
import { selectCurrentAccessPoint } from '../store/SubscriberSlice';
import AccordionSection from '../components/AccordionSection';
import ItemTextWithIcon from '../components/ItemTextWithIcon';
import WifiNetworkSelector from '../components/WifiNetworkSelector';

const DeviceList = props => {
  const accessPoint = useSelector(selectCurrentAccessPoint);
  const [wifiNetworks, setWifiNetworks] = useState([
    {
      type: 'main',
      name: 'main network',
      password: 'string',
      encryption: 'string',
      bands: ['2G'],
    },
    {
      type: 'second',
      name: '2ndnetwork',
      password: 'string',
      encryption: 'string',
      bands: ['2G'],
    },
    // {
    //   type: 'third',
    //   name: '3rd',
    //   password: 'string',
    //   encryption: 'string',
    //   bands: ['2G'],
    // },
  ]);
  const [wiredClients, setWiredClients] = useState([{ name: 'teasdas', macAddress: 'asdada234242' }]);
  const [loadingWiredClients, setLoadingWiredClients] = useState(false);
  const [wifiClients, setWifiClients] = useState();
  const [loadingWifiClients, setLoadingWifiClients] = useState(false);

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to becareful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      getWifiNetworks(accessPoint);
      getWiredClients(accessPoint);
      getWifiClients(accessPoint);

      // Return function of what should be done on 'focus out'
      return () => {};
      // Disable the eslint warning, as we want to change only on navigation changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation, accessPoint]),
  );

  const getWifiNetworks = async accessPointToQuery => {
    if (!wifiNetworksApi) {
      return;
    }

    try {
      if (!accessPointToQuery) {
        // If there is no access point to query, then clear the wifi networks as well
        setWifiNetworks(null);
        return;
      }

      const response = await wifiNetworksApi.getWifiNetworks(accessPointToQuery.id, false);

      if (!response || !response.data) {
        console.log(response);
        console.error('Invalid response from getWifiNetworks');
        showGeneralError(strings.errors.titleDeviceList, strings.errors.invalidResponse);
        return;
      }

      console.log(response.data);
      setWifiNetworks(response.data);
    } catch (error) {
      handleApiError(strings.errors.titleDeviceList, error);
    }
  };

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
      if (!response || !response.data) {
        console.log(response);
        console.error('Invalid response from getWiredClients');
        showGeneralError(strings.errors.titleDeviceList, strings.errors.invalidResponse);
        return;
      }

      console.log(response.data);
      setWiredClients(response.data);
    } catch (error) {
      handleApiError(strings.errors.titleDeviceList, error);
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
      if (!response || !response.data) {
        console.log(response);
        console.error('Invalid response from getWifiClients');
        showGeneralError(strings.errors.titleDeviceList, strings.errors.invalidResponse);
        return;
      }

      console.log(response.data);
      setWifiClients(response.data);
    } catch (error) {
      handleApiError(strings.errors.titleDeviceList, error);
    } finally {
      setLoadingWifiClients(false);
    }
  };

  const getClientName = client => {
    return displayValue(client, 'name');
  };

  const getClientMainIcon = client => {
    return getClientIcon(client);
  };

  const getClientBadgeIcon = client => {
    return getClientConnectionIcon(client);
  };

  const getClientBadgeIconTint = client => {
    return getClientConnectionStatusColor(client);
  };

  const onClientPress = async client => {
    props.navigation.navigate('DeviceDetails', { accessPoint: accessPoint, client: client });
  };

  const onSelectNetwork = network => {
    console.log('onSelectNetwork', network);
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
          <WifiNetworkSelector networks={wifiNetworks} onSelect={onSelectNetwork} />

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
                    icon={getClientMainIcon(item)}
                    badgeSource={getClientBadgeIcon(item)}
                    badgeTintColor={whiteColor}
                    badgeBackgroundColor={getClientBadgeIconTint(item)}
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
                    icon={getClientMainIcon(item)}
                    badgeSource={getClientBadgeIcon(item)}
                    badgeTintColor={whiteColor}
                    badgeBackgroundColor={getClientBadgeIconTint(item)}
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
