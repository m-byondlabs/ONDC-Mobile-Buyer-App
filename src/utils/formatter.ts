import {StoreModel} from '../modules/main/stores/components/Store';
import {ProductModel} from '../modules/main/types/Product';
import {CATEGORIES} from './categories';

export const locationToStoreModels = (locationObj: any): StoreModel[] => {
  return locationObj.map((store: any) => {
    return {
      id: store.id,
      brandId: store.provider,
      name: store.provider_descriptor.name,
      categories: store.categories,
      iconUrl: store.provider_descriptor.symbol,
      address: {
        street: store.address.street,
        locality: store.address.locality,
      },
    };
  });
};

export const searchResultsProviderToStoreModel = (
  provider: any,
  searchQuery: string,
): StoreModel => {
  const {id, address} = provider.location_details;
  const {domain} = provider.context;

  const category = CATEGORIES.find(item => item.domain === domain);
  const categories = category ? [category.name] : ['Category Not Available'];

  return {
    id,
    iconUrl: provider.descriptor.symbol ?? '',
    name: provider.descriptor?.name ?? 'Store Name Not Available',
    categories: categories,
    address,
    brandId: provider.id,
    searchQuery,
  };
};

export const itemDetailsToProductModel = (item: any): ProductModel => {
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
