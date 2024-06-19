import {StoreModel} from '../modules/main/stores/components/Store';

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
): StoreModel => {
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
    brandId: '', // TODO : fetch brandId for stores providing the search results
  };
};
