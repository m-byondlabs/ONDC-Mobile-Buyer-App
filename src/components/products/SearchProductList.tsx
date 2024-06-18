import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, StyleSheet, View} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import {useSelector} from 'react-redux';

import useBhashini from '../../hooks/useBhashini';
import useNetworkErrorHandling from '../../hooks/useNetworkErrorHandling';
import useNetworkHandling from '../../hooks/useNetworkHandling';
import useReadAudio from '../../hooks/useReadAudio';
import Product, {
  ProductModel,
} from '../../modules/main/provider/components/Product';
import Store, {StoreModel} from '../../modules/main/stores/components/Store';
import {API_BASE_URL, PRODUCT_SEARCH} from '../../utils/apiActions';
import {BRAND_PRODUCTS_LIMIT} from '../../utils/constants';
import {useAppTheme} from '../../utils/theme';
import {compareIgnoringSpaces, showToastWithGravity} from '../../utils/utils';

interface SearchProductList {
  searchQuery: string;
}

const CancelToken = axios.CancelToken;

const SearchProducts: React.FC<SearchProductList> = ({searchQuery}) => {
  const voiceDetectionStarted = useRef<boolean>(false);
  const navigation = useNavigation<any>();
  const productSearchSource = useRef<any>(null);
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const {language} = useSelector(({authReducer}) => authReducer);
  const {
    startVoice,
    userInteractionStarted,
    userInput,
    stopAndDestroyVoiceListener,
    setAllowRestarts,
  } = useReadAudio(language);
  const {
    withoutConfigRequest,
    computeRequestTransliteration,
    transliterationRequest,
  } = useBhashini();

  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [productsRequested, setProductsRequested] = useState<boolean>(false);
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [providers, setProviders] = useState<any[]>([]);

  const searchProducts = async (pageNumber: number) => {
    try {
      setProductsRequested(true);
      if (productSearchSource.current) {
        productSearchSource.current.cancel();
      }
      let query = searchQuery;
      productSearchSource.current = CancelToken.source();
      if (language !== 'en') {
        if (!transliterationRequest?.callbackUrl) {
          await withoutConfigRequest();
        }
        const searchResponse = await computeRequestTransliteration(query);
        query = searchResponse?.pipelineResponse[0]?.output[0]?.target;
      }
      let url = `${API_BASE_URL}${PRODUCT_SEARCH}?pageNumber=${pageNumber}&limit=${BRAND_PRODUCTS_LIMIT}&name=${query}`;
      const {data} = await getDataWithAuth(
        url,
        productSearchSource.current.token,
      );
      massageSearchResponse(data);
      setTotalProducts(data.response.count);
      setProducts(data.response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setProductsRequested(false);
    }
  };

  const massageSearchResponse = (data: any) => {
    const products = data.response.data;

    const providerSet = new Set();
    products
      .map((product: any) => product.provider_details)
      .forEach((provider: any) => {
        providerSet.add(provider);
      });

    providerSet.forEach((provider: any) => {
      const providerProducts = products.filter(
        (product: any) => product.provider_details.id === provider.id,
      );
      provider.products = providerProducts;
    });

    setProviders(Array.from(providerSet));

    // group products by provider

    return products;
  };

  const renderItem = useCallback(({item}) => {
    return <Product product={itemDetailsToProductModel(item)} search />;
  }, []);

  useEffect(() => {
    if (userInput.length > 0) {
      const input = userInput.toLowerCase();
      if (/^(select|choose)\b/i.test(input)) {
        const inputArray = input.split('from');
        const productName = inputArray[0]
          .replace('select', '')
          .replace('choose', '')
          .trim();
        let filteredProducts = [];
        if (inputArray.length > 1) {
          filteredProducts = products.filter(product => {
            return (
              compareIgnoringSpaces(
                product?.item_details?.descriptor?.name.toLowerCase(),
                productName,
              ) &&
              compareIgnoringSpaces(
                product?.provider_details?.descriptor?.name.toLowerCase(),
                inputArray[1].trim(),
              )
            );
          });
        } else {
          filteredProducts = products.filter(product =>
            compareIgnoringSpaces(
              product?.item_details?.descriptor?.name.toLowerCase(),
              productName,
            ),
          );
        }
        if (filteredProducts.length > 1) {
          showToastWithGravity(
            'There are more than 1 product, please provide more details',
          );
        } else if (filteredProducts.length === 1) {
          const product = filteredProducts[0];
          const routeParams: any = {
            brandId: product.provider_details.id,
          };

          if (product.location_details) {
            routeParams.outletId = product.location_details.id;
          }
          stopAndDestroyVoiceListener().then(() => {
            navigation.navigate('BrandDetails', routeParams);
          });
        }
      } else if (compareIgnoringSpaces('go to cart', input)) {
        stopAndDestroyVoiceListener().then(() => {
          navigation.navigate('Cart');
        });
      }
    }
  }, [userInput, products]);

  useEffect(() => {
    if (searchQuery?.length > 2) {
      searchProducts(page).then(() => {
        voiceDetectionStarted.current = true;
        startVoice().then(() => {});
      });
    } else {
      setTotalProducts(0);
      setProducts([]);
    }
  }, [searchQuery, page]);

  useFocusEffect(
    useCallback(() => {
      if (voiceDetectionStarted.current) {
        setAllowRestarts();
      }
    }, []),
  );

  const itemDetailsToProductModel = (item: any): ProductModel => {
    const {item_details, context} = item;
    const {descriptor, quantity} = item_details;
    const imageUrl =
      descriptor.symbol.length > 0
        ? descriptor.symbol
        : descriptor.images && descriptor.images.length > 0
        ? descriptor.images[0]
        : undefined;
    const measure = quantity?.unitized?.measure;
    const unitizedValue = measure ? `${measure.value} ${measure.unit}` : '';

    const priceObject = item_details.price;
    let price = '';
    let currency = '';
    if (priceObject) {
      price = priceObject.value;
      currency = priceObject.currency;
    }

    return {
      id: item_details.id,
      imageUrl: imageUrl,
      name: descriptor.name,
      price,
      currency,
      tags: descriptor.tags,
      unitizedValue,
      domain: context.domain,
    };
  };

  const horizontalProductList = products => {
    return (
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
      />
    );
  };

  const storeWithProductsComponent = item => {
    const store = providerToStoreModel(item.item);
    return (
      <View style={styles.container}>
        <Store store={store} width={32} />
        {horizontalProductList(item.item.products)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {userInteractionStarted && (
        <ProgressBar indeterminate color={theme.colors.success600} />
      )}
      {productsRequested ? (
        <FlatList
          data={providers}
          renderItem={storeWithProductsComponent}
          keyExtractor={item => item.id}
        />
      ) : (
        <FlatList data={providers} renderItem={storeWithProductsComponent} />
      )}
    </View>
  );
};

const providerToStoreModel = (provider: any): StoreModel => {
  // return with empty values
  return {
    id: provider.id,
    iconUrl: provider.descriptor.symbol ?? '',
    name: provider.descriptor.name ?? '',
    categories: [],
    address: {
      street: '',
      locality: '',
    },
  };
};

export default SearchProducts;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      paddingVertical: 0,
      paddingHorizontal: 8,
      width: '100%',
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 16,
      width: '100%',
    },
    listContainer: {
      paddingHorizontal: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
