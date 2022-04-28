import React, {useContext, useRef, useEffect, useState} from 'react';
import {StyleSheet, View, DeviceEventEmitter} from 'react-native';
import Header from '../addressPicker/Header';
import {Text, withTheme} from 'react-native-elements';
import {appStyles} from '../../../../styles/styles';
import ContainButton from '../../../../components/button/ContainButton';
import RadioForm, {
  RadioButtonInput,
  RadioButton,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {strings} from '../../../../locales/i18n';
import {postData, getData} from '../../../../utils/api';
import {
  BASE_URL,
  CONFIRM_ORDER,
  INITIALIZE_ORDER,
  ON_CONFIRM_ORDER,
  ON_INITIALIZE_ORDER,
  SIGN_PAYLOAD,
} from '../../../../utils/apiUtilities';
import {Context as AuthContext} from '../../../../context/Auth';
import {CartContext} from '../../../../context/Cart';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {showInfoToast, showToastWithGravity} from '../../../../utils/utils';
import {alertWithOneButton} from '../../../../utils/alerts';
import HyperSdkReact from 'hyper-sdk-react';

const heading = strings('main.cart.checkout');
const buttonTitle = strings('main.cart.next');
const addressTitle = strings('main.cart.address');
const paymentOptionsTitle = strings('main.cart.payment_options');

const paymentOptions = [
  {value: 0, label: 'JusPay'},
  {value: 1, label: 'Cash on delivery'},
];

/**
 * Component to payment screen in application
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const Payment = ({navigation, theme, route: {params}}) => {
  const {colors} = theme;
  const {selectedAddress, confirmationList} = params;
  const {cart, storeList, clearCart} = useContext(CartContext);
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);
  const {
    state: {token},
  } = useContext(AuthContext);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(0);
  const [initializeOrderInProgrss, setInitializeOrderInprogress] =
    useState(false);
  const [confirmOrderInProgrss, setConfirmOrderInprogress] = useState(false);
  const {handleApiError} = useNetworkErrorHandling();
  const orderRef = useRef();

  console.log(HyperSdkReact);

  const onOrderSuccessfull = () => {
    clearCart();
    storeList(null);
    navigation.navigate('Dashboard');
  };

  const onInitializeOrder = messageIdArray => {
    const messageIds = messageIdArray.toString();
    let order = setInterval(async () => {
      try {
        const {data} = await getData(
          `${BASE_URL}${ON_INITIALIZE_ORDER}messageIds=${messageIds}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        setOrders(orders);
        orderRef.current = data;
      } catch (error) {
        handleApiError(error);
      }
    }, 2000);
    setTimeout(() => {
      clearInterval(order);
      setInitializeOrderInprogress(false);
      const ordersArray = orderRef.current;
      if (ordersArray) {
        const errorObj = ordersArray.find(item => item.hasOwnProperty('error'));
        if (errorObj) {
          showToastWithGravity('Something went wrong.Please try again');
        } else {
          setConfirmOrderInprogress(false);
          showInfoToast('Order Initialized!');
        }
      } else {
        showToastWithGravity('Something went wrong.Please try again');
      }
    }, 11000);
  };

  const onConfirmOrder = messageIdArray => {
    const messageIds = messageIdArray.toString();
    let order = setInterval(async () => {
      try {
        const {data} = await getData(
          `${BASE_URL}${ON_CONFIRM_ORDER}messageIds=${messageIds}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        const errorObj = data.find(item => item.hasOwnProperty('error'));
        setError(errorObj);
      } catch (error) {
        handleApiError(error);
        setError(error);
        setConfirmOrderInprogress(false);
      }
    }, 2000);
    setTimeout(() => {
      clearInterval(order);

      if (!error) {
        setConfirmOrderInprogress(false);
        alertWithOneButton(null, 'Place Order', 'Ok', onOrderSuccessfull);
      } else {
        showToastWithGravity('Something went wrong.Please try again');
      }
    }, 10000);
  };

  const initializeOrder = async () => {
    try {
      setInitializeOrderInprogress(true);
      let payload = [];
      let providerIdArray = [];

      confirmationList.forEach(item => {
        const index = providerIdArray.findIndex(
          one => one === item.provider.id,
        );
        if (index > -1) {
          let itemObj = {
            id: item.id,
            quantity: {
              count: item.quantity.selected.count,
            },
            product: {
              id: item.id,
              descriptor: item.provider.descriptor,
              price: item.price,
              provider_name: item.provider.descriptor.name,
            },
            bpp_id: item.bpp_id,
            provider: {
              id: item.provider.id,
              locations: ['el'],
              //   locations: location,
            },
          };
          payload[index].message.items.push(itemObj);
        } else {
          let payloadObj = {
            context: {transaction_id: item.transaction_id},
            message: {
              items: [
                {
                  id: item.id,
                  quantity: {
                    count: item.quantity.selected.count,
                  },
                  product: {
                    id: item.id,
                    descriptor: item.provider.descriptor,
                    price: item.price,
                    provider_name: item.provider.descriptor.name,
                  },
                  bpp_id: item.bpp_id,
                  provider: {
                    id: item.provider ? item.provider.id : item.id,
                    locations: ['el'],
                    //   locations: location,
                  },
                },
              ],
              billing_info: {
                address: {
                  door: selectedAddress.address.door
                    ? selectedAddress.address.door
                    : selectedAddress.address.street,
                  country: 'IND',
                  city: selectedAddress.address.city,
                  street: selectedAddress.address.street,
                  area_code: selectedAddress.address.area_code,
                  state: selectedAddress.address.state,
                  building: selectedAddress.address.building
                    ? selectedAddress.address.building
                    : selectedAddress.address.street,
                },
                phone: selectedAddress.descriptor.phone,
                name: selectedAddress.descriptor.name,
                email: selectedAddress.descriptor.email,
              },
              delivery_info: {
                type: 'HOME-DELIVERY',
                name: selectedAddress.descriptor.name,
                phone: selectedAddress.descriptor.phone,
                email: selectedAddress.descriptor.email,
                location: {
                  address: {
                    door: selectedAddress.address.door
                      ? selectedAddress.address.door
                      : selectedAddress.address.street,
                    country: 'IND',
                    city: selectedAddress.address.city,
                    street: selectedAddress.address.street,
                    area_code: selectedAddress.address.area_code,
                    state: selectedAddress.address.state,
                    building: selectedAddress.address.building
                      ? selectedAddress.address.building
                      : selectedAddress.address.street,
                  },
                },
              },
            },
          };

          payload.push(payloadObj);
          providerIdArray.push(item.provider.id);
        }
      });
      const {data} = await postData(`${BASE_URL}${INITIALIZE_ORDER}`, payload, {
        headers: {Authorization: `Bearer ${token}`},
      });
      let messageIds = [];
      data.forEach(item => {
        if (item.message.ack.status === 'ACK') {
          messageIds.push(item.context.message_id);
        }
      });

      onInitializeOrder(messageIds);
    } catch (error) {
      handleApiError(error);

      setInitializeOrderInprogress(false);
    }
  };

  const onHyperEvent = resp => {
    var data = JSON.parse(resp);
    var event = data.event || '';
    switch (event) {
      case 'show_loader':
        // show some loader here
        break;
      case 'hide_loader':
        // hide the loader
        break;
      case 'initiate_result':
        var payload = data.payload || {};
        console.log('initiate_result: ', payload);
        // merchant code

        break;
      case 'process_result':
        var payload = data.payload || {};
        console.log('process_result: ', payload);
        // merchant code

        break;
      default:
        console.log('Unknown Event', data);
    }
  };

  const confirmOrder = async () => {
    const options = {
      headers: {Authorization: `Bearer ${token}`},
    };
    if (selectedPaymentOption === 1) {
      try {
        if (orderRef.current && orderRef.current.length > 0) {
          const errorObj = orderRef.current.find(one =>
            one.hasOwnProperty('error'),
          );
          if (!errorObj) {
            setConfirmOrderInprogress(true);
            const payload = [];
            orderRef.current.forEach(item => {
              const itemsArray = [];
              item.message.order.items.forEach(object => {
                const element = cart.find(one => one.id === object.id);

                object.id = element.id;
                object.bpp_id = item.context.bpp_id;
                object.product = {
                  id: element.id,
                  descriptor: element.descriptor,
                  price: element.price,
                  name: element.provider,
                };
                object.provider = {
                  id: item.message.order.provider.id,
                  locations: [item.message.order.provider_location.id],
                };
                itemsArray.push(object);
              });

              const payloadObj = {
                context: {
                  transaction_id: item.context.transaction_id,
                },
                message: {
                  items: itemsArray,
                  billing_info: item.message.order.billing,
                  delivery_info: {
                    type: item.message.order.fulfillment.type,
                    phone: item.message.order.fulfillment.end.contact.phone,
                    email: item.message.order.fulfillment.end.contact.email,
                    name: item.message.order.billing.name,
                    location: item.message.order.fulfillment.end.location,
                  },
                  payment: {
                    paid_amount: item.message.order.payment.params.amount,
                    status: 'PAID',
                    transaction_id: item.context.transaction_id,
                  },
                },
              };
              payload.push(payloadObj);
            });

            const {data} = await postData(
              `${BASE_URL}${CONFIRM_ORDER}`,
              payload,
              {
                headers: {Authorization: `Bearer ${token}`},
              },
            );
            let messageIds = [];
            data.forEach(item => {
              if (item.message.ack.status === 'ACK') {
                messageIds.push(item.context.message_id);
              }
            });

            onConfirmOrder(messageIds);
          } else {
            showToastWithGravity('Something went wrong.Please try again');
          }
        } else {
          showToastWithGravity('Something went wrong.Please try again');
        }
      } catch (error) {
        handleApiError(error);
        setConfirmOrderInprogress(false);
      }
    } else {
      try {
        const {data} = await postData(
          `${BASE_URL}${SIGN_PAYLOAD}`,
          {
            payload: {
              customer_id: '1234567890',
              mobile_number: 9234567890,
              email_address: 'test@gmail.com',
            },
          },
          options,
        );
        console.log(data);
        HyperSdkReact.createHyperServices();
        const initiatePayload = {
          service: 'in.juspay.hyperpay',
          payload: {
            action: 'initiate',
            merchantId: 'ONDC',
            clientId: 'ONDC',
            environment: 'sandbox',
          },
        };
        HyperSdkReact.initiate(JSON.stringify(initiatePayload));
        DeviceEventEmitter.addListener('HyperEvent', resp => {
          onHyperEvent(resp);
        });
        const payload = {
          requestId: '8cbc3fad-8b3f-40c0-ae93-2d7e75a8624a',
          service: 'in.juspay.hyperpay',
          payload: {
            action: 'paymentPage',
            merchantId: 'ONDC',
            clientId: 'ONDC',
            orderId: 'd9b10dfa-013d-4480-a30b-7dcd4d50d59c',
            amount: '9',
            customerId: '6YyrDeuLRkR8tJXFP1TsDHcj2BI2',
            customerEmail: 'vrushali@mailinator.com',
            customerMobile: '7745049011',
            orderDetails:
              '{"order_id":"d9b10dfa-013d-4480-a30b-7dcd4d50d59c","amount":"9","customer_id":"6YyrDeuLRkR8tJXFP1TsDHcj2BI2","merchant_id":"ONDC","customer_email":"vrushali@mailinator.com","customer_phone":"7745049011","return_url":"return_url":"https://buyer-app.ondc.org/application/checkout","timestamp":"1571922200845"}',
            signature: data.signedPayload,
            merchantKeyId: '5992',
            language: 'english',
            environment: 'sandbox',
          },
        };
        if (HyperSdkReact.isInitialised()) {
          HyperSdkReact.process(JSON.stringify(payload));
          DeviceEventEmitter.addListener('HyperEvent', resp => {
            onHyperEvent(resp);
          });
        } else {
          //Intialise hyperInstance
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    initializeOrder()
      .then(() => {})
      .catch(() => {});
  }, []);

  return (
    <View
      style={[appStyles.container, {backgroundColor: colors.backgroundColor}]}>
      <Header title={heading} navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.text}>{addressTitle}</Text>
        <View style={styles.addressContainer}>
          <Text>
            {selectedAddress.address.street}, {selectedAddress.address.locality}
            , {selectedAddress.address.city}, {selectedAddress.address.state} -{' '}
            {selectedAddress.address.area_code}
          </Text>
        </View>

        <Text style={styles.text}>{paymentOptionsTitle}</Text>
        <View style={styles.addressContainer}>
          <RadioForm animation={true}>
            {paymentOptions.map((obj, i) => (
              <RadioButton
                labelHorizontal={true}
                key={i}
                style={styles.buttonStyle}>
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={i === selectedPaymentOption}
                  borderWidth={1}
                  buttonSize={12}
                  buttonInnerColor={colors.accentColor}
                  buttonOuterColor={colors.accentColor}
                  buttonOuterSize={20}
                  onPress={index => {
                    setSelectedPaymentOption(index);
                  }}
                />
                <RadioButtonLabel
                  obj={obj}
                  index={i}
                  labelHorizontal={true}
                  labelStyle={[styles.labelStyle, {color: colors.black}]}
                />
              </RadioButton>
            ))}
          </RadioForm>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ContainButton
          title={buttonTitle}
          onPress={confirmOrder}
          loading={confirmOrderInProgrss}
        />
      </View>
    </View>
  );
};

export default withTheme(Payment);

const styles = StyleSheet.create({
  container: {padding: 15},
  text: {fontSize: 18, fontWeight: '600'},
  buttonContainer: {width: 300, alignSelf: 'center'},
  addressContainer: {marginVertical: 15},
  labelStyle: {fontSize: 16, fontWeight: '400'},
  buttonStyle: {marginBottom: 10},
});
