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

const domainToCategories = (domain: string): string => {
  const category = CATEGORIES.find(item => item.domain === domain);
  return category ? category.name : 'Category Not Available';
};

export const searchResultsProviderToStoreModel = (
  provider: any,
  searchQuery: string,
): StoreModel => {
  const {id, address} = provider.location_details;
  const {domain} = provider.context;

  const categories = domainToCategories(domain);

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

const quantityToUnitizedValue = (quantity: any): string => {
  const {measure} = quantity.unitized;
  return `${measure.value} ${measure.unit}`;
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

  const moreOptions = item_details.parent_item_id ? true : false;

  return {
    id: item.id,
    imageUrl: imageUrl,
    name: descriptor.name,
    price,
    currency,
    tags: descriptor.tags,
    unitizedValue,
    domain: context.domain,
    moreOptions,
  };
};

export type StoreWithProducts = {
  store: StoreModel;
  products: ProductModel[];
};

export const filterCartByProvider = (cartItems: any[], providerId?: string) => {
  if (!providerId) {
    return cartItems;
  }
  return cartItems.filter(item => item.item.provider.id === providerId);
};

export const totalQuantityCount = (cartItems: any[]): number => {
  return cartItems.reduce((acc, item) => acc + item.item.quantity.count, 0);
};

export const groupCartByProvider = (cartItems: any[]): StoreWithProducts[] => {
  let carts: any[] = [];
  cartItems.forEach((item: any) => {
    const availableProvider = carts.find(
      (cartItem: any) => cartItem.provider.id === item.item.provider.id,
    );

    const productWithQuantity = {
      ...item.item.product,
      cartQuantity: item.item.quantity,
      cartItemId: item._id,
    };

    if (availableProvider) {
      availableProvider.items.push(productWithQuantity);
    } else {
      carts.push({
        provider: item.item.provider,
        items: [productWithQuantity],
      });
    }
  });

  const storesWithProducts: StoreWithProducts[] = [];

  carts.forEach((cart: any) => {
    const store: StoreModel = {
      id: cart.provider.id,
      brandId: cart.provider.id,
      name: cart.provider.descriptor.name,
      iconUrl: cart.provider.descriptor.symbol,
      categories: [], // TODO read from tags servicability
      address: cart.provider.locations[0].address,
    };

    const productModels = cart.items.map((item: any) => {
      return {
        id: item.id,
        imageUrl: item.descriptor.symbol,
        name: item.descriptor.name,
        price: item.price.value,
        currency: item.price.currency,
        tags: item.tags,
        unitizedValue: quantityToUnitizedValue(item.quantity),
        domain: '',
        cartQuantity: item.cartQuantity.count,
        cartItemId: item.cartItemId,
      };
    });

    storesWithProducts.push({store, products: productModels});
  });

  return storesWithProducts;
};
