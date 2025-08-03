export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import ClothingItem from '@/model/ClothingItemModel';
import fs from 'fs';
import path from 'path';

// GET method to fetch clothing data
export async function GET(req: NextRequest) {
    try {
        const baseDir = path.join(process.cwd(), 'public', 'data');
        console.log('Base directory:', baseDir);
        const clothingData: ClothingItem[] = [];

        const categories = ['men', 'women'];

        for (const gender of categories) {
            const genderDir = path.join(baseDir, gender);
            console.log('Gender directory:', genderDir);
            
            if (!fs.existsSync(genderDir)) {
                console.error(`Directory not found: ${genderDir}`);
                continue;
            }
            
            const categoryDirs = fs.readdirSync(genderDir);
            console.log('Category directories:', categoryDirs);

            for (const category of categoryDirs) {
                const categoryDir = path.join(genderDir, category);
                console.log('Category directory:', categoryDir);
                
                if (!fs.existsSync(categoryDir)) {
                    console.error(`Directory not found: ${categoryDir}`);
                    continue;
                }
                
                const files = fs.readdirSync(categoryDir);
                console.log('Files found:', files);
                
                // Only process image files
                const imageFiles = files.filter(file => 
                    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
                );
                
                console.log('Image files:', imageFiles);

                imageFiles.forEach(image => {
                    const id = path.basename(image, path.extname(image));
                    // Use URL-friendly paths for images with forward slashes
                    const imagePath = `/data/${gender}/${category}/${image}`;
                    
                    const clothingItem = {
                        id,
                        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Name To be decided`,
                        description: 'To be written',
                        for: gender,
                        category,
                        price: 0,
                        image: imagePath,
                    };
                    console.log('Adding clothing item:', clothingItem);
                    clothingData.push(clothingItem);
                });
            }
        }

        console.log('Clothing data fetched successfully:', clothingData);
        return NextResponse.json(clothingData, { status: 200 });
    } catch (error) {
        console.error('Error fetching clothing data:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch clothing data',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

// POST method to add new clothing data
export async function POST(req: NextRequest) {
    try {
        const newClothingItem: ClothingItem = await req.json();
        const baseDir = path.join(process.cwd(), 'public', 'data', newClothingItem.for, newClothingItem.category);
        console.log('Base directory for saving:', baseDir);

        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir, { recursive: true });
        }

        const filePath = path.join(baseDir, `${newClothingItem.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(newClothingItem, null, 2));

        console.log('New clothing item added:', newClothingItem);
        return NextResponse.json({ message: 'Clothing item added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error adding clothing item:', error);
        return NextResponse.json({ 
            error: 'Failed to add clothing item',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

// PUT method to update existing clothing data
export async function PUT(req: NextRequest) {
    try {
        const updatedClothingItem: ClothingItem = await req.json();
        const baseDir = path.join(process.cwd(), 'public', 'data', updatedClothingItem.for, updatedClothingItem.category);
        console.log('Base directory for updating:', baseDir);

        const filePath = path.join(baseDir, `${updatedClothingItem.id}.json`);
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Clothing item not found' }, { status: 404 });
        }

        fs.writeFileSync(filePath, JSON.stringify(updatedClothingItem, null, 2));

        console.log('Clothing item updated:', updatedClothingItem);
        return NextResponse.json({ message: 'Clothing item updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating clothing item:', error);
        return NextResponse.json({ error: 'Failed to update clothing item' }, { status: 500 });
    }
}

// DELETE method to delete existing clothing data
export async function DELETE(req: NextRequest) {
    try {
        const { id, for: forGender, category } = await req.json();
        const baseDir = path.join(process.cwd(), 'public', 'data', forGender, category);
        console.log('Base directory for deleting:', baseDir);

        const filePath = path.join(baseDir, `${id}.json`);
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Clothing item not found' }, { status: 404 });
        }

        fs.unlinkSync(filePath);

        console.log('Clothing item deleted:', id);
        return NextResponse.json({ message: 'Clothing item deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting clothing item:', error);
        return NextResponse.json({ error: 'Failed to delete clothing item' }, { status: 500 });
    }
}
