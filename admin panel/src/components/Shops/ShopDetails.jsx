import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ShopDetails = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await axios.get(`/api/shops/${id}`);
        setShop(response.data);
      } catch (error) {
        console.error('Error fetching shop:', error);
      }
    };

    fetchShop();
  }, [id]);

  if (!shop) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl mb-4">{shop.name}</h2>
      <p className="text-lg">{shop.description}</p>
    </div>
  );
};

export default ShopDetails;
