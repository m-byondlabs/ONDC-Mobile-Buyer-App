import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import {useSelector} from 'react-redux';

import {FlatList} from 'react-native-gesture-handler';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import useNetworkHandling from '../../../hooks/useNetworkHandling';
import useReadAudio from '../../../hooks/useReadAudio';
import {ProductModel} from '../../../modules/main/types/Product';
import {API_BASE_URL, PRODUCT_SEARCH} from '../../../utils/apiActions';
import {PRODUCT_SUBCATEGORY} from '../../../utils/categories';
import {BRAND_PRODUCTS_LIMIT} from '../../../utils/constants';
import {itemDetailsToProductModel} from '../../../utils/formatter';
import {useAppTheme} from '../../../utils/theme';
import {
  compareIgnoringSpaces,
  showToastWithGravity,
  skeletonList,
} from '../../../utils/utils';
import ProductSkeleton from '../../skeleton/ProductSkeleton';
import Filters from '../Filters';
import ProductSearch from '../ProductSearch';
import ProductsBySubCategory, {SubcategoryModel} from './ProductsBySubCategory';

interface StorePageProducts {
  providerId: any;
  customMenu: any;
  subCategories: any[];
  search?: boolean;
  defaultSearchQuery?: string;
}

const CancelToken = axios.CancelToken;

const StorePageProducts: React.FC<StorePageProducts> = ({
  providerId = null,
  customMenu = null,
  subCategories = [],
  search = false,
  defaultSearchQuery = '',
}) => {
  const voiceDetectionStarted = useRef<boolean>(false);
  const navigation = useNavigation<any>();
  const productSearchSource = useRef<any>(null);
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {language} = useSelector(({authReducer}) => authReducer);
  const {
    startVoice,
    userInteractionStarted,
    userInput,
    stopAndDestroyVoiceListener,
    setAllowRestarts,
  } = useReadAudio(language);
  const [productsRequested, setProductsRequested] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(defaultSearchQuery);
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [selectedAttributes, setSelectedAttributes] = useState<any>({});
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const searchProducts = async (
    pageNumber: number,
    selectedProvider: any,
    selectedMenu: any,
    subCategoryIds: any,
    attributes: any,
  ) => {
    try {
      setProductsRequested(true);

      productSearchSource.current = CancelToken.source();
      let url = `${API_BASE_URL}${PRODUCT_SEARCH}?pageNumber=${pageNumber}&limit=${BRAND_PRODUCTS_LIMIT}`;
      url += selectedProvider ? `&providerIds=${selectedProvider}` : '';
      url += selectedMenu ? `&customMenu=${selectedMenu}` : '';
      url +=
        subCategoryIds.length > 0
          ? `&categoryIds=${subCategoryIds.join(',')}`
          : '';
      Object.keys(attributes).map(key => {
        url += `&${key}=${attributes[key].join(',')}`;
      });

      const {data} = await getDataWithAuth(
        url,
        productSearchSource.current.token,
      );
      setTotalProducts(data.response.count);
      setProducts(data.response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setProductsRequested(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    // Filter the products based on the search query
    return products.filter(
      product =>
        product?.item_details?.descriptor?.name
          ?.toLowerCase()
          .includes(lowerQuery) ||
        product?.provider_details?.descriptor?.name
          ?.toLowerCase()
          .includes(lowerQuery),
    );
  }, [products, searchQuery]);

  const subcategoryIcon = (subcategory: string): number => {
    const NO_IMAGE = require('../../../assets/noImage.png');

    const allCatgories = Object.keys(PRODUCT_SUBCATEGORY);
    let iconUrl = NO_IMAGE;
    allCatgories.forEach(category => {
      const subCategoryList: any[] = PRODUCT_SUBCATEGORY[category];
      const foundSubCategory = subCategoryList.find(
        item => item.value === subcategory,
      );
      if (foundSubCategory) {
        iconUrl = foundSubCategory.imageUrl;
        // break out of the loop
        return;
      }
    });
    return iconUrl;
  };

  const productsGroupedByCategory = useMemo(() => {
    const groupedProducts: any = {};
    filteredProducts.forEach(item => {
      const product = item?.item_details;
      const categoryId = product?.category_id || 'No Category';
      if (!groupedProducts[categoryId]) {
        groupedProducts[categoryId] = [];
      }
      groupedProducts[categoryId].push(item);
    });

    // iterate over all the keys in the object

    const productsByCategory: ProductsBySubCategory[] = [];

    // get all the keys in the object
    Object.keys(groupedProducts).forEach((key: any) => {
      const subcategory: SubcategoryModel = {
        id: key,
        name: key,
        iconUrl: subcategoryIcon(key),
      };

      const produceModels: ProductModel[] = groupedProducts[key].map(
        (item: any) => {
          const model = itemDetailsToProductModel(item);
          return model;
        },
      );

      productsByCategory.push({subcategory, products: produceModels});
    });

    return productsByCategory;
  }, [filteredProducts]);

  useEffect(() => {
    searchProducts(
      page,
      providerId,
      customMenu,
      subCategories,
      selectedAttributes,
    ).then(() => {
      voiceDetectionStarted.current = true;
      startVoice().then(() => {});
    });
  }, [page, providerId, customMenu, subCategories, selectedAttributes]);

  useEffect(() => {
    if (userInput.length > 0) {
      const input = userInput.toLowerCase();
      if (/^(select|choose)\b/i.test(input)) {
        const productName = input
          .replace('select', '')
          .replace('choose', '')
          .trim();
        let selectedProducts = [];
        selectedProducts = products.filter(product =>
          compareIgnoringSpaces(
            product?.item_details?.descriptor?.name.toLowerCase(),
            productName,
          ),
        );
        if (selectedProducts.length > 1) {
          showToastWithGravity(
            'There are more than 1 product, please provide more details',
          );
        } else {
          const product = selectedProducts[0];
          stopAndDestroyVoiceListener().then(() => {
            navigation.navigate('ProductDetails', {productId: product.id});
          });
        }
      } else if (compareIgnoringSpaces('go to cart', input)) {
        stopAndDestroyVoiceListener().then(() => {
          navigation.navigate('Cart');
        });
      }
    }
  }, [userInput, products]);

  useFocusEffect(
    useCallback(() => {
      if (voiceDetectionStarted.current) {
        setAllowRestarts();
      }
    }, []),
  );

  type ProductsBySubCategory = {
    subcategory: SubcategoryModel;
    products: ProductModel[];
  };

  return (
    <View style={styles.container}>
      {userInteractionStarted && (
        <ProgressBar indeterminate color={theme.colors.success600} />
      )}
      <Filters
        selectedAttributes={selectedAttributes}
        setSelectedAttributes={setSelectedAttributes}
        providerId={providerId}
        category={subCategories.length ? subCategories[0] : null}
      />
      <View style={styles.searchContainer}>
        <ProductSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </View>

      {productsRequested ? (
        <View style={styles.listContainer}>
          {skeletonList.map(product => (
            <View key={product.id} style={styles.productContainer}>
              <ProductSkeleton />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={productsGroupedByCategory}
          renderItem={({item}) => (
            <ProductsBySubCategory
              products={item.products}
              subcategory={item.subcategory}
            />
          )}
          keyExtractor={item => item.subcategory.id}
          horizontal={false}
        />
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    productContainer: {
      width: '50%',
      height: 254,
      marginBottom: 12,
    },
    searchContainer: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
    searchBar: {
      borderRadius: 10,
      height: 40,
    },
    searchInput: {
      paddingVertical: 0,
    },
    listContainer: {
      paddingHorizontal: 8,
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default StorePageProducts;
