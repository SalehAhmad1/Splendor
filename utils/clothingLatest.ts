import ClothingItem from '../model/ClothingItemModel';
import { useState } from 'react';

const [clothingData, setClothingData] = useState<ClothingItem[]>([]);

// Add new clothing item (POST request)
export const addClothingItem = async (newItem: ClothingItem) => {
    try {
        const response = await fetch('/api/clothingData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Clothing item added:', data);
        setClothingData([...clothingData, newItem]);
    } catch (error) {
        console.error('Error adding clothing item:', error);
    }
}; 

// Update existing clothing item (PUT request)
export const updateClothingItem = async (updatedItem: ClothingItem) => {
    try {
        const response = await fetch('/api/clothingData', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Clothing item updated:', data);
        setClothingData(clothingData.map(item => (item.id === updatedItem.id ? updatedItem : item)));
    } catch (error) {
        console.error('Error updating clothing item:', error);
    }
};

// Delete existing clothing item (DELETE request)
export const deleteClothingItem = async (id: string, forGender: string, category: string) => {
    try {
        const response = await fetch('/api/clothingData', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, for: forGender, category }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Clothing item deleted:', data);
        setClothingData(clothingData.filter(item => item.id !== id));
    } catch (error) {
        console.error('Error deleting clothing item:', error);
    }
};