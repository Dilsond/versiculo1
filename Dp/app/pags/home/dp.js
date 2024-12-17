import React, { createContext, useState, useContext } from 'react';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([
    { id: '1', name: 'Carro - FIAT 360', price: '$25.99', image: require('../../../assets/images/carros-economicos-1.jpeg') , favorite: false, bookmarked: false },
    { id: '2', name: 'Telefone Antigo', price: '$255.99', image: require('../../../assets/images/615vPLc0dDL._AC_UF1000,1000_QL80_.jpg') , favorite: false, bookmarked: false },
    { id: '3', name: 'Auriculares sem fio', price: '$71.99', image: require('../../../assets/images/aw220226.png') , favorite: false, bookmarked: false },
    { id: '4', name: 'Telefone de Escritório', price: '$884.99', image: require('../../../assets/images/d303884e6128dfb0bd1d2a8fa0b21721.webp'), favorite: false, bookmarked: false },
    { id: '5', name: 'Telefone de Botão', price: '$345.99', image: require('../../../assets/images/D_NQ_NP_871327-MLB52614031027_112022-O.webp'), favorite: false, bookmarked: false },
    { id: '6', name: 'Computador HP', price: '$755.99', image: require('../../../assets/images/surface.webp'), favorite: false, bookmarked: false },
    { id: '7', name: 'Iphone 13pro Max', price: '$255.99', image: require('../../../assets/images/https-s3.amazonaws.com-allied.alliedmktg.com-img-apple-iPhone-2013-iPhone-2013-20Pro-TCDAP872-1.jpg') , favorite: false, bookmarked: false },
    { id: '8', name: 'Carro Peugeot', price: '$44.99', image: require('../../../assets/images/peugeot-e-208.webp') , favorite: false, bookmarked: false },
    { id: '9', name: 'Auscutadores', price: '$878.99', image: require('../../../assets/images/z_0_nb224556_AURICULARES-BLUETOOTH-QUALITYSOUND.jpg') , favorite: false, bookmarked: false },

  ]);

  const toggleFavorite = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, favorite: !product.favorite }
          : product
      )
    );
  };

  const toggleBookmark = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, bookmarked: !product.bookmarked }
          : product
      )
    );
  };

  return (
    <ProductsContext.Provider value={{ products, toggleFavorite, toggleBookmark }}>
      {children}
    </ProductsContext.Provider>
  );
};


export const useProducts = () => useContext(ProductsContext);