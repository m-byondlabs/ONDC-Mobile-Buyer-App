import {StoreModel} from '../modules/main/stores/components/Store';
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

  return {
    id,
    iconUrl: provider.descriptor.symbol ?? '',
    name: provider.descriptor.name ?? '',
    categories: [category.name],
    address,
    brandId: provider.id,
    searchQuery,
  };
};
