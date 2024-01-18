import { useState, useEffect } from 'react'
import { InputGroup, Form, Table, Button, Container } from "react-bootstrap";
import { nanoid } from 'nanoid';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import Confetti from 'react-confetti';
import Fuse from 'fuse.js';


// Uygulama ana bileşeni içindeki tüm elemanları sarmak için bir div kullanıyoruz

const AppWrapper = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
`;

const StyledButton = styled(Button)`
  margin-top: 10px;
`;

const StyledTable = styled(Table)`
  margin-top: 20px;
`;

// Ana uygulama bileşeni olan 'App' bileşeni.
function App() {
  // Mağazaları temsil eden bir dizi. Her mağaza bir 'id' ve 'name' özelliğine sahiptir.
  const shops = [
    { "id": 1, "name": "Teknosa" },
    { "id": 2, "name": "Eczane" },
    { "id": 3, "name": "Nike" },
    { "id": 4, "name": "Migros" },
    { "id": 5, "name": "BİM" },
    { "id": 6, "name": "A-101" },
  ];

  // Kategorileri temsil eden bir dizi. Her kategori bir 'id' ve 'name' özelliğine sahiptir.
  const categories = [
    { "id": 1, "name": "Elektronik" },
    { "id": 2, "name": "Sağlık" },
    { "id": 3, "name": "Ayakkabı" },
    { "id": 4, "name": "Şarküteri" },
    { "id": 5, "name": "Fırın" },
    { "id": 6, "name": "Kasap" },
  ];

  // Yeni bir ürün eklemek için kullanılan fonksiyonlar.
  const [productName, setProductName] = useState('');
  const [selectedShop, setSelectedShop] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [products, setProducts] = useState([]);
  const [confettiVisible, setConfettiVisible] = useState(false);

  // Yeni bir ürün eklemek için kullanılan fonksiyon.
  const handleAddProduct = () => {
    const newProduct = {
      id: nanoid(),
      name: productName,
      shop: shops.find((shop) => shop.id === selectedShop),
      category: categories.find((category) => category.id === selectedCategory),
      isBought: false,
    };

    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setProductName('');
  };

  // Ürünün 'Satın Alındı' durumunu değiştirmek için kullanılan fonksiyon.
  const handleToggleBought = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, isBought: !product.isBought } : product
      )
    );
  };

  // Ürünü silmek için kullanılan fonksiyon.
  const handleDeleteProduct = (id) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  };

  // Alert göstererek ve konfeti animasyonu ile alışverişi tamamlandı bildirimi göstermek için kullanılan fonksiyon.
  const showAlertWithConfetti = (message) => {
    // Alert göstermeden önce konfeti animasyonunu başlat.
    setConfettiVisible(true);

    // Alert'i göster.
    alert(message);

    // Konfeti animasyonunu kapat.
    setConfettiVisible(false);
  };

  // Ürünlerde değişiklik olduğunda çalışacak olan 'useEffect'.
  useEffect(() => {
    // Tüm ürünlerin satın alındığı kontrol edilir.
    const isShoppingCompleted = products.every((product) => product.isBought);

    // Satın alınmış tüm ürünler varsa ve ürünlerin sayısı 0'dan büyükse konfeti animasyonunu başlat.
    if (isShoppingCompleted && products.length > 0) {
      showAlertWithConfetti('Alışveriş Tamamlandı!');
      setConfettiVisible(true);

      // Belirli bir süre sonra konfeti animasyonunu kapat.
      setTimeout(() => {
        setConfettiVisible(false);
      }, 3000); // Örneğin, 3 saniye sonra kapat.
    }
  }, [products]);

  // Filtreleme için kullanılan state'ler
  const [filteredShopId, setFilteredShopId] = useState('all');
  const [filteredCategoryId, setFilteredCategoryId] = useState('all');
  const [filteredStatus, setFilteredStatus] = useState('all');
  const [filteredName, setFilteredName] = useState('');

  // Filtrelenmiş ürünleri tutan state
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filtreleme seçenekleri
  const shopOptions = [
    { id: 'all', name: 'Tümü' },
    ...shops,
  ];

  const categoryOptions = [
    { id: 'all', name: 'Tümü' },
    ...categories,
  ];

  const statusOptions = [
    { id: 'all', name: 'Tümü' },
    { id: 'bought', name: 'Satın Alınanlar' },
    { id: 'notBought', name: 'Satın Alınmayanlar' },
  ];

  // Filtreleme butonuna tıklandığında çalışacak fonksiyon
  const handleFilterApply = () => {
    // Filtreleme işlemleri
    const filtered = products.filter((product) => {
      const shopCondition = filteredShopId === 'all' || product.shop.id === parseInt(filteredShopId);
      const categoryCondition = filteredCategoryId === 'all' || product.category.id === parseInt(filteredCategoryId);
      const statusCondition =
        (filteredStatus === 'all') ||
        (filteredStatus === 'bought' && product.isBought) ||
        (filteredStatus === 'notBought' && !product.isBought);
      const nameCondition = product.name.toLowerCase().includes(filteredName.toLowerCase());

      return shopCondition && categoryCondition && statusCondition && nameCondition;
    });

    // Filtrelenmiş ürünleri güncelle
    setFilteredProducts(filtered);
  };

  // Herhangi bir filtre değiştiğinde filtreleme işlemini yeniden yap
  useEffect(() => {
    handleFilterApply();
  }, [filteredShopId, filteredCategoryId, filteredStatus, filteredName, products]);

  // JSX olarak render edilen bileşenler.
  return (
    <>
      {/* Konfeti animasyonunu temsil eden bileşen. */}
      <Container>
        
     
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={confettiVisible ? 300 : 0}
        recycle={true}
      />
      {/* Uygulama bileşeni içindeki tüm diğer bileşenleri saran bir 'div'. */}
      <AppWrapper>
      
        {/* Ürün eklemek için giriş formu. */}
        <InputGroup className="mb-3 py-3">
          <InputGroup.Text id="basic-addon1">Ürün Adı</InputGroup.Text>
          <Form.Control
            placeholder="Ürün Giriniz..."
            aria-label="Username"
            aria-describedby="basic-addon1"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </InputGroup>

        {/* Mağaza seçimi için dropdown. */}
        <Form.Select
          aria-label="Mağaza Seç"
          className='mb-2'
          value={selectedShop}
          onChange={(e) => setSelectedShop(parseInt(e.target.value))}
        >
          <option>MARKET</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>{shop.name}</option>
          ))}
        </Form.Select>

        {/* Kategori seçimi için dropdown. */}
        <Form.Select
          aria-label="Kategori Seç"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
        >
          <option>KATEGORİ</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Form.Select>

        {/* Ürün eklemek için buton. */}
        <StyledButton  variant="primary mb-2 mt-2" onClick={handleAddProduct}>Ürünü Ekle</StyledButton>

        <div className="mb-3">
          <Form.Group controlId="filterShop">
            <Form.Label>Market</Form.Label>
            <Form.Select
              value={filteredShopId}
              onChange={(e) => setFilteredShopId(e.target.value)}
            >
              {shopOptions.map((shop) => (
                <option key={shop.id} value={shop.id}>{shop.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="filterCategory">
            <Form.Label>Kategori</Form.Label>
            <Form.Select
              value={filteredCategoryId}
              onChange={(e) => setFilteredCategoryId(e.target.value)}
            >
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="filterStatus">
            <Form.Label>Durum</Form.Label>
            {statusOptions.map((status) => (
              <Form.Check
                key={status.id}
                type="radio"
                label={status.name}
                value={status.id}
                checked={filteredStatus === status.id}
                onChange={(e) => setFilteredStatus(e.target.value)}
              />
            ))}
          </Form.Group>

          <Form.Group controlId="filterName">
            <Form.Label>Ürün Adı</Form.Label>
            <Form.Control
              type="text"
              value={filteredName}
              onChange={(e) => setFilteredName(e.target.value)}
            />
          </Form.Group>

          {/* <StyledButton  variant="primary" onClick={handleFilterApply}>
            Filtrele
          </StyledButton> */}
        </div>

        {/* Filtrelenmiş ürünlerin listesi */}
        <StyledTable  striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ürün Adı</th>
              <th>Mağaza</th>
              <th>Kategori</th>
              <th>Satın Alındı</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} style={{ textDecoration: product.isBought ? 'line-through' : 'none' }}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.shop.name}</td>
                <td>{product.category.name}</td>
                <td>
                  <Form.Check
                    type="checkbox"
                    label=""
                    checked={product.isBought}
                    onChange={() => handleToggleBought(product.id)}
                  />
                </td>
                <td>
                  <StyledButton  variant="danger" onClick={() => handleDeleteProduct(product.id)}>
                    Sil
                  </StyledButton>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </AppWrapper>
      </Container>
    </>
  )
}

export default App
