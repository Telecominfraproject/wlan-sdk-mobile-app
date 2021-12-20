import React, { useMemo, useState, useRef, useEffect } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { marginTopDefault, paddingHorizontalDefault, borderRadiusDefault, pageStyle, whiteColor } from '../AppStyle';
import { StyleSheet, SafeAreaView, ScrollView, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectCurrentAccessPointId,
  selectSubscriberInformationLoading,
  selectIpReservations,
  selectSubscriberDevices,
} from '../store/SubscriberInformationSlice';
import { handleApiError } from '../api/apiHandler';
import {
  displayValue,
  displayEditableValue,
  getSubscriberDeviceIndexForMac,
  getClientName,
  getClientIcon,
  getClientConnectionIcon,
  getClientConnectionStatusColor,
  addSubscriberIpReservation,
  deleteSubscriberIpReservation,
  modifySubscriberDevice,
} from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ImageWithBadge from '../components/ImageWithBadge';
import ItemTextWithLabel from '../components/ItemTextWithLabel';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';
import ItemColumnsWithValues from '../components/ItemColumnsWithValues';

const DeviceDetails = props => {
  // Route Params
  const { accessPoint, client, network } = props.route.params;
  // Need to use refs so that the async tasks can have proper access to these state changes
  const isMounted = useRef(false);
  // Selectors
  const currentAccessPointId = useSelector(selectCurrentAccessPointId);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const ipReservations = useSelector(selectIpReservations);
  const subscriberDevices = useSelector(selectSubscriberDevices);
  // State
  const [loading, setLoading] = useState(false);
  // Memo
  const subscriberDeviceIndex = useMemo(
    () => getSubscriberDeviceIndexForMac(subscriberDevices, client ? client.macAddress : null),
    [subscriberDevices, client],
  );
  const subscriberDevice = useMemo(() => {
    if (subscriberDevices !== null && subscriberDeviceIndex !== null) {
      return subscriberDevices.devices[subscriberDeviceIndex];
    }
    // TODO test data
    else {
      return {
        name: 'ABC Phone',
        description: 'string',
        macAddress: '8035c1567c97',
        manufacturer: 'string',
        firstContact: 0,
        lastContact: 0,
        group: 'string',
        icon: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        suspended: true,
        ip: 'string',
        created: 0,
        modified: 0,
        schedule: {
          description: 'Parental Controls',
          created: 0,
          modified: 0,
          schedule: [
            {
              description: 'Friday Schedule',
              day: 'Friday',
              rangeList: ['800-1200', '1300-2400'],
            },
            {
              description: 'Saturday Schedule',
              day: 'Saturday',
              rangeList: ['1000-2400'],
            },
          ],
        },
      };
    }
  }, [subscriberDevices, subscriberDeviceIndex]);

  // Keep track of whether the screen is mounted or not so async tasks know to access state or not.
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const getDeviceIcon = () => {
    return getClientIcon(client);
  };

  const getDeviceBadgeIcon = () => {
    return getClientConnectionIcon(client);
  };

  const getDeviceBadgeStatusColor = () => {
    return getClientConnectionStatusColor(client);
  };

  const isReserved = () => {
    if (findIpReservationIndex(client ? client.macAddress : null) !== null) {
      return true;
    }

    return false;
  };

  const findIpReservationIndex = macAddress => {
    if (!macAddress) {
      return null;
    }

    let clientMacAddress = macAddress.replace(/[:-]/g, '');

    if (clientMacAddress && ipReservations.reservations) {
      let ipReservationIndex = ipReservations.reservations.findIndex(reservation => {
        let reservationMacAddress = reservation.macAddress ? reservation.macAddress.replace(/[:-]/g, '') : null;
        return reservationMacAddress === clientMacAddress;
      });

      if (ipReservationIndex >= 0) {
        return ipReservationIndex;
      }
    }

    return null;
  };

  const onPauseUnpauseButtonLabel = () => {
    if (subscriberDevice && subscriberDevice.suspended) {
      return strings.buttons.unpause;
    }

    return strings.buttons.pause;
  };

  const updateSubscriberDeviceValue = async value => {
    try {
      if (!subscriberDevice) {
        // Make sure to include the mac address if there is no current subscriber deivce
        // as we are going to add a new one
        value.macAddress = client.macAddress;
      }

      await modifySubscriberDevice(currentAccessPointId, subscriberDeviceIndex, value);
    } catch (error) {
      handleApiError(strings.errors.titleSettingUpdate, error);

      // Need to throw the error to ensure the caller cleans up
      throw error;
    }
  };

  const onPauseUnpausePress = async () => {
    // Swap the current suspend state, or just mark it paused if there isn't one currently
    updateSubscriberDeviceValue({ suspended: subscriberDevice ? !subscriberDevice.suspended : true });
  };

  const getConnectionType = () => {
    if ('ssid' in client) {
      return strings.deviceDetails.connectionTypeWifi;
    } else {
      return strings.deviceDetails.connectionTypeWired;
    }
  };

  const getNetwork = () => {
    let name = network.name ?? '';
    let speed = client ? `(${client.rssi ?? client.speed})` : '';
    return `${name} ${speed}`;
  };

  const onReserveIpv4Press = async () => {
    onReserve(client.ipv4);
  };

  const onReserveIpv6Press = async () => {
    onReserve(client.ipv6);
  };

  const onReserve = async ipAddress => {
    try {
      if (!client) {
        return;
      }

      let reservationJsonObject = {
        ipAddress: ipAddress,
        macAddress: client.macAddress,
        nickname: getClientName(client, subscriberDevices),
      };

      setLoading(true);

      await addSubscriberIpReservation(currentAccessPointId, reservationJsonObject);
    } catch (error) {
      handleApiError(strings.errors.titleSettingUpdate, error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const onUnreservePress = async () => {
    try {
      setLoading(true);

      let ipReservationIndex = findIpReservationIndex(client ? client.macAddress : null);
      if (!ipReservationIndex) {
        throw new Error(strings.errors.internal);
      }

      await deleteSubscriberIpReservation(currentAccessPointId, ipReservationIndex);
    } catch (error) {
      handleApiError(strings.errors.titleSettingUpdate, error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // Styles
  const componentStyles = StyleSheet.create({
    sectionDevice: {
      marginTop: marginTopDefault,
      height: 96,
      paddingHorizontal: paddingHorizontalDefault,
      borderRadius: borderRadiusDefault,

      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: whiteColor,
    },
    sectionDeviceIcon: {
      height: 75,
      width: 75,
    },
    sectionDeviceText: {
      flex: 2,
      fontSize: 18,
      marginHorizontal: paddingHorizontalDefault,
    },
    sectionAccordion: {
      marginTop: marginTopDefault,
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPostLogin}>
          <View style={componentStyles.sectionDevice}>
            <ImageWithBadge
              style={componentStyles.sectionDeviceIcon}
              source={getDeviceIcon()}
              badgeSource={getDeviceBadgeIcon()}
              badgeTintColor={whiteColor}
              badgeBackgroundColor={getDeviceBadgeStatusColor()}
              badgeSize="large"
            />
            <Text style={componentStyles.sectionDeviceText}>{getClientName(client, subscriberDevices)}</Text>
            <ButtonStyled
              title={onPauseUnpauseButtonLabel()}
              type="outline"
              onPress={onPauseUnpausePress}
              size="small"
              disabled={!client}
            />
          </View>

          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.deviceDetails.connectionDetails}
            disableAccordion={true}
            isLoading={subscriberInformationLoading}>
            <ItemTextWithLabel
              key="status"
              label={strings.deviceDetails.status}
              value={strings.deviceDetails.connected}
            />
            <ItemTextWithLabel key="type" label={strings.deviceDetails.connectionType} value={getConnectionType()} />
            <ItemTextWithLabel key="type" label={strings.deviceDetails.network} value={getNetwork()} />
          </AccordionSection>

          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.deviceDetails.deviceDetails}
            disableAccordion={true}
            isLoading={subscriberInformationLoading}>
            <ItemTextWithLabelEditable
              key="name"
              label={strings.common.name}
              value={displayEditableValue(subscriberDevice, 'name')}
              editKey="name"
              onEdit={updateSubscriberDeviceValue}
            />
            <ItemTextWithLabelEditable
              key="group"
              label={strings.deviceDetails.group}
              value={displayEditableValue(subscriberDevice, 'group')}
              editKey="group"
              onEdit={updateSubscriberDeviceValue}
            />
            <ItemTextWithLabelEditable
              key="description"
              label={strings.deviceDetails.description}
              value={displayEditableValue(subscriberDevice, 'description')}
              editKey="description"
              onEdit={updateSubscriberDeviceValue}
            />
            <ItemTextWithLabel
              key="manufacturer"
              label={strings.deviceDetails.manufacturer}
              value={displayValue(subscriberDevice, 'manufacturer')}
            />
            {isReserved() ? (
              <ItemTextWithLabel
                key="ipAddressReservedV4"
                label={strings.deviceDetails.ipAddressV4Reserved}
                value={displayValue(client, 'ipv4')}
                buttonTitle={strings.buttons.unreserve}
                onButtonPress={onUnreservePress}
                buttonLoading={loading}
              />
            ) : (
              <ItemTextWithLabel
                key="ipAddressV4"
                label={strings.deviceDetails.ipAddressV4}
                value={displayValue(client, 'ipv4')}
                buttonTitle={strings.buttons.reserve}
                onButtonPress={onReserveIpv4Press}
                buttonLoading={loading}
                buttonDisabled={!displayEditableValue(client, 'ipv4')}
              />
            )}
            {isReserved() ? (
              <ItemTextWithLabel
                key="ipAddressReservedV6"
                label={strings.deviceDetails.ipAddressV6Reserved}
                value={displayValue(client, 'ipv6')}
                buttonTitle={strings.buttons.unreserve}
                onButtonPress={onUnreservePress}
                buttonLoading={loading}
              />
            ) : (
              <ItemTextWithLabel
                key="ipAddressV6"
                label={strings.deviceDetails.ipAddressV6}
                value={displayValue(client, 'ipv6')}
                buttonTitle={strings.buttons.reserve}
                onButtonPress={onReserveIpv6Press}
                buttonLoading={loading}
                buttonDisabled={!displayEditableValue(client, 'ipv6')}
              />
            )}
            <ItemTextWithLabel
              key="macAddress"
              label={strings.deviceDetails.macAddress}
              value={displayValue(client, 'macAddress')}
            />
          </AccordionSection>

          <AccordionSection
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: 1 }])}
            title={strings.accessSchedule.accessSchedule}
            disableAccordion={true}
            isLoading={subscriberInformationLoading}
            showAdd={true}
            onAddPress={() => props.navigation.navigate('AccessSchedule')}>
            {subscriberDevice.schedule.schedule.length &&
              subscriberDevice.schedule.schedule.map((item, index) => {
                let result = [
                  <ItemColumnsWithValues
                    key={'schedule_' + index}
                    type="value"
                    values={[item.description]}
                    showDelete={true}
                    onDeletePress={() => {}}
                    showEdit={true}
                    onEditPress={() => props.navigation.navigate('AccessSchedule', { device: subscriberDevice, index })}
                  />,
                ];

                if (index === 0) {
                  // Add in a header to the start of the array if this is the first index
                  result.unshift(
                    <ItemColumnsWithValues
                      key="label"
                      type="label"
                      values={[strings.deviceDetails.description]}
                      showDelete={true}
                      showEdit={true}
                    />,
                  );
                }

                return result;
              })}
          </AccordionSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeviceDetails;
