import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import ProductSearchResult from '../../modules/main/provider/components/ProductSearchResult';
import Store from '../../modules/main/stores/components/Store';
import {ProductModel} from '../../modules/main/types/Product';
import {searchResultsProviderToStoreModel} from '../../utils/formatter';
import {useAppTheme} from '../../utils/theme';

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

const ProductsByStore = ({
  products,
  searchQuery,
}: {
  products: any[];
  searchQuery: string;
}) => {
  const [providers, setProviders] = useState<any[]>([]);
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  useEffect(() => {
    const massageSearchResponse = () => {
      const providerMap = new Map();

      products
        .map((product: any) => {
          const provider = product.provider_details;
          provider.location_details = product.location_details;
          provider.context = product.context;
          return provider;
        })
        .forEach((provider: any) => {
          // Use provider ID as the key to ensure uniqueness
          if (!providerMap.has(provider.id)) {
            providerMap.set(provider.id, provider);
          }
        });

      providerMap.forEach((provider: any) => {
        const providerProducts = products
          .filter((product: any) => product.provider_details.id === provider.id)
          .map((product: any) => {
            // Create a shallow copy of the product without provider_details
            const {provider_details, ...productWithoutProviderDetails} =
              product;
            return productWithoutProviderDetails;
          });
        provider.products = providerProducts;
      });

      setProviders(Array.from(providerMap.values()));

      // group products by provider
    };
    massageSearchResponse();
  }, [products]);

  const renderItem = useCallback(({item}) => {
    return (
      <ProductSearchResult product={itemDetailsToProductModel(item)} search />
    );
  }, []);

  const horizontalProductList = productList => {
    return (
      <FlatList
        data={productList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
      />
    );
  };

  const storeWithProductsComponent = useCallback(item => {
    const store = searchResultsProviderToStoreModel(item.item, searchQuery);
    return (
      <View style={styles.container}>
        <Store store={store} width={32} />
        {horizontalProductList(item.item.products)}
      </View>
    );
  }, []);

  return (
    <FlatList
      data={providers}
      renderItem={storeWithProductsComponent}
      keyExtractor={item => item.id}
    />
  );
};

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

export default ProductsByStore;
