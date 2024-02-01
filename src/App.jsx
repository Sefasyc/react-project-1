import { useState, useEffect } from 'react'
import { InputGroup, Form, Table, Button, Container } from "react-bootstrap";
import { nanoid } from 'nanoid';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import Confetti from 'react-confetti';
import Fuse from 'fuse.js';



const AppWrapper = styled.div`
  width: 1000px;
  margin: auto;
  padding: 20px;
  color: #000;
`;

const StyledButton = styled(Button)`
  margin-top: 10px;
  display: block;
  margin: 0 auto;
`;

const StyledTable = styled(Table)`
  margin-top: 20px;
`;

const SectionWithBackground = styled.section`
  background-image: url("../src/assets/photo-1614521084980-811d04f6c6cb.avif");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  /* Diğer background özelliklerini isteğe bağlı olarak ekleyebilirsiniz. */
`;

const InputGroupWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const FilterFormWrapper = styled.div`
  display: flex;
  flex-wrap: wrap; /* Eğer sığmazsa alt satıra geçmesini sağlamak için wrap özelliğini ekleyin */
  gap: 10px; /* Elemanlar arasındaki boşluğu ayarlamak için gap ekleyin */
  align-items: center;
  
`;

const FilterFormGroup = styled(Form.Group)`
  flex: 1; /* Eşit genişlikte paylaştırmak için flex özelliğini ekleyin */
   /* Sıralamayı ayarlamak için order ekleyin */
`;

const FilterStatusWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;




// Ana uygulama bileşeni olan 'App' bileşeni.
function App() {
  // Mağazaları ve kategorileri temsil eden diziler.
  const shops = [
    { "id": 1, "name": "Teknosa" },
    { "id": 2, "name": "Eczane" },
    { "id": 3, "name": "Nike" },
    { "id": 4, "name": "Migros" },
    { "id": 5, "name": "BİM" },
    { "id": 6, "name": "A-101" },
  ];

  const categories = [
    { "id": 1, "name": "Elektronik" },
    { "id": 2, "name": "Sağlık" },
    { "id": 3, "name": "Ayakkabı" },
    { "id": 4, "name": "Şarküteri" },
    { "id": 5, "name": "Fırın" },
    { "id": 6, "name": "Kasap" },
  ];

  // Ürün ekleme için kullanılan state'ler.
  const [productName, setProductName] = useState('');
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
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
      <SectionWithBackground>

        {/* Konfeti animasyonunu temsil eden bileşen. */}
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={confettiVisible ? 300 : 0}
          recycle={true}
        />

        {/* Ana uygulama bileşenini saran bir 'div'. */}
        <AppWrapper>

          {/* Ürün adını girmek için giriş formu. */}
          <InputGroupWrapper>
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

            {/* Mağaza seçimi için açılır menü. */}
            <Form.Select
              aria-label="Mağaza Seç"
              className='mb-3'
              value={selectedShop}
              onChange={(e) => setSelectedShop(parseInt(e.target.value))}
            >
              <option>MARKET</option>
              {/* Mağazaların listesi üzerinde dönerek seçenekleri oluştur. */}
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>{shop.name}</option>
              ))}
            </Form.Select>

            {/* Kategori seçimi için açılır menü. */}
            <Form.Select
              aria-label="Kategori Seç"
              className='mb-3'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
            >
              <option>KATEGORİ</option>
              {/* Kategorilerin listesi üzerinde dönerek seçenekleri oluştur. */}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </InputGroupWrapper>
          {/* Ürün eklemek için buton. */}
          
          <StyledButton variant="primary mb-2 mt-2" onClick={handleAddProduct}>Ürünü Ekle</StyledButton>
          
          <div className="mb-3">
            {/* Filtreleme formu */}
            <FilterFormWrapper>
              <FilterFormGroup controlId="filterName">
                <Form.Label className=' text-white  fw-bold'>Ürün Adı</Form.Label>
                {/* Ürün adı filtresi için metin girişi. */}
                <Form.Control
                  type="text"
                  value={filteredName}
                  onChange={(e) => setFilteredName(e.target.value)}
                />
              </FilterFormGroup>

              <FilterFormGroup controlId="filterShop">
                <Form.Label className='text-white fw-bold'>Market</Form.Label>
                {/* Market filtresi için açılır menü. */}
                <Form.Select
                  value={filteredShopId}
                  onChange={(e) => setFilteredShopId(e.target.value)}
                >
                  {/* Tüm mağazaları gösteren seçenek ve diğer mağazaları listele. */}
                  {shopOptions.map((shop) => (
                    <option key={shop.id} value={shop.id}>{shop.name}</option>
                  ))}
                </Form.Select>
              </FilterFormGroup>

              <FilterFormGroup controlId="filterCategory">
                <Form.Label className='text-white fw-bold'>Kategori</Form.Label>
                {/* Kategori filtresi için açılır menü. */}
                <Form.Select
                  value={filteredCategoryId}
                  onChange={(e) => setFilteredCategoryId(e.target.value)}
                >
                  {/* Tüm kategorileri gösteren seçenek ve diğer kategorileri listele. */}
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Form.Select>
              </FilterFormGroup>

              <FilterStatusWrapper>
                <FilterFormGroup controlId="filterStatus">
                  <Form.Label className='text-white fw-bold'>Durum</Form.Label>
                  {/* Durum filtresi için radyo düğmeleri. */}
                  {statusOptions.map((status) => (
                    <Form.Check className='d-flex gap-1 text-white fw-bold'
                      key={status.id}
                      type="radio"
                      label={status.name}
                      value={status.id}
                      checked={filteredStatus === status.id}
                      onChange={(e) => setFilteredStatus(e.target.value)}
                    />
                  ))}
                </FilterFormGroup>
              </FilterStatusWrapper>

            </FilterFormWrapper>
          </div>

          {/* Ürünleri listeleyen tablo. */}
          <StyledTable striped bordered hover>
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
              {/* Filtrelenmiş ürünleri listeleyen satırlar. */}
              {filteredProducts.map((product) => (
                <tr key={product.id} style={{ textDecoration: product.isBought ? 'line-through' : 'none' }}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.shop.name}</td>
                  <td>{product.category.name}</td>
                  <td>
                    {/* Ürünün satın alındı durumunu değiştirmek için checkbox. */}
                    <Form.Check
                      type="checkbox"
                      label=""
                      checked={product.isBought}
                      onChange={() => handleToggleBought(product.id)}
                    />
                  </td>
                  <td>
                    {/* Ürünü silmek için düğme. */}
                    <StyledButton variant="danger" onClick={() => handleDeleteProduct(product.id)}>
                      Sil
                    </StyledButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </AppWrapper>

      </SectionWithBackground>
    </>
  )
}

export default App